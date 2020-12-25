import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fp from 'lodash/fp';
import Spinner from '../Spinner/Spinner';
import checkToken from '../../utils/checkToken';
import Login from '../../pages/LoginPage/LoginPage';
import { getUser } from '../../redux/actions';
import { PUBLIC_ROUTES } from '../../CONSTANTS';

const RequireAuth = (props) => {
    useEffect (() => {
            if (!PUBLIC_ROUTES.includes(props.location.pathname)) {
                if (!checkToken()) {
                    props.history.push('/login');
                } else if (!props.user) {
                    props.getUser();
                }
            } else {
                if (checkToken()) {
                    props.history.push('/');
                    props.getUser();
                }
            }
    }, []);

    return (
        <>
            {PUBLIC_ROUTES.includes(props.location.pathname) ? (
                <>{props.children}</>
            ) : !PUBLIC_ROUTES.includes(props.location.pathname) && !props.user && !props.error
             ? (
                <Spinner />
            ) : props.error ? (
                <Login />
            ) : (
                <>{props.children}</>
            )}
        </>
    );
};
const mapStateToProps = (state) => {
    return state.user;
};

const mapDispatchToProps = {
    getUser: getUser,
};

export default fp.flow(withRouter, connect(mapStateToProps, mapDispatchToProps))(RequireAuth);
