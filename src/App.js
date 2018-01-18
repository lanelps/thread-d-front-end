import React, { Component } from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./actions";

import "./css/render.css";

import AuthAdapter from "./api";

import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import InteractiveSketch from "./components/InteractiveSketch";
import Render from "./components/Render";

class App extends Component {
  //make sure auth is completed before rendering anything
  state = {
    authCompleted: false
  };

  componentWillMount() {
    //if we already have a token, hit our backend to confirm it
    if (localStorage.getItem("token")) {
      AuthAdapter.authorizeUser().then(res => {
        if (res.errors) {
          localStorage.clear();
        } else {
          this.props.setLoggedIn(res);
          this.setState({
            authCompleted: true
          });
        }
      });
      //or direct them to the landing page
    } else {
      this.setState({
        authCompleted: true
      });
    }
  }

  render() {
    if (this.state.authCompleted === true) {
      return (
        <div className="App">
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return this.state.authCompleted && this.props.loggedIn ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/welcome" />
                );
              }}
            />
            <Route path="/signup" component={SignUp} />
            <Route path="/welcome" component={LandingPage} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/interact" component={InteractiveSketch} />
            <Route path="/render/:url" component={Render} />
          </Switch>
        </div>
      );
    } else {
      return (
        <div className="loading" style={{ height: window.innerHeight }}>
          <h1>Loading...</h1>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn
});

export default withRouter(connect(mapStateToProps, actions)(App));
