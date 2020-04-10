import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ObtenerUnidad from './ObtenerUnidad';
const ip = "http://localhost:4000/"

export default class Roles extends Component {
    state = {
        roles: []
    }
    async getRoles(){
        const res = await axios.get(ip + 'api/roles');
        this.setState({
            roles: res.data
        });
    }
    async componentDidMount(){
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
                                    <div className="card-action action-roles">
                                        <Link to={"/editarrol/" + rol._id } className="right">Editar</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="fixed-action-btn">
                    <Link to="/crearrol" className="btn-floating btn-large waves-effect waves-light red "><i className="material-icons">add</i></Link>
                </div>
            </div>
        )
    }
}
