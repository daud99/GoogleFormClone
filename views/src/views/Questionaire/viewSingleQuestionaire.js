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
    //   questionaires:[],
    
      succesMsg:'',
      errMsg:'',
      succes:false,
      err:false
      
    };

  }

  componentWillMount() {
    console.log(this.props.match.params)
    const idQ=this.props.match.params.id;
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
          });
      });
  }

  render() {
    // let notifi;
    // if(this.state.succes){
    //   notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    // }else if(this.state.err){
    //   notifi=<SnackbarContent message={'Error: '+this.state.errMsg} close color="danger"/>;
    // }
    // for (let index = 0; index < this.state.questionaires.length; index++) {

    // }

    return (
      <div style={{paddingLeft:'10%', paddingRight:'10%'}}>
          {/* {notifi} */}
          <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
                <CardBody>

                </CardBody> 
            </Card>
          </GridItem>
          </GridContainer>
      </div>
    );
  }
}


export default ViewQuestionaire
