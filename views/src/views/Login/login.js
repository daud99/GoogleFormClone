import React, {Component} from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import { Link } from 'react-router-dom';

// core components
import Card from "components/Card/Card.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import avatar from "assets/img/faces/marc1.jpg";
import axios from '../../axiosSet';
import { GoogleLogin } from 'react-google-login';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles : {
        cardCategoryWhite: {
          color: "rgba(255,255,255,.62)",
          margin: "0",
          fontSize: "14px",
          marginTop: "0",
          marginBottom: "0"
        },
        cardTitleWhite: {
          color: "#FFFFFF",
          marginTop: "0px",
          minHeight: "auto",
          fontWeight: "300",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          marginBottom: "3px",
          textDecoration: "none"
        }
      },
      email:'',
      password:'',

      resetPassAllow:false,
      succes:false,
      succesMsg:'',
      errr:false,
      errrMsg:''
    };
    this.resetPasswordAllow = this.resetPasswordAllow.bind(this);
    this.resetPasswordDissAllow = this.resetPasswordDissAllow.bind(this);

    this.resetPass = this.resetPass.bind(this);

  }

  componentDidMount() {
    if(localStorage.getItem('token')){
      console.log('Token found.')
      this.props.history.push('/admin/dashboard')
    }else if(localStorage.getItem('localToken')){
      console.log('Local Token found.')
      this.props.history.push('/admin/dashboard')
    }
    else{
      console.log('Not LoggedIN');
    }
  }
  resetEmail=''
  data={email:'',password:''}
  handleEmail = event => {
    this.data.email= event.target.value;
  }
  handleEmailReset = event => {
    this.resetEmail= event.target.value;
  }
  handlePassword1 = event => {
    this.data.password= event.target.value;
  }
  // local login
  loginMethod=()=> {
    console.log(window.location.href)
    this.setState({
      email:this.data.email,
      password:this.data.password,
    },()=>{
      const user = {email:this.state.email,password:this.state.password};
      console.log(user);
      let q = `query {
        login(email: "${user.email}", password: "${user.password}"){
          userId
          token
          tokenExpiration
          name
          email
          type
        }
      }`;
      axios.post('/graphql',{
        query: q
      }).then((res) => {
        if(res.data.data.login) {
          if(res.data.data.login.token) {
            this.setState({errr:false});
                  this.setState({errr:false});
                  this.setState({succes:true});
                  this.setState({succesMsg:"You are logged in successfully"});
                  if(localStorage.getItem("token")){
                    localStorage.removeItem("token");
                    localStorage.removeItem("tokenid");
                    localStorage.removeItem("photo");
                  }
                  localStorage.setItem("localToken",res.data.data.login.token);
                  localStorage.setItem("useId",res.data.data.login.userId);
                  localStorage.setItem("name",res.data.data.login.name);
                  localStorage.setItem("type",res.data.data.login.type);
                  localStorage.setItem("email",res.data.data.login.email);
                  this.props.onTokenGet(res.data.data.login.token);
                  this.props.onUserIdGet(res.data.data.login.userId);
                  this.props.onUserTypeGet(res.data.data.login.type);

                  setTimeout(() => {
                    this.props.history.push(`/admin/dashboard`)
                  }, 700)
          } else {
            this.setState({errr:true});
            this.setState({succes:false});
            this.setState({errrMsg:"Error logging in!"});
          }
        } else if(res.data.errors) {
          if(res.data.errors[0].message){
            this.setState({errr:true});
            this.setState({succes:false});
            this.setState({errrMsg:res.data.errors[0].message});
          }
          else{
            this.setState({errr:true});
            this.setState({succes:false});
            this.setState({errrMsg:"Something went wrong"});
          }
          
      }
       
      });
    //   axios.post('/user/login', user)
    //   .then(res => {
    //     // console.log(res.data);
    //     if(res.data.msg){
    //       this.setState({errr:false});
    //       this.setState({succes:true});
    //       this.setState({succesMsg:res.data.msg});
    //       if(localStorage.getItem("token")){
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("tokenid");
    //         localStorage.removeItem("photo");
    //       }
    //       localStorage.setItem("localToken",res.data.token);
    //       localStorage.setItem("useId",res.data.user._id);
    //       localStorage.setItem("name",res.data.user.name);
    //       localStorage.setItem("type",res.data.user.type);
    //       localStorage.setItem("email",res.data.user.email);

    //       this.props.onTokenGet(res.data.token);
    //       this.props.onUserIdGet(res.data.user._id);
    //       this.props.onUserTypeGet(res.data.user.type);

    //       setTimeout(() => {
    //         this.props.history.push(`/admin/dashboard`)
    //       }, 500)
    //     }
    //     else if(res.data.errmsg){
    //       this.setState({errr:true});
    //       this.setState({succes:false});
    //       this.setState({errrMsg:res.data.errmsg});
    //     }
    //   });
    });
  }
  // --------------------------------------

  responseGoogleSuccess =(response)=>{
    console.log(response)
    let q = `query {
      googleLogin(tokenID: "${response.tokenId}"){
        userId
        token
        tokenExpiration
        name
        email
        type
        photo
        createdAt
      }
    }`;
    axios.post('/graphql',{
      query: q
    }).then((res)=>{
      if("googleLogin" in res.data.data) {
        if("token" in res.data.data.googleLogin){
          this.setState({errr:false});
          this.setState({succes:true});
          this.setState({succesMsg:"LoggedIn successfully"});
          if(localStorage.getItem("localToken")){
            localStorage.removeItem("localToken")
          }
          // here only token or tokenid needs to get set but both are getting set?

          // localStorage.setItem("token",response.tokenId);
          localStorage.setItem("token",res.data.data.googleLogin.token);
          localStorage.setItem("useId",res.data.data.googleLogin.userId);
          localStorage.setItem("name",res.data.data.googleLogin.name);
          localStorage.setItem("type",res.data.data.googleLogin.type);
          localStorage.setItem("photo",res.data.data.googleLogin.photo);
          localStorage.setItem("email",res.data.data.googleLogin.email);
          localStorage.setItem("createdAt",res.data.data.googleLogin.createdAt);
          localStorage.setItem("tokenid",res.data.data.googleLogin.token);
          // localStorage.setItem("tokenid",response.tokenId);

          this.props.onTokenGet(response.tokenId);
          this.props.onUserIdGet(res.data.data.googleLogin._id);
          this.props.onUserTypeGet(res.data.data.googleLogin.type);

          setTimeout(() => {
            this.props.history.push(`/admin/dashboard`)
          }, 500);
        } else{
          this.setState({errr:true});
          this.setState({succes:false});
          this.setState({errrMsg:"Something went wrong"});
        }
      } else{
        this.setState({errr:true});
        this.setState({succes:false});
        this.setState({errrMsg:"Something went wrong"});
      }
    });
    // axios.post('/user/googleLogin',{tokenID:response.tokenId}).then(respon=>{
    //   console.log(respon);
    //   if(respon.data.token){
    //     this.setState({errr:false});
    //     this.setState({succes:true});
    //     this.setState({succesMsg:"LoggedIn successfully"});
    //     if(localStorage.getItem("localToken")){
    //       localStorage.removeItem("localToken")
    //     }
    //     // localStorage.setItem("token",respon.data.token);
    //     localStorage.setItem("useId",respon.data.user._id);
    //     localStorage.setItem("name",respon.data.user.name);
    //     localStorage.setItem("type",respon.data.user.type);
    //     localStorage.setItem("photo",respon.data.user.photo);
    //     localStorage.setItem("email",respon.data.user.email);
    //     localStorage.setItem("createdAt",respon.data.user.createdAt);
    //     localStorage.setItem("tokenid",response.tokenId);

    //     this.props.onTokenGet(response.tokenId);
    //     this.props.onUserIdGet(respon.data.user._id);
    //     this.props.onUserTypeGet(respon.data.user.type);

    //     setTimeout(() => {
    //       this.props.history.push(`/admin/dashboard`)
    //     }, 500)
    //   }
    //   else{
    //     this.setState({errr:true});
    //     this.setState({succes:false});
    //     this.setState({errrMsg:"Something went wrong"});
    //   }
    // })
  }

  responseGoogleFail =(response)=>{
    console.log(response);
    this.setState({errr:true});
    this.setState({succes:false});
    this.setState({errrMsg:'Something went wrong'});
  }
  resetPasswordAllow(){
    this.setState({resetPassAllow:true})
  }
  resetPasswordDissAllow(){
    this.setState({resetPassAllow:false})
  }
  resetPass(){
    if(this.resetEmail==='' && !document.getElementById('exampleInputEmail1').value){
      alert("PLEASE WRITE EMAIL")
    }else{
      let q = `mutation {
        sendRecoveryEmail(email: "${this.resetEmail || document.getElementById('exampleInputEmail1').value}")
           {
              msg
          }
          }`;
          axios.post('/graphql',{
          query: q
          }).then((result) => {
          console.log(result.data)
          if(result.data.data.sendRecoveryEmail) {
              if(result.data.data.sendRecoveryEmail.msg) {
              this.setState({errr:false});
              this.setState({succes:true});
              this.setState({succesMsg:result.data.data.sendRecoveryEmail.msg});
              setTimeout(() => {
                  this.props.history.push(`/login`)
              }, 1000)
              }
          }
          else if(result.data.errors) {
              if(result.data.errors[0].message){
              this.setState({errr:true});
              this.setState({succes:false});
              this.setState({errrMsg:result.data.errors[0].message});
              }
              else{
              this.setState({errr:true});
              this.setState({succes:false});
              this.setState({errrMsg:"Something went wrong"});
              }
              
          }
          });
    }
  }
  render() {
    makeStyles(this.state.styles);
    let notifi;
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.errr){
      notifi=<SnackbarContent message={'Error: '+this.state.errrMsg} close color="danger"/>;
    }

    let logInTo;

    if(this.state.resetPassAllow){
      logInTo=<CardBody profile>
                <div className="form-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp" 
                    placeholder="Enter email" 
                    onChange={this.handleEmailReset}
                    
                  />
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <Button color="success" round onClick={this.resetPass}>
                    SEND REQUEST TO RESET
                </Button>
                <Button color="danger" round onClick={this.resetPasswordDissAllow}>
                    CANCEL
                </Button>

            </CardBody>
    }else{
      logInTo=<CardBody profile>
                <div className="form-group">
                  <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleEmail}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={this.handlePassword1}/>
                </div>
                <Button color="success" round onClick={this.loginMethod}>
                    Login
                </Button>
                <Button color="warning" round onClick={this.resetPasswordAllow}>
                    FORGOT PASSWORD
                </Button>
                <small id="emailHelp" className="form-text text-muted">Dont have an account? SingUp here.</small>
                <Button color="primary" round component={Link} to="/signup">
                    SignUp
                </Button> 
            </CardBody>
    }

    return (
      <div className="container-fluid" style={{paddingTop: '70px'}}>
        {notifi}<br/>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 offset-lg-3 offset-md-3">
            <Card profile>
              <CardAvatar profile>
                <img src={avatar} alt="..." />
              </CardAvatar>
              {logInTo}
              <CardBody profile style={{backgroundColor:"rgb(95, 158, 160)"}}>
              <GoogleLogin
                clientId="43580613435-jloen18vc3cg889doto8tm70ss6q1rsu.apps.googleusercontent.com"
                buttonText="Login With Google"
                onSuccess={this.responseGoogleSuccess}
                onFailure={this.responseGoogleFail}
                cookiePolicy={'single_host_origin'}
              />            
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

const mapPropsToDispatch = dispatch => {
  return {
    onTokenGet: (token) => dispatch({type: 'SETTOKEN', token}),
    onUserIdGet: (userId)=> dispatch({type: 'SETUSERID', userId}),
    onUserTypeGet: (usertype)=> dispatch({type: 'SEUSERTYPE', usertype})
  }
}

export default connect(null, mapPropsToDispatch)(Login)
