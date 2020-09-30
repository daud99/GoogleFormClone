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
      this.props.history.push(`/l/allQuestionaires`)
    }else if(localStorage.getItem('localToken')){
      this.props.history.push(`/l/allQuestionaires`)
    }
  }
  componentWillMount(){
    this.tokenE=this.props.match.params.token
  }
  verifyE(){
    // });
    let q = `mutation {
        verifyUser(token: "${this.tokenE}") {
        msg
    }
    }`;
    axios.post('/graphql',{
    query: q
    }).then((result) => {
    if(result.data.data.verifyUser) {
        if(result.data.data.verifyUser.msg) {
        this.setState({errr:false});
        this.setState({succes:true});
        this.setState({succesMsg:result.data.data.verifyUser.msg});
        setTimeout(() => {
          this.setState({succes:false});
        }, 5000);
      }
    }
    else if(result.data.errors) {
        if(result.data.errors[0].message){
        this.setState({errr:true});
        this.setState({succes:false});
        this.setState({errrMsg:result.data.errors[0].message});
        setTimeout(() => {
          this.setState({errr:false});
        }, 5000);
      }
        else{
        this.setState({errr:true});
        this.setState({succes:false});
        this.setState({errrMsg:"Something went wrong"});
        setTimeout(() => {
          this.setState({errr:false});
        }, 5000);
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
