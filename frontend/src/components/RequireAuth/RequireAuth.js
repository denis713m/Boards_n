import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import fp from 'lodash/fp';
import Spinner from '../Spinner/Spinner';
import checkToken from '../../utils/checkToken';
import Login from '../../pages/LoginPage/LoginPage';
import {getUser} from '../../redux/actions';
import {PUBLIC_ROUTES} from '../../CONSTANTS';

class RequireAuth extends Component {
  
  componentDidMount = () => {
    if(!PUBLIC_ROUTES.includes(this.props.location.pathname))
    {
      if (!checkToken()) {
        console.log('chamge');
        this.props.history.push('/login');
      }
      else if(!this.props.user){
          console.log('Require getUser');
          this.props.getUser();
      }
    }
    else{
      if(checkToken()){
        this.props.history.push('/');
        this.props.getUser();
      }
    }
  };

  render = () =>
  <>
    { 
      PUBLIC_ROUTES.includes(this.props.location.pathname) ? (
        <>
          {this.props.children}
        </>
      ):
      !PUBLIC_ROUTES.includes(this.props.location.pathname) && this.props.isFetching ? <Spinner/>:
      this.props.error ? (
        <Login />
      ) : (
        <>
          {this.props.children}
        </>
      )}
  </>
}
const mapStateToProps = (state) => {
    return state.user;
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: () => dispatch(getUser())
    }
};

export default fp.flow(withRouter, connect(mapStateToProps, mapDispatchToProps))(RequireAuth);