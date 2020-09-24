import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import avatar from "assets/img/faces/singUp.jpg";
import axios from '../../axiosSet';
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import { couldStartTrivia } from "typescript";

class SignUp extends React.Component {
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
      name:'',
      email:'',
      password:'',
      password2:'',
      succes:false,
      succesMsg:'',
      errr:false,
      errrMsg:''
    };
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
  
  data={name:'',
  email:'',
  password:'',
  password2:''}
  handleName = event => {
    this.data.name= event.target.value;
  }
  handleEmail = event => {
    this.data.email= event.target.value;
  }
  handlePassword1 = event => {
    this.data.password= event.target.value;
  }
  handlePassword2 = event => {
    this.data.password2= event.target.value;
  }

  register=()=> {
    
    this.setState({
      name:this.data.name,
      email:this.data.email,
      password:this.data.password,
      password2:this.data.password2
    },()=>{
      // const user = {name:this.state.name,email:this.state.email,password:this.state.password,password2:this.state.password2};
      // console.log(user);
      // axios.post('/graphQL', user)
      // .then(res => {
      //   console.log(res.data);
      //   if(res.data.msg){
      //     this.setState({errr:false});
      //     this.setState({succes:true});
      //     this.setState({succesMsg:res.data.msg});
      //   }
      //   else if(res.data.errmsg){
      //     this.setState({errr:true});
      //     this.setState({succes:false});
      //     this.setState({errrMsg:res.data.errmsg[0].msg});
      //   }
      // });
      let q = `mutation {
        addUser(name: "${this.state.name}", email: "${this.state.email}", password: "${this.state.password}") {
          name
          email
        }
      }`;
      axios.post('/graphql',{
        query: q
      }).then((result) => {
        console.log(result.data)
        if(result.data.data.addUser) {
          if(result.data.data.addUser.email) {
            this.setState({errr:false});
            this.setState({succes:true});
            this.setState({succesMsg:"You are sign up successfully"});
            this.state.name = '';
            this.state.email = '';
            this.state.password = '';
            this.state.password2 = '';
            setTimeout(() => {
              this.props.history.push(`/login`)
            }, 500)
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
    });
  }

  render() {
    makeStyles(this.state.styles);
    let notifi;
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.errr){
      notifi=<SnackbarContent message={'Error: '+this.state.errrMsg} close color="danger"/>;
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
              <CardBody profile>
                  <div className="form-group">
                  <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" placeholder="Enter name" autoComplete="off" onChange={this.handleName}/>
                  </div>
                  <div className="form-group">
                    <input type="email" className="form-control" autoComplete="off" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleEmail}/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" autoComplete="off" id="exampleInputPassword1" placeholder="Password" onChange={this.handlePassword1}/>
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" autoComplete="off" id="exampleInputPassword2" placeholder="Retype Password" onChange={this.handlePassword2}/>
                  </div>
                  <Button color="success" onClick={this.register}>
                      SignUp
                  </Button>
                  <small id="emailHelp" className="form-text text-muted">Already have an account? Login now.</small>
                  <Button color="primary" onClick={() => {this.props.history.push(`/login`)}}>
                      Back to SignIn
                  </Button>           
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
export default SignUp