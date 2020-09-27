import React from "react";

// import { connect } from 'react-redux';
// import Button from "components/CustomButtons/Button.js";
// import { saveAs } from 'file-saver';

import axios from '../../axiosSet';

class Dashboard extends React.Component {
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
    }
    this.createForm = this.createForm.bind(this);
  }

  componentDidMount() {
    
  }

  componentDidUpdate() {
    console.log('COMPONENT UPDATED')
    return true
  }
  createForm(){
    console.log('hhhhhhhh');
    let data={name:'Usman',age:"111"}
    if(localStorage.getItem("tokenid")){
      data.tokenID=localStorage.getItem("tokenid");
    }
    axios.post('/user/testing',data).then(response=>{
      console.log(response)
    })
  }

  render() {
    return (
      <div>
        <p>This is dashboard</p>
      </div>
    );
  }
}


export default Dashboard
