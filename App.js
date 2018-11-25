import React, { Component } from 'react';
import { Location, Permissions, Notifications } from 'expo';
import { Text, View, Button, StyleSheet, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Login from './Login';
import Game from './Game';
import { login } from './facade';


export class App extends Component {
    state = {
        friends: [],
        errorMessage: '',
        region: {
            latitude: 55.53,
            longitude: 10.2,
            latitudeDelta: 5,
            longitudeDelta: 5,
        },
        login: false,
        game: false,

    }

    async componentDidMount() {
        await this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }
        //
        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

        this._notificationSubscription = Notifications.addListener(this._handleNotification);

        this.setState({
            region: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
            }
        });
    };

    _handleNotification = (notification) => {
        const msg = notification.data;
        const message = `User ${msg.username} just got online. Located at ${msg.latitude}, ${msg.longitude}`
        Alert.alert(message);
        this.setState({ notification: message });
    };

    login = async (username, password, distance) => {
        let friends = [];
        // Get the token that uniquely identifies this device
        let pushToken = await Notifications.getExpoPushTokenAsync();
        try {
            friends = await login(username, password, this.state.region.longitude, this.state.region.latitude, distance, pushToken)
        } catch (error) {
            console.log("---- ERROR ------")
            return this.setState({ errorMessage: error.message, login: true })
        }
        if (friends.error) {
            return this.setState({ errorMessage: friends.message, login: true })
        }
        this.setState({ friends, login: false })
    }

    cancelLogin = () => this.setState({ login: false })

    game = () => this.setState({ game: true })

    cancelGame = () => this.setState({ game: false })


    render() {

        const markers = () => {
            if (this.state.friends.length !== 0) {
                return this.state.friends.map(marker => (
                    < Marker
                        key={marker.username}
                        coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
                        title={marker.username}
                        description={Math.ceil(marker.distanceToUser) + ' meters from player'}
                        pinColor={'blue'}
                    />))
            }
            return null;
        }
        const loginButtonView = () => {
            if (this.state.friends.length !== 0) {
                return false;
            }
            return (<View>
                <Button title='Login' onPress={() => this.setState({ login: true })} />
            </View>)
        }
        const gameButton = () => (<View style={styles.gameButton}>
            <Button title='Go to game (Game area in humlebæk)' onPress={() => this.setState({ game: true })} />
        </View>)

        // If login button is pressed
        if (this.state.login) {
            return (<View style={styles.mainContainer}>
                <Text style={styles.errors}>
                    {this.state.errorMessage}
                </Text>
                <Login login={this.login} cancelLogin={this.cancelLogin} />
            </View>)
        } else if (this.state.game) {
            return <Game region={this.state.region} cancelGame={this.cancelGame} />
        } else {
            // show initial map and after login with markers
            return (
                <View style={styles.mainContainer}>
                    <MapView style={{ flex: 1 }}
                        initialRegion={this.state.region}
                        region={this.state.region}
                    >
                        <Marker
                            key={'me'}
                            coordinate={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude }}
                            title={'You'}
                            description={'Current location'}
                        />
                        {markers()}
                    </MapView >
                    {loginButtonView()}
                    {gameButton()}
                </View>
            )
        }
    }
}
const padding = Platform.OS === 'android' ? 20 : 0;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: 'relative',
        paddingTop: padding
    },
    loginContainer: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errors: {
        color: 'red',
        alignItems: 'center',

    },
    gameButton: {
        backgroundColor: 'yellow',

    }
})

export default App 