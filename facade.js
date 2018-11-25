import { handleHttpErrors, makeFetchOptions } from './fetchReduce';

const URL = "http://f04474f6.ngrok.io/api/"
const login = async (username, password, longitude, latitude, distance, pushToken) => {
    const body = { username, password, longitude, latitude, distance, pushToken }
    console.log('For testing notifications : ' + JSON.stringify(body))
    const friends = await fetch(`${URL}/user/login`, makeFetchOptions('POST', body)).then(handleHttpErrors)
    if (friends.length < 1) {
        throw new Error('There are no friends near you at this distance...');
    }
    return friends;
}

const getGame = async (longitude, latitude) => {
    const gamearea = await fetch(`${URL}position/gamearea`, makeFetchOptions('POST', { longitude, latitude })).then(handleHttpErrors)
    return gamearea;
}


export { login, getGame }