import initialState from './initialState'; 

const reducer = (state = initialState, action) => {
  if (action.type === 'SETTOKEN'){
    return {
      token: action.token
    }
  }
  if (action.type === 'SETUSERID'){
    return {
      userId: action.userId
    }
  }
  if (action.type === 'SEUSERTYPE'){
    return {
      usertype: action.usertype
    }
  }
  return state;
}

export default reducer;