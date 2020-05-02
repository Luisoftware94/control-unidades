import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ObtenerUnidad from './ObtenerUnidad';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';


const ip = "http://localhost:4000/"

class Roles extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        roles: []
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        }
    }
    async getRoles(){
        const res = await axios.get(ip + 'api/roles');
        this.setState({
            roles: res.data
        });
    }
    async componentDidMount(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
        this.getRoles();
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    {
                        this.state.roles.map(rol => (
                            <div className="col s12 m6 l4 xl3" key={rol._id}>
                                <div className="card card-roles">
                                    <div className="card-content">
                                        <span className="card-title center">{ rol.nombre }</span>
                                        <p className="center">{ rol.descripcion }</p>
                                        <p>Unidades:</p>
                                        <ObtenerUnidad rol={rol._id} />
                                    </div>
                                    {
                                        this.props.auth.user.rol === 'administrador' ?
                                            <div className="card-action action-roles">
                                                <Link to={"/editarrol/" + rol._id } className="right">Editar</Link>
                                            </div> : null
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                {
                    this.props.auth.isAuthenticated ?
                        this.props.auth.user.rol === 'administrador' ?
                            <div className="fixed-action-btn">
                                <Link to="/crearrol" className="btn-floating btn-large waves-effect waves-light red "><i className="material-icons">add</i></Link>
                            </div> : null
                        :
                        null
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth  
});
export default connect(mapStateToProps, null)(Roles);
