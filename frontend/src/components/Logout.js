import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired
    }
    render() {
        return (
            <Link to="/iniciarsesion" onClick={this.props.logout}>
                Salir
            </Link>
        )
    }
}

export default connect(
    null,
    { logout }
)(Logout);