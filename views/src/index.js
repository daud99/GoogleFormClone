/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import Login from "./views/Login/login.js";
import ViewQuestionaire from "./views/Questionaire/viewSingleQuestionaire";

import 'jquery/src/jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Emailverify from "./views/SingUp/emailVerify";
import "assets/css/material-dashboard-react.css?v=1.8.0";
import SingUp from "./views/SingUp/singup.js";
import passwordReset from "./views/SingUp/passwordReset";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ViewInvitedQuestionaire from "./views/Questionaire/viewSingleInvitedQuestionaire"
// Local imports
import reducer from './store/reducer';

const store = createStore(reducer);
// const hist = createBrowserHistory();

// const getToken  = () => {
//   return localStorage.getItem('token') === null
// }

ReactDOM.render(
  <Provider store = { store }>
    <BrowserRouter>
      {/* <Router history={hist}> */}
        <Switch>
          <Route path="/l" component={Admin} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SingUp} />
          <Route path="/questionaire/:id" component={ViewQuestionaire} />
          <Route path="/invitedQuestionaire/:id" component={ViewInvitedQuestionaire} />
          <Route path="/verify-user/:token" component={Emailverify} />
          <Route path="/reset-password/:token" component={passwordReset} />
          {/* {getToken() ? <Route path="/login" component={Login} /> : <Redirect to="/admin/dashboard" />}
          {getToken() ? <Route path="/signup" component={SingUp} /> : <Redirect to="/admin/dashboard" />} */}
          <Redirect from="/" to="/l/dashboard" />
        </Switch>
      {/* </Router> */}
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
