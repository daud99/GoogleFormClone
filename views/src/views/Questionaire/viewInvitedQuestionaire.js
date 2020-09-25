import React from "react";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import axios from '../../axiosSet';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import { Link } from 'react-router-dom';

class ViewInvitedQuestionaire extends React.Component {
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
      err:false,
      viewbit:false
    };
    this.deleteQuestionaire = this.deleteQuestionaire.bind(this);
    this.regetQuestionaire = this.regetQuestionaire.bind(this);

  }
  componentWillMount() {
    axios.post('/graphql',{
        query: `query getInviteQuestionaireForReceiver($userIdO:String!){
            getInviteQuestionaireForReceiver(receiverId: $userIdO) {
                id,
                invitedUserEmail,
                status,
                permission,
                questionaire{
                    id,
                    title,
                    category,
                    createdAt
                },
                senderId{
                    _id
                    email
                    name
                },
                receiverId{
                    _id
                    email
                    name
                },
          }
        }`,
          variables:{
            userIdO:localStorage.getItem('useId')
          }
      }).then((result) => {
        console.log(result.data.data.getInviteQuestionaireForReceiver)
        if(result.data.errors) {
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
          this.setState({viewbit:false})
        }else if(result.data.data.getInviteQuestionaireForReceiver){
          this.setState({questionaires:result.data.data.getInviteQuestionaireForReceiver})
          this.setState({viewbit:true})
        }
        // this.setState({succes:true})
        // this.setState({succesMsg:'Questionaire created, Now add questions to it'})
      });
  }
  regetQuestionaire(){
    axios.post('/graphql',{
        query: `query getInviteQuestionaireForReceiver($userIdO:String!){
            getInviteQuestionaireForReceiver(receiverId: $userIdO) {
                id,
                invitedUserEmail,
                status,
                permission,
                questionaire{
                    id,
                    title,
                    category,
                    createdAt
                },
                senderId{
                    _id
                    email
                    name
                },
                receiverId{
                    _id
                    email
                    name
                },
          }
        }`,
          variables:{
            userIdO:localStorage.getItem('useId')
          }
      }).then((result) => {
        if(result.data.errors) {
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
          this.setState({viewbit:false})
        }else if(result.data.data.getInviteQuestionaireForReceiver){
          this.setState({questionaires:result.data.data.getInviteQuestionaireForReceiver})
          this.setState({viewbit:true})
        }
        // this.setState({succes:true})
        // this.setState({succesMsg:'Questionaire created, Now add questions to it'})
      });
  }
  deleteQuestionaire(idd,sId,rId){
    axios.post('/graphql',{
      query: `mutation deleteInviteQuestionaire($Id: String!,$senderIdO: String!, $receiverIdO: String!){
        deleteInviteQuestionaire(id: $Id,senderId: $senderIdO, receiverId:$receiverIdO) {
              id
        }
      }`,
        variables:{
          Id:idd,
          senderIdO:sId,
          receiverIdO:rId
        }
    }).then((result) => {
      if(result.data.errors) {
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
      }else{
        this.regetQuestionaire();
        this.setState({succes:true})
        this.setState({succesMsg:'Questionaire Deleted'})
      }
      
    });
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
      rows.push(<tr key={index} className="d-flex">
        <td scope="col" className="col-1">{index}</td>
        <td scope="col" className="col-5">{this.state.questionaires[index].questionaire.title}</td>
        <td scope="col" className="col-3">{this.state.questionaires[index].questionaire.category}</td>
        <td scope="col" className="col-3">{this.state.questionaires[index].questionaire.createdAt}</td>
        <td scope="col" className="col-4">
            <Button color="warning" round component={Link} to={`/questionaire/${this.state.questionaires[index].questionaire.id}`}>View</Button>
            <Button color="danger" round onClick={()=>this.deleteQuestionaire(this.state.questionaires[index].id,this.state.questionaires[index].senderId,this.state.questionaires[index].receiverId)}>Delete</Button>
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
                    <tr className="d-flex">
                      <th scope="col" className="col-1">#</th>
                      <th scope="col" className="col-5">Title</th>
                      <th scope="col" className="col-3">Category</th>
                      <th scope="col" className="col-3">CreatedAt</th>
                      <th scope="col" style={{textAlign:"center"}} className="col-4">Action</th>
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


export default ViewInvitedQuestionaire
