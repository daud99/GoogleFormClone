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
      errrMsg:'',
      succes:false,
      errr:false,
      selectedUser:'',

      isowner:false,
      
      userBit:false,
      submitBit:true,
      inviteBit:false,

      sinvitePermissio:''
    };
    
    this.submitForm = this.submitForm.bind(this);
    this.handleAnswerName = this.handleAnswerName.bind(this);
    this.onUserClick = this.onUserClick.bind(this);
    this.submitFF = this.submitFF.bind(this);

    this.closeInvite = this.closeInvite.bind(this);
    this.openInvite = this.openInvite.bind(this);
    this.handleSelectedPermission = this.handleSelectedPermission.bind(this);
    this.handleInviteEmail = this.handleInviteEmail.bind(this);
    this.submitInvite = this.submitInvite.bind(this);
    this.goBackTo = this.goBackTo.bind(this);
  }
  questionIdList=[]
  answerList=[]
  questionaireId=''
  usersL=[];

 
  submittedAnswersList=[];
  userSelectedAnswerList=[];

  inviteEmail=''
  invitePermission=''
  componentWillMount() {
    document.body.style.overflow = "visible";
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
                owner{
                  _id,
                  type
                },
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
          
        }else if(result.data.data.getQuestionaireByID){
          this.setState({questionaires:result.data.data.getQuestionaireByID})
          if(result.data.data.getQuestionaireByID.owner._id===localStorage.getItem("useId")){
            this.setState({isowner:true})
          }else{
            this.setState({isowner:false})
          }
          for (let index1 = 0; index1 < result.data.data.getQuestionaireByID.answers.length; index1++) {
            answerQidObj={}
            answerQidObj.answer=result.data.data.getQuestionaireByID.answers[index1].answer
            answerQidObj.qId=result.data.data.getQuestionaireByID.answers[index1].question.id
            answerQidObj.uId=result.data.data.getQuestionaireByID.answers[index1].user._id
            answerQidObj.userName=result.data.data.getQuestionaireByID.answers[index1].user.name
            if(this.submittedAnswersList.length>0){
              for (let index3 = 0; index3 < this.submittedAnswersList.length; index3++) {
                if(answerQidObj.uId!==this.submittedAnswersList[index3].uId){
                  this.submittedAnswersList.push(answerQidObj)
                }
              }
            }
            else{
              this.submittedAnswersList.push(answerQidObj)
            }
            
          }
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
              this.setState({questions:result.data.data.getQuestionsOfQuestionaire})
            });
      }});
      // window.location.reload(false);
  }
  handleAnswerName = (event,indexL) => {
    let answerObj = {};
    answerObj.answer=event.target.value;
    answerObj.index=indexL;
    this.answerList[indexL] = answerObj; 
  }
  async submitForm(){
    let result;
    if(this.questionIdList.length===this.answerList.length){
      for (let index = 0; index < this.questionIdList.length; index++) {
        if(index<=this.answerList.length){
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
          await axios.post('/graphql',{
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
          
          this.setState({succes:true});
          this.setState({succesMsg:'Answers submited successfully'})
        }
        // .then((result) => {
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
    }else{
      alert('Please fill all Answers')
    }
    
  }
  onUserClick(event){
    let newObj={}
    this.setState({selectedUser:event.target.value})
    this.userSelectedAnswerList=[]
    for (let index4 = 0; index4 < this.state.questionaires.answers.length; index4++) {
      if(event.target.value===this.state.questionaires.answers[index4].user._id){
        newObj.ans=this.state.questionaires.answers[index4].answer
        newObj.queId=this.state.questionaires.answers[index4].question.id
        newObj.queName=this.state.questionaires.answers[index4].question.question
        this.userSelectedAnswerList.push(newObj)
        newObj={}
      }
    }
    this.setState({userBit:true})
    this.setState({submitBit:false})
  }
  submitFF(){
    this.setState({userBit:false})
    this.setState({submitBit:true})
  }

  closeInvite(){
    this.setState({inviteBit:false})
  }
  openInvite(){
    this.setState({inviteBit:true})
  }
  handleInviteEmail(event){
    this.inviteEmail=event.target.value
  }
  handleSelectedPermission(event){
    this.setState({sinvitePermissio:event.target.value})
    this.invitePermission=event.target.value
  }
  // "daudahmed870@gmail.com"
  async submitInvite(){
    let result3

    result3 = await axios.post('/graphql',{
      query: `mutation inviteUserToFillQuestionaire($questionaireO:String!, $emailO:String!){
        inviteUserToFillQuestionaire(questionaire: $questionaireO, email: $emailO) {
          msg
        }
      }`,
        variables:{
          questionaireO:this.questionaireId,
          emailO:this.inviteEmail,
        }
    });
    if(result3.data.errors) {
      if(result3.data.errors[0].message){
      this.setState({errr:true});
      this.setState({succes:false});
      this.setState({errrMsg:result3.data.errors[0].message});
      }
      else{
      this.setState({errr:true});
      this.setState({succes:false});
      this.setState({errrMsg:"Something went wrong"});
      }
      
    }else{
      this.setState({succes:true});
      this.setState({succesMsg:'User Invited Successfully'})
      this.setState({inviteBit:false})
    }

  }
  goBackTo(){
    setTimeout(() => {
      // this.props.history.push(`/l/allQuestionaires`)
      window.history.back();
    }, 700);
  }
  render() {
    let notifi;
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.errr){
      notifi=<SnackbarContent message={'Error: '+this.state.errrMsg} close color="danger"/>;
    }
    // for (let index = 0; index < this.state.questionaires.length; index++) {
    
    // }
    this.questionIdList=[]
    let divv=[]
    let usersList=[]

    let inviteButton;
    if(this.state.isowner){
      inviteButton=<Button color="success" round onClick={this.openInvite}>
                    INVITE OTHERS
                  </Button>
    }else{
      inviteButton=<small></small>
    }
    
    let invite
    if(this.state.inviteBit){
      invite=<div className="form-group">
              <input type="email" className="form-control" onChange={(event)=>this.handleInviteEmail(event)} aria-describedby="emailHelp" placeholder="Enter Email"/>
              <small id="emailHelp" className="form-text text-muted">Enter email to which you want to invite</small>

              {/* <select value={this.state.sinvitePermissio} onChange={this.handleSelectedPermission} className="custom-select" id="permission">
                <option >Select Permission</option>
                <option value='r' >Read Only</option>
                <option value='rw' >Read and Write</option>
              </select> */}
              <Button color="success" round onClick={this.submitInvite}>
                Send Invitation
              </Button>
              <Button color="success" round onClick={this.closeInvite}>
                Cancel
              </Button>

              <hr/>
            </div>
    }else if(!this.state.inviteBit){
      invite=<small></small>
    }
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
      <div style={{paddingLeft:'10%', paddingRight:'10%',paddingTop:'5%', overflowY:"scroll",overflow: "visible"}}>
          {notifi}
          <GridContainer>
          <Button color="danger" round onClick={this.goBackTo}>
            GO BACK
          </Button>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
                <CardBody>
                  <h3 style={{fontWeight:"bolder", textAlign:"center", textDecoration: "underline"}}>{this.state.questionaires.title}</h3>
                  
                  <div className="input-group mb-3">
                    <select value={this.state.selectedUser} onChange={this.onUserClick} className="custom-select" id="usersSelect">
                      <option>Select user to view answers</option>
                     {usersList}
                    </select>
                  </div>
                  <Button color="warning" round onClick={this.submitFF}>
                    CLICIK TO SUBMIT YOURS
                  </Button>
                  {inviteButton}
                  <br/><hr/>
                  {invite}

                </CardBody> 
            </Card>
            <Card>
                <CardBody>
                  {divv}
                  <hr/>
                  <Button color="success" round onClick={this.submitForm}>
                      Submit Form
                  </Button>  
                </CardBody>
            </Card>
          </GridItem>
          </GridContainer>
      </div>
    );
  }
}


export default ViewQuestionaire
