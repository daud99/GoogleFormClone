import axios from 'axios'
import initialState from './store/initialState'
import { apiURL } from './config'

// const baseURL = 'http://localhost:3100'

axios.defaults.baseURL = apiURL

// if(localStorage.getItem('localToken')){
//   axios.defaults.headers.common['Authorization'] = 'bearer ' + initialState.token
//   axios.defaults.headers.common['userId'] = initialState.userId
//   axios.defaults.headers.common['userType'] = initialState.usertype
// }else if(localStorage.getItem('token')){

//   axios.defaults.headers.common['tokenId'] = initialState.tokenId
//   axios.defaults.headers.common['userId'] = initialState.userId
//   axios.defaults.headers.common['userType'] = initialState.usertype
// }

axios.interceptors.request.use(config => {
  return config
})

axios.interceptors.response.use(res => {
  console.log(res.data)
  if (res.data){
    if(res.data.data){
      if(res.data.data.login){
        if(res.data.data.login.token){
          axios.defaults.headers.common['Authorization'] = 'bearer ' + res.data.data.login.token
        }
      }
      else if(res.data.data.googleLogin){
        if(res.data.data.googleLogin.token){
          axios.defaults.headers.common['Authorization'] = 'bearer ' + res.data.data.googleLogin.token
        }
      }
    }
  }
  return res
})

export default axios