// import axios from 'axios';

// const setAuthToken = token =>{
//     if(token){
//         axios.defaults.headers.common['x-auth-token'] = token;
//     }else{
//         delete axios.defaults.headers.common['x-auth-token'];
//     }
// }

// export default setAuthToken;

import api from './api';

// store our JWT in LS and set axios headers if we do have a token

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;