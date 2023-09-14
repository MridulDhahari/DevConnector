// import axios from 'axios';
// import {REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,
//     LOGIN_SUCCESS,
//     LOGIN_FAIL,
//     LOGOUT,
//     CLEAR_PROFILE
// } from './types';
// import {setAlert} from './alert';
// import setAuthToken from '../utils/setAuthToken';

// //load user
// export const loadUser = () => async dispatch => {
//     if(localStorage.token){
//         setAuthToken(localStorage.token);
//     }
//     try{
//         const res= await axios.get('/api/auth');
//         dispatch({
//             type: USER_LOADED,
//             payload: res.data
//         })
//     }catch(err){
//         dispatch({
//             type: AUTH_ERROR
//         });

//     }
// }

// //register user
// export const register = ({name,email,password}) => async dispatch =>{
//     const config = {
//         headers:{
//             'Content-Type': 'application/json'
//         }
//     }

//     const body = JSON.stringify({name,email,password});

//     try{
//         const res = await axios.post('api/users',body,config);
//         dispatch({
//             type : REGISTER_SUCCESS,
//             payload: res.data
//         });
//         dispatch(loadUser());
    
//     }catch(err){
//         const errors = err.response.data.errors;
//         if(errors){
//             errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
//         }
//         dispatch({
//             type: REGISTER_FAIL
//         });
//     }
// }

// //login user
// export const login = (email,password) => async dispatch =>{
//     const config = {
//         headers:{
//             'Content-Type': 'application/json'
//         }
//     }

//     const body = JSON.stringify({email,password});

//     try{
//         const res = await axios.post('api/auth',body,config);
//         dispatch({
//             type : LOGIN_SUCCESS,
//             payload: res.data
//         });
//         dispatch(loadUser());
//     }catch(err){
//         const errors = err.response.data.errors;
//         if(errors){
//             errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
//         }
//         dispatch({
//             type: LOGIN_FAIL,
//         });
//     }
// }

// //Logout / clear
// export const logout = () => dispatch => {
//     dispatch({ type: CLEAR_PROFILE});
//     dispatch({ type: LOGOUT });
    
// }


import api from '../utils/api';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/users', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => ({ type: LOGOUT });
