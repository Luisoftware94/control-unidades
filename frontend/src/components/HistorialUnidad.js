import React, { Component } from 'react'
import axios from 'axios';
import { format } from 'timeago.js';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const ip = "http://localhost:4000/"

class HistorialUnidad extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        historial: []
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        }
    }
    async getHistorial(){
        const res = await axios.get(ip + 'api/historialunidades/' + this.props.match.params.unidad);
        this.setState({
            historial: res.data
        });
    }
    componentDidMount(){
        this.getHistorial();
    }
    componentWillUpdate(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 m10 offset-m1">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">Historial unidad {this.props.match.params.unidad}</span>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Historial</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.historial.map(evento => (
                                                <tr key={evento._id}>
                                                    <td>{evento.descripcion}</td>
                                                    <td>{format(evento.fecha)}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="contenedor-button-historial">
                                <button onClick={this.props.history.goBack} className="btn waves-effect waves-light f-right">Regresar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth  
});
export default connect(mapStateToProps, null)(HistorialUnidad);
