import React from "react";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import axios from '../../axiosSet';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

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
      
      succesMsg:'',
      errMsg:'',
      succes:false,
      err:false,
      
    };
  }
  componentWillMount() {
    axios.post('/graphql',{
        query: `query {
            getQuestionairesOfOwner(owner: $userIdO) {
                title,
                category,
                createdAt
          }
        }`,
          variables:{
            userIdO:localStorage.getItem('useId')
          }
      }).then((result) => {
        console.log(result.data)
        // this.questionaireId=result.data.data.addQuestionaire.id;
        this.setState({succes:true})
        this.setState({succesMsg:'Questionaire created, Now add questions to it'})
      });
  }


  render() {
    // let notifi;

    // if(this.state.succes){
    //   notifi=<SnackbarContent message={'SUCCESS: '+this.state.succesMsg} close color="success"/>;
    // }else if(this.state.err){
    //   notifi=<SnackbarContent message={'Error: '+this.state.errMsg} close color="danger"/>;
    // }
    // for (let index = 0; index < this.state.questions.length; index++) {
    // }

    return (
      <div style={{paddingLeft:'20px', paddingRight:'40px'}}>
          {/* {notifi} */}
          <GridContainer>
          <GridItem xs={12} sm={12} md={8} lg={8}>
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


export default ViewAllQuestionaire
