import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
// import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from "prop-types";


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "components/CustomButtons/Button.js";
import { GoogleLogout  } from 'react-google-login';

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";


const useStyles = makeStyles(styles);

const AdminNavbarLinks = (props) => {
  // console.log(props.history)
  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleGoToProfile = () => {
    setTimeout(() => {
      setOpenProfile(null);
      props.history.push('/l/user')
    }, 100)
  };
  const handleLogoutFunction = () => {
    // alert("hello");
    // axios.get('/user/logout')
    //   .then(res => {
        // if(res.data.message){
          localStorage.removeItem("localToken");
          localStorage.removeItem("useId");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          props.history.push('/login');
          props.onTokenGet('');
          props.onUserIdGet('');
          props.onUserTypeGet('');
          props.history.push('/login')
        // }
      // });
  };
  const logout =(response) =>{
    localStorage.removeItem("token");
    localStorage.removeItem("useId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("photo");
    localStorage.removeItem("createdAt");
    localStorage.removeItem("tokenid");
    props.onTokenGet('');
    props.onUserIdGet('');
    props.onUserTypeGet('');
    props.history.push('/login')
  }
  const handleLogoutFailure =(response)=> {
    alert('Failed to log out')
  }
  let logoutBut;
  if(localStorage.getItem("localToken")){
    logoutBut=<MenuItem
                onClick={handleLogoutFunction}
                className={classes.dropdownItem}
              >
              Logout
              </MenuItem>
  }else if(localStorage.getItem("token")){
    logoutBut=
                <MenuItem
                className={classes.dropdownItem}
              >
              <GoogleLogout
                clientId="43580613435-jloen18vc3cg889doto8tm70ss6q1rsu.apps.googleusercontent.com"
                render={renderProps => (
                  <small style={{fontSize:"14px"}} onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</small>
                )}
                buttonText='Logout'
                onLogoutSuccess={ logout }
                onFailure={ handleLogoutFailure }
              >
              </GoogleLogout></MenuItem>
  }

  return (
    <div>
      {/* search */}
      {/* {console.log(props.token)} */}


      <Hidden mdUp implementation="css">
        <p className={classes.linkText}>Dashboard</p>
      </Hidden>

      {/* profile dropdown */}
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "white" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleGoToProfile}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem>
                    <Divider light />
                    {/* <div style={{display: "none"}}> */}
                      <GoogleLogout
                        icon={false}
                        tag='li'
                        // disabledStyle={{display: "none"}}
                        className="specialFetchingClass MuiButtonBase-root MuiListItem-root MuiMenuItem-root makeStyles-dropdownItem-78 MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
                        clientId="43580613435-jloen18vc3cg889doto8tm70ss6q1rsu.apps.googleusercontent.com"
                        buttonText='Logout'
                        onLogoutSuccess={ logout }
                        onFailure={ handleLogoutFailure }
                      >
                      </GoogleLogout>
                    {/* </div> */}
                    {/* <Link to="/login"> */}
                    {logoutBut}
                    {/* </Link>  */}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      {/* end profile drop down */}
    </div>
  );
}

const mapPropsToDispatch = dispatch => {
  return {
    onTokenGet: (token) => dispatch({type: 'SETTOKEN', token}),
    onUserIdGet: (userId)=> dispatch({type: 'SETUSERID', userId}),
    onUserTypeGet: (usertype)=> dispatch({type: 'SEUSERTYPE', usertype})
  }
}
AdminNavbarLinks.defaultProps = {
  input: PropTypes.isNotNull // you can amend this accordingly
}

export default connect(null, mapPropsToDispatch)(withRouter(AdminNavbarLinks))
