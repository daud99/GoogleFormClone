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
      err:false
      
    };
    this.submitForm = this.submitForm.bind(this);
    this.handleAnswerName = this.handleAnswerName.bind(this);

  }
  questionIdList=[]
  answerList=[]
  questionaireId=''
  componentWillMount() {
    console.log(this.props.match.params)
    const idQ=this.props.match.params.id;
    this.questionaireId=this.props.match.params.id;
    axios.post('/graphql',{
        query: `query getQuestionaireByID($IdO:String!){
            getQuestionaireByID(id: $IdO) {
                id,
                title,
                category,
                createdAt
          }
        }`,
          variables:{
            IdO:idQ
          }
      }).then((result) => {
        this.setState({questionaires:result.data.data.getQuestionaireByID})
        console.log(result.data.data.getQuestionaireByID)
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
      // if(result) {
      //   console.log(result);
        
      //   // this.setState({succes:true});
      //   // this.setState({succesMsg:'Answers submited successfully'})
      // }
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
  render() {
    let notifi;
    if(this.state.succes){
      notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    }else if(this.state.err){
      notifi=<SnackbarContent message={'Error: '+this.state.errMsg} close color="danger"/>;
    }
    // for (let index = 0; index < this.state.questionaires.length; index++) {

    // }
    let divv=[]
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
    return (
      <div style={{paddingLeft:'10%', paddingRight:'10%'}}>
          {notifi}
          <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
                <CardBody>
                  <h3 style={{fontWeight:"bolder", textAlign:"center", textDecoration: "underline"}}>{this.state.questionaires.title}</h3>
                  <p style={{fontWeight:"bolder", textAlign:"center"}}>Category:&nbsp;{this.state.questionaires.category}</p>
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
