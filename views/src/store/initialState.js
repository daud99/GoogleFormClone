const initialState = {
  token: '' || localStorage.getItem('localToken') || localStorage.getItem('token'),
  tokenId: '' || localStorage.getItem('tokenid'),
  userId: '' || localStorage.getItem('useId'),
  usertype: '' || localStorage.getItem('type'),
}

export default initialState;