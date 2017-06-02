import {
  AsyncStorage
} from 'react-native';
import { Toast } from 'native-base';
const rootEndPoint = `https://bch-app-beta.azurewebsites.net/`;

export async function HTTP(uri, method, payload) {
  console.log('login');
  console.log(payload);
  const params = {
    method: method,
    headers: {
    'Content-Type': 'application/json',
    }
  }

  if (payload) {
    params.body = JSON.stringify(payload);
  }
  const url = `${rootEndPoint}${uri}`;
  const response = await fetch(url, params);
  return response;

}

export async function setItem(key, data) {
  const response = await AsyncStorage.setItem(key,JSON.stringify(data));
  return response;
}

export async function deleteItem(key) {
  const response = await AsyncStorage.removeItem(key);
  return response;
}

export async function getItem(key) {
  const data = await AsyncStorage.getItem(key);
  const response = JSON.parse(data);
  return response;
}

export async function emailCheck(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(s);
}

export  function executeMsg(msg) {
  Toast.show({
    supportedOrientations: ['potrait','landscape'],
    text: msg,
    position: 'bottom',
    buttonText: 'Okay',
    duration: 2000
  })
}
