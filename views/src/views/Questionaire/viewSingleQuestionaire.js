import React from "react";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import axios from '../../axiosSet';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

class ViewQuestionaire extends React.Component {
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
      questionaires:{},
      questions:[],
    
      succesMsg:'',
      errMsg:'',
      succes:false,
      err:false,
      selectedUser:'',

      userBit:false,
      submitBit:true
    };
    
    this.submitForm = this.submitForm.bind(this);
    this.handleAnswerName = this.handleAnswerName.bind(this);
    this.onUserClick = this.onUserClick.bind(this);
    this.submitFF = this.submitFF.bind(this);
  }
  questionIdList=[]
  answerList=[]
  questionaireId=''
  usersL=[];

  submittedAnswersList=[];
  userSelectedAnswerList=[];
  componentWillMount() {
    console.log(this.props.match.params)
    const idQ=this.props.match.params.id;
    let answerQidObj={}
    this.questionaireId=this.props.match.params.id;
    axios.post('/graphql',{
        query: `query getQuestionaireByID($IdO:String!){
            getQuestionaireByID(id: $IdO) {
                id,
                title,
                category,
                createdAt,
                answers {
                  answer
                  question{
                    id
                    question
                  }
                  user {
                    _id
                    email
                    name
                  }
                }
          }
        }`,
          variables:{
            IdO:idQ
          }
      }).then((result) => {
        this.setState({questionaires:result.data.data.getQuestionaireByID})
        console.log(result.data.data.getQuestionaireByID)
        for (let index1 = 0; index1 < result.data.data.getQuestionaireByID.answers.length; index1++) {
          answerQidObj={}
          answerQidObj.answer=result.data.data.getQuestionaireByID.answers[index1].answer
          answerQidObj.qId=result.data.data.getQuestionaireByID.answers[index1].question.id
          answerQidObj.uId=result.data.data.getQuestionaireByID.answers[index1].user._id
          answerQidObj.userName=result.data.data.getQuestionaireByID.answers[index1].user.name
          if(this.submittedAnswersList.length>0){
            for (let index3 = 0; index3 < this.submittedAnswersList.length; index3++) {
              if(answerQidObj.uId!=this.submittedAnswersList[index3].uId){
                this.submittedAnswersList.push(answerQidObj)
              }
            }
          }
          else{
            this.submittedAnswersList.push(answerQidObj)
          }
          
        }
        console.log(this.submittedAnswersList)
        axios.post('/graphql',{
            query: `query getQuestionsOfQuestionaire($IdOO:String!){
                getQuestionsOfQuestionaire(idp: $IdOO) {
                    id,
                    question,
                    category,
                    createdAt
              }
            }`,
              variables:{
                IdOO:result.data.data.getQuestionaireByID.id
              }
          }).then((result) => {
            console.log(result.data.data.getQuestionsOfQuestionaire)
            this.setState({questions:result.data.data.getQuestionsOfQuestionaire})
          });
      });
  }
  handleAnswerName = (event,indexL) => {
    let answerObj = {};
    answerObj.answer=event.target.value;
    answerObj.index=indexL;
    this.answerList[indexL] = answerObj; 
  }
  async submitForm(){
    console.log(this.questionaireId)
    console.log(this.questionIdList)
    console.log(this.answerList)
    console.log(this.questionIdList.length);
    let result;
    let result2;
    for (let index = 0; index < this.questionIdList.length; index++) {
      if(index<=this.answerList.length){
      console.log("Index here is "+index)
      console.log(this.answerList[index]);
      result = await axios.post('/graphql',{
        query: `mutation addAnswer($questionaireO: String!, $questionO:String!, $answerO:String!){
          addAnswer(question: $questionO, questionaire: $questionaireO, answer: $answerO) {
            id,
            answer,
            question{
              id
            },
            questionaire{
              id
            }
          }
        }`,
          variables:{
            questionaireO:this.questionaireId,
            questionO:this.questionIdList[index],
            answerO:this.answerList[index].answer
          }
      });
      if(result) {
        result2 = await axios.post('/graphql',{
          query: `query alertOwnerOnQuestionaireFill($questionaireIdO:String!, $emailO:String!){
            alertOwnerOnQuestionaireFill(questionaireId: $questionaireIdO, email: $emailO) {
              msg
            }
          }`,
            variables:{
              questionaireIdO:this.questionaireId,
              emailO:"daudahmed870@gmail.com"
            }
        });
        if(result2){
          console.log(result2);
        }
        console.log(result);
        
        this.setState({succes:true});
        this.setState({succesMsg:'Answers submited successfully'})
      }
      // .then((result) => {
      //   console.log(result)
      //   this.setState({succes:true})
      // });
    }
    }
    if(result) {
      window.scrollTo(0,0)
      this.setState({succes:true});
      this.setState({succesMsg:'Answers submited successfully'})
      // this.props.history.push('/allQuestionaires')
    }
  }
  onUserClick(event){
    let newObj={}
    for (let index4 = 0; index4 < this.state.questionaires.answers.length; index4++) {
      if(event.target.value==this.state.questionaires.answers[index4].user._id){
        console.log('rrr')
        newObj.ans=this.state.questionaires.answers[index4].answer
        newObj.queId=this.state.questionaires.answers[index4].question.id
        newObj.queName=this.state.questionaires.answers[index4].question.question
        this.userSelectedAnswerList.push(newObj)
        newObj={}
      }
    }
    console.log(this.userSelectedAnswerList)
    this.setState({userBit:true})
    this.setState({submitBit:false})
  }
  submitFF(){
    this.setState({userBit:false})
    this.setState({submitBit:true})
  }
  render() {
    let notifi;
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.err){
      notifi=<SnackbarContent message={'Error: '+this.state.errMsg} close color="danger"/>;
    }
    // for (let index = 0; index < this.state.questionaires.length; index++) {

    // }
    this.questionIdList=[]
    let divv=[]
    let AnsweredDiv=[]
    let usersList=[]
    for (let index2 = 0; index2 < this.submittedAnswersList.length; index2++) {
      usersList.push(
        <option value={this.submittedAnswersList[index2].uId} key={index2}>{this.submittedAnswersList[index2].userName}</option>
      )
    }
    if(this.state.submitBit){
      this.questionIdList=[]
      for (let index = 0; index < this.state.questions.length; index++) {
        this.questionIdList.push(this.state.questions[index].id)
        divv.push(
            <div className="form-group" key={index}>
              <h4 style={{fontWeight:"bolder", textAlign:"left"}}>Question&nbsp;{index+1})&nbsp;&nbsp;{this.state.questions[index].question}</h4>
              <input type="email" className="form-control" id={index} onBlur={(event)=>this.handleAnswerName(event,index)} aria-describedby="emailHelp" placeholder="Enter Answer"/>
              <small id="emailHelp" className="form-text text-muted">Write answer for above question.</small>
              <hr/>
            </div>
        )      
      }
    }else if(this.state.userBit){
      this.questionIdList=[]
      for (let index = 0; index < this.userSelectedAnswerList.length; index++) {
        this.questionIdList.push(this.userSelectedAnswerList[index].queId)
        divv.push(
            <div className="form-group" key={index}>
              <h4 style={{fontWeight:"bolder", textAlign:"left"}}>Question&nbsp;{index+1})&nbsp;&nbsp;{this.userSelectedAnswerList[index].queName}</h4>
              <p style={{fontWeight:"bolder", textAlign:"left"}}>Answer&nbsp;{index+1})&nbsp;&nbsp;{this.userSelectedAnswerList[index].ans}</p>
              <hr/>
            </div>
        )      
      }
    }
    

    return (
      <div style={{paddingLeft:'10%', paddingRight:'10%'}}>
          {notifi}
          <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
                <CardBody>
                  <h3 style={{fontWeight:"bolder", textAlign:"center", textDecoration: "underline"}}>{this.state.questionaires.title}</h3>
                  <p style={{fontWeight:"bolder", textAlign:"center"}}>Category:&nbsp;{this.state.questionaires.category}</p>
                  
                  <div className="input-group mb-3">
                    <select value={this.state.selectedUser} onChange={this.onUserClick} className="custom-select" id="usersSelect">
                      <option selected>Select user to view answers</option>
                     {usersList}
                    </select>
                  </div>
                  <Button color="warning" round onClick={this.submitFF}>
                    CLICIK TO SUBMIT YOURS
                  </Button>

                </CardBody> 
            </Card>
            <Card>
                <CardBody>
                  {divv}  
                </CardBody>
                  <hr/>
                  <Button color="success" round onClick={this.submitForm}>
                      Submit Form
                  </Button>
            </Card>
          </GridItem>
          </GridContainer>
      </div>
    );
  }
}


export default ViewQuestionaire
