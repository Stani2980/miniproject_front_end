import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

class Login extends Component {
  constructor(props) {
    super(props);

    ///// REMOVE DEFAULT AFTER TESTTING
    this.state = {
      username: 'test',
      password: 'test',
      distance: 0
    }
  }

  // THIS COULD HAVE BEEN ONE HANDLER TBD
  handleUsername = (text) => {
    this.setState({ username: text })
  }
  handlePassword = (text) => {
    this.setState({ password: text })
  }
  handleDistance = (nr) => {
    this.setState({ distance: nr })
  }

  render() {

    return (
      <View style={styles.container}>

        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Username"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={this.handleUsername} />

        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          textContentType="password"
          placeholder="Password"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={this.handlePassword}
          secureTextEntry />

        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Distance to friends (km)"
          keyboardType='numeric'
          placeholderTextColor="#9a73ef"
          onChangeText={this.handleDistance}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={
            () => this.props.login(this.state.username, this.state.password, this.state.distance)
          }>
          <Text style={styles.buttonText}> Login </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={
            () => this.props.cancelLogin()
          }>
          <Text style={styles.buttonText}> Cancel login </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
export default Login

const styles = StyleSheet.create({
  container: {
    paddingTop: 23
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,

  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    margin: 15,
    height: 40,

  }
})