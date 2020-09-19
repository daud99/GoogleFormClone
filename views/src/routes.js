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
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Home from "@material-ui/icons/Home";
import Person from "@material-ui/icons/Person";
import Pages from "@material-ui/icons/Pages";
import Assignment from "@material-ui/icons/Assignment";
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import CreateQuestionaire from "views/Questionaire/CreateQuestionaire";
import ViewAllQuestionaire from "views/Questionaire/viewQuestionaires";

let adminDashboardRoutes=[];
if(localStorage.getItem('token') || localStorage.getItem('localToken')){
    adminDashboardRoutes = [
      {
        path: "/dashboard",
        name: "Dashboard",
        icon: Dashboard,
        component: DashboardPage,
        layout: "/l"
      },
      {
        path: "/user",
        name: "User Profile",
        icon: Person,
        component: UserProfile,
        layout: "/l"
      },
      {
        path: "/createQuestionaire",
        name: "Create Questionaire",
        icon: Assignment,
        component: CreateQuestionaire,
        layout: "/l"
      },
      {
        path: "/allQuestionaires",
        name: "All Questionaires",
        icon: Pages,
        component: ViewAllQuestionaire,
        layout: "/l"
      }
    ];
}


export default adminDashboardRoutes;
