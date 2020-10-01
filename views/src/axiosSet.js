import axios from 'axios'
import initialState from './store/initialState'
import { apiURL } from './config'

// const baseURL = 'http://localhost:3100'

axios.defaults.baseURL = apiURL
if(localStorage.getItem('localToken')){
  axios.defaults.headers.common['Authorization'] = 'bearer ' + initialState.token
  axios.defaults.headers.common['userId'] = initialState.userId
  axios.defaults.headers.common['userType'] = initialState.usertype
}else if(localStorage.getItem('token')){
  axios.defaults.headers.common['Authorization'] = 'bearer ' + initialState.token
  axios.defaults.headers.common['tokenId'] = initialState.tokenId
  axios.defaults.headers.common['userId'] = initialState.userId
  axios.defaults.headers.common['userType'] = initialState.usertype
}

var checkTokenStatusLocalAx=(timer)=> {
  console.log('work')
  if(localStorage.getItem('localToken')){
    axios.defaults.headers.common['Authorization'] = 'bearer ' + localStorage.getItem('localToken')
    axios.defaults.headers.common['userId'] = localStorage.getItem('useId')
    axios.defaults.headers.common['userType'] = localStorage.getItem('type')
    clearInterval(timer)
  }else if(localStorage.getItem('token')){
    axios.defaults.headers.common['Authorization'] = 'bearer ' + localStorage.getItem('token')
    axios.defaults.headers.common['tokenId'] = localStorage.getItem('tokenid')
    axios.defaults.headers.common['userId'] = localStorage.getItem('useId')
    axios.defaults.headers.common['userType'] = localStorage.getItem('type')
    clearInterval(timer)
  }
}

axios.interceptors.request.use(config => {
  if(window.location.href==='http://localhost:3000/login'){
    var timer = setInterval(checkTokenStatusLocalAx(timer), 700);
  }
  return config
})

axios.interceptors.response.use(res => {
  // console.log(res.data)
  // if (res.data){
  //   if(res.data.data){
  //     if(res.data.data.login){
  //       if(res.data.data.login.token){
  //         axios.defaults.headers.common['Authorization'] = 'bearer ' + res.data.data.login.token
  //       }
  //     }
  //     else if(res.data.data.googleLogin){
  //       if(res.data.data.googleLogin.token){
  //         axios.defaults.headers.common['Authorization'] = 'bearer ' + res.data.data.googleLogin.token
  //       }
  //     }
  //   }
  // }
  return res
})

export default axios