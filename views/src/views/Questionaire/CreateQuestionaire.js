import React from "react";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import axios from '../../axiosSet';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

class CreateQuestionaire extends React.Component {
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
      title:'',
      questionaireCatogory:'',
      questions:[],

      allowQuestionAdd:false,
      
      succesMsg:'',
      errrMsg:'',
      succes:false,
      errr:false,
      
    };
    this.handleQuestionaireName = this.handleQuestionaireName.bind(this);
    this.handleQuestionaireCategory = this.handleQuestionaireCategory.bind(this);
    this.handleQuestionaireQuestion = this.handleQuestionaireQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.submitQuestionare = this.submitQuestionare.bind(this);
    this.submitQuestions = this.submitQuestions.bind(this);
    this.goBackTo = this.goBackTo.bind(this);
  }

  questionsExt=[]
  questionObj={titleQ:'', questionCategory:''}
  questionaireObj={title:'',questionaireCatogory:''}

  questionListHtml=[];
  questionVal=''
  listOfQuestions=[];

  questionaireId;
  handleQuestionaireName = event => {
    this.setState({title:event.target.value})
    this.questionaireObj.title= event.target.value;
  }
  handleQuestionaireCategory = event =>{
    this.setState({questionaireCatogory:event.target.value})
    this.questionaireObj.questionaireCatogory= event.target.value;
  }

  handleQuestionaireQuestion = event => {
    this.questionVal=event.target.value
    this.questionObj.titleQ=event.target.value;
  }

  addQuestion(){
    if(this.questionObj.titleQ===''){
      alert('Please write question first before admitting')
    }else{
      let data={titleQ:this.questionObj.titleQ, questionCategory:this.questionObj.questionCategory}
      this.questionsExt.push(data);
      this.setState({questions:this.questionsExt});
      this.listOfQuestions=[]
      this.questionVal=' '
      document.getElementById('questionaireQuestionqq').value=''
    }
  }

  removeQuestion(index){
  }

  submitQuestionare(){
    if(this.questionaireObj.title===''){
      alert("Please write questionaire title")
    }
    else if(this.questionaireObj.title!==''){
      axios.post('/graphql',{
        query: `mutation addQuestionaire($titleO: String!, $categoryO:String!, $userIdO:String!){
            addQuestionaire(title: $titleO , category: $categoryO, owner: $userIdO) {
                id,
                title
          }
        }`,
          variables:{
            titleO:this.questionaireObj.title,
            categoryO:this.questionaireObj.questionaireCatogory,
            userIdO:localStorage.getItem('useId')
          }
      }).then((result) => {
        if(result.data.data.errors) {
          if(result.data.data.errors[0].message){
          this.setState({errr:true});
          this.setState({succes:false});
          this.setState({errrMsg:result.data.data.errors[0].message});
          }
          else{
          this.setState({errr:true});
          this.setState({succes:false});
          this.setState({errrMsg:"Something went wrong"});
          }
          
        }else if(result.data.data.addQuestionaire){
          this.questionaireId=result.data.data.addQuestionaire.id;
          this.setState({allowQuestionAdd:true})
          this.setState({succes:true})
          this.setState({succesMsg:'Questionaire created, Now add questions to it'})
        }
        
      });
    }
  }
  goBackTo(){
    setTimeout(() => {
      this.props.history.push(`/l/allQuestionaires`)
    }, 700);
  }
  async submitQuestions(){
    if(this.questionsExt.length>0){
      for (let index = 0; index < this.questionsExt.length; index++) {
        if(this.questionsExt[index].titleQ !== ''){
          await axios.post('/graphql',{
            query: `mutation addQuestion($questionO: String!, $categoryO:String!, $userIdO:String!, $questionaireO:String!){
              addQuestion(question: $questionO , category: $categoryO, user: $userIdO, questionaire: $questionaireO) {
                question,
                category
              }
            }`,
              variables:{
                questionO:this.questionsExt[index].titleQ,
                categoryO:this.questionsExt[index].questionCategory,
                userIdO:localStorage.getItem('useId'),
                questionaireO:this.questionaireId
              }
          }).then((result) => {
            if(result.data.data.errors) {
              if(result.data.data.errors[0].message){
              this.setState({errr:true});
              this.setState({succes:false});
              this.setState({errrMsg:result.data.data.errors[0].message});
              }
              else{
              this.setState({errr:true});
              this.setState({succes:false});
              this.setState({errrMsg:"Something went wrong"});
              }
              
            }else{
              this.setState({succes:true})
              this.setState({succesMsg:'All Questions are added'})
              this.goBackTo()
            }
            
          });
        }
      }
      document.getElementById('questionaireQuestionqq').value=''
      this.questionsExt=[];
      this.listOfQuestions=[];
      this.setState({questions:[]})
    }
  }
  componentDidMount() {
    this.setState({allowQuestionAdd:false})
  }


  render() {
    let notifi;
    let listt=[]
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.errr){
      notifi=<SnackbarContent message={'Error: '+this.state.errrMsg} close color="danger"/>;
    }
    for (let index = 0; index < this.state.questions.length; index++) {
      listt.push(<li key={index} className="list-group-item list-group-item-action list-group-item-secondary"><h6>Question:{index+1}</h6>&nbsp;&nbsp;{this.state.questions[index].titleQ}</li>)
    }

    let cardBod;
    if(this.state.allowQuestionAdd){
      cardBod=<CardBody>
                <div className="form-group">
                <h6 style={{fontWeight:"bolder", paddingLeft:"3px"}}>Added Questions</h6>
                <ol className="list-group">
                  {listt}
                </ol>       
                </div>

                <div className="form-group">
                <input type="text" autoComplete={'off'} className="form-control"  id="questionaireQuestionqq" aria-describedby="helpq" placeholder="Enter Question" onChange={this.handleQuestionaireQuestion}/>
                <small id="helpq" className="form-text text-muted">Add as many questions as you want</small>
                </div>
                
                <div className="form-group">
                <Button color="warning" onClick={this.addQuestion}>
                    Add more question
                </Button>
                </div>
                <br/>
                <hr/><hr/>
                <Button color="success" onClick={this.submitQuestions}>
                    Submit Questions
                </Button>
            </CardBody>
    }else if(!this.state.allowQuestionAdd){
      cardBod=<CardBody>
                <div className="form-group">
                  <small style={{color:"red"}}>Submit this and on next step add questions</small>
                <input type="text" className="form-control" id="questionaireName" placeholder="Enter Questionnaire Title" onChange={this.handleQuestionaireName}/>
                </div>
                <br/>
                <hr/><hr/>
                <Button color="success" onClick={this.submitQuestionare}>
                    Submit Questionnaire
                </Button>
            </CardBody>
    }

    return (
      <div style={{paddingLeft:'20px', paddingRight:'40px'}}>
          {notifi}
          <GridContainer>
          <GridItem xs={12} sm={12} md={8} lg={8}>
            <Card>
                {cardBod} 
            </Card>
          </GridItem>
          </GridContainer>
      </div>
    );
  }
}


export default CreateQuestionaire
