import React, {Component} from "react";
// import { connect } from 'react-redux';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
// import { Link } from 'react-router-dom';

// core components
import Card from "components/Card/Card.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import CardBody from "components/Card/CardBody.js";
import axios from '../../axiosSet';


class Emailverify extends Component {
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
      succes:false,
      succesMsg:'',
      errr:false,
      errrMsg:''
    };
    this.verifyE = this.verifyE.bind(this);
  }
  tokenE="";
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
  componentWillMount(){
    console.log(this.props.match.params)
    this.tokenE=this.props.match.params.token
  }
  verifyE(){
    console.log(this.tokenE)
    // });
    let q = `mutation {
        verifyUser(token: "${this.tokenE}") {
        msg
    }
    }`;
    axios.post('/graphql',{
    query: q
    }).then((result) => {
    console.log(result.data)
    if(result.data.data.verifyUser) {
        if(result.data.data.verifyUser.msg) {
        this.setState({errr:false});
        this.setState({succes:true});
        this.setState({succesMsg:result.data.data.verifyUser.msg});
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
              <CardBody profile>
                <Button color="success" onClick={this.verifyE}>
                      Click to verify
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}


export default Emailverify
