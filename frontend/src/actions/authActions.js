import { returnErrors } from './errorActions';
import axios from 'axios';
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types';
const ip = "http://localhost:4000/";



// verificar token y cargar usuario
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });
    axios.get(ip + 'api/users/auth/user', tokenConfig(getState))
        .then(res => dispatch ({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

// Registrar user
export const register = ({ nombre, correo, contrasena, rol }) => dispatch =>{
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({nombre, correo, contrasena, rol});
    axios.post(ip + 'api/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            });
        })
};

// login user
export const login = ({ correo, contrasena }) => dispatch =>{
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ correo, contrasena });
    axios.post(ip + 'api/users/auth', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            });
        })
};


// Logout user
export const logout = () => {
    return{
        type: LOGOUT_SUCCESS
    }
}

//setup config/headers and token
export const tokenConfig = getState => {
    // obtener token de localstorage
    const token = getState().auth.token;

    // headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    // if token , anadir a los headers
    if(token){
        config.headers['x-auth-token'] = token;
    }
    return config;
}