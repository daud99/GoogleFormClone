import React from "react";
import Button from "components/CustomButtons/Button.js";
// import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import axios from '../../axiosSet';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import { Link } from 'react-router-dom';
var moment = require('moment');
class ViewAllQuestionaire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles :{
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
      questionaires:[],
      succesMsg:'',
      errMsg:'',
      succes:false,
      err:false
      
    };
    this.deleteQuestionaire = this.deleteQuestionaire.bind(this);
    this.regetQuestionaire = this.regetQuestionaire.bind(this);
    this.dateGet = this.dateGet.bind(this);

  }
  componentWillMount() {
    axios.post('/graphql',{
        query: `query getQuestionairesOfOwner($userIdO:String!){
            getQuestionairesOfOwner(owner: $userIdO) {
                id,
                title,
                category,
                createdAt
          }
        }`,
          variables:{
            userIdO:localStorage.getItem('useId')
          }
      }).then((result) => {
        // console.log(result.data.data.getQuestionairesOfOwner)
        this.setState({questionaires:result.data.data.getQuestionairesOfOwner})
        // this.setState({succes:true})
        // this.setState({succesMsg:'Questionaire created, Now add questions to it'})
      });
  }
  regetQuestionaire(){
    axios.post('/graphql',{
      query: `query getQuestionairesOfOwner($userIdO:String!){
          getQuestionairesOfOwner(owner: $userIdO) {
              id,
              title,
              category,
              createdAt
        }
      }`,
        variables:{
          userIdO:localStorage.getItem('useId')
        }
    }).then((result) => {
      this.setState({questionaires:result.data.data.getQuestionairesOfOwner})
      // this.setState({succes:true})
      // this.setState({succesMsg:'Questionaire created, Now add questions to it'})
    });
  }
  deleteQuestionaire(idd){
    axios.post('/graphql',{
      query: `mutation deleteQuestionaire($Id: String!){
        deleteQuestionaire(id: $Id) {
              id,
              title
        }
      }`,
        variables:{
          Id:idd
        }
    }).then((result) => {
      this.regetQuestionaire();
      this.setState({succes:true})
      this.setState({succesMsg:'Questionaire Deleted=>'+result.data.data.deleteQuestionaire.title})
    });
  }
  dateGet(numS){
    let dat=moment(numS,"x").format("DD MMM YYYY hh:mm a")
    console.log(dat)
    return dat
  }
  render() {
    let notifi;
    let rows=[]
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.err){
      notifi=<SnackbarContent message={'Error: '+this.state.errMsg} close color="danger"/>;
    }
    for (let index = 0; index < this.state.questionaires.length; index++) {
      rows.push(<tr key={index}>
        <td style={{width:"10%"}}>{index}</td>
        <td style={{width:"50%"}}>{this.state.questionaires[index].title}</td>
        <td style={{width:"20%"}}>{this.dateGet(this.state.questionaires[index].createdAt)}</td>
        <td style={{width:"20%"}}>
            <Button color="warning" round component={Link} to={`/questionaire/${this.state.questionaires[index].id}`}>View</Button>
            <Button color="danger" round onClick={()=>this.deleteQuestionaire(this.state.questionaires[index].id)}>Delete</Button>
        </td>
      </tr>)
    }

    return (
      <div style={{paddingLeft:'20px', paddingRight:'40px'}}>
          {notifi}
          <GridContainer>
          {/* <GridItem xs={12} sm={12} md={12} lg={12}> */}
            <Card>
                <CardBody>
                <table className="table table-responsive table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" style={{width:"10%"}}>#</th>
                      <th scope="col" style={{width:"50%"}}>Title</th>
                      <th scope="col" style={{width:"20%"}}>CreatedAt</th>
                      <th scope="col" style={{width:"20%"}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
                </CardBody> 
            </Card>
          {/* </GridItem> */}
          </GridContainer>
      </div>
    );
  }
}


export default ViewAllQuestionaire
