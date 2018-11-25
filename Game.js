import React, { Component } from 'react'
import { Platform, StyleSheet, View, Button } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { getGame } from './facade';

export default class Game extends Component {
    constructor(props) {
        super(props)
        this.region = props.region;
        this.cancelGame = props.cancelGame;
        this.state = {
            game: false
        }
    }
    async componentDidMount() {
        let game = await getGame(this.region.latitude, this.region.longitude);
        this.setState({ game: game })
    }

    cancel = () => {
        this.cancelGame()
    }
    render() {
        game = () => {
            if (this.state.game) {
                const polygon = this.state.game.geometry.coordinates[0].map(coordsArr => {
                    let coords = {
                        latitude: coordsArr[1],
                        longitude: coordsArr[0],
                    }
                    return coords;
                });
                return (<Polygon
                    coordinates={polygon}
                    fillColor='rgba(0, 255, 204, 0.5)'
                />)
            }
            return null;
        }
        markers = () => {
            if (this.state.game) {
                return this.state.game.properties.playersInArea.map((player, index) => (
                    < Marker
                        key={player.user.userName}
                        coordinate={{ longitude: player.loc.coordinates[0], latitude: player.loc.coordinates[1] }}
                        title={player.user.userName}
                        // THIS IS A HOTFIX RESULT OF SOMETHING WIERD IN BACKEND
                        description={Math.ceil(this.state.game.properties.distances[index]) + ' meters from you'}
                        pinColor={'blue'}
                    />)
                )
            }
            return null;
        }
        return (
            <View style={styles.mainContainer}>
                <MapView style={{ flex: 1 }}
                    initialRegion={this.region}
                    region={this.region}
                >
                    <Marker
                        key={'me'}
                        coordinate={{ latitude: this.region.latitude, longitude: this.region.longitude }}
                        title={'You'}
                        description={'Current location'}
                    />
                    {game()}
                    {markers()}
                </MapView>
                <View >
                    <Button title='Close game' onPress={() => this.cancel()} />
                </View>
            </View>
        )
    }
}

const padding = Platform.OS === 'android' ? 20 : 0;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: 'relative',
        paddingTop: padding
    },

})

