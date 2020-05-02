import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
const ip = "http://localhost:4000/"

class DetalleOperador extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        operador: [],
        pathFotografia: ""
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        }
    }
    async componentDidMount(){
        const res = await axios.get(ip + 'api/operadores/' + this.props.match.params.id);
        this.setState({
            operador: res.data
        });
    }
    componentWillUpdate(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
                        <div className="card">
                            <div className="card-content contenedor-detalle-operador">
                                <div className="contenedor-operador-compania">
                                    <p>{this.state.operador.compania}</p>
                                </div>
                                <div className="contenedor-operador-imagen">
                                    { this.state.operador.pathFotografia ? <img src={ip + this.state.operador.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                                </div>
                                <div className="contenedor-operador-contenido">
                                    <h3>{ this.state.operador.numEmpleado}</h3>
                                    <h4>{ this.state.operador.nombre }</h4>
                                    <div className="numero-telefonico-content">
                                        <p><span>Tel.</span> {this.state.operador.telefono}</p>
                                    </div>
                                    {
                                        this.state.operador.numImss !== 'undefined' ?
                                            <p><span>IMSS:</span> {this.state.operador.numImss}</p> :
                                            <p><span>IMSS:</span> N/D</p>
                                    }
                                    {
                                        this.state.operador.numLicencia !== 'undefined' ?
                                            <p><span>Núm. de licencia:</span> {this.state.operador.numLicencia}</p> :
                                            <p><span>Núm. de licencia:</span> N/D</p>
                                    }
                                    {
                                        this.state.operador.tipoLicencia !== 'undefined' ?
                                            <p><span>Tipo de licencia:</span> {this.state.operador.tipoLicencia}</p> :
                                            <p><span>Tipo de licencia:</span> N/D</p>
                                    }
                                    {
                                        this.state.operador.numLicencia !== 'undefined' ?
                                            <p>
                                                <span>Vencimiento de licencia: </span> 
                                                {moment(this.state.operador.vencimientoLicencia).toDate().getDate()  + "/" +  (moment(this.state.operador.vencimientoLicencia).toDate().getMonth() + 1) + "/"  + moment(this.state.operador.vencimientoLicencia).toDate().getFullYear()}
                                            </p> :
                                            <p><span>Vencimiento de licencia:</span> N/D</p>
                                    }
                                    {
                                        this.state.operador.medicinaPreventiva !== 'undefined' ?
                                            <p><span>Medicina prev:</span> {this.state.operador.medicinaPreventiva}</p> :
                                            <p><span>Medicina prev:</span> N/D</p>
                                    }
                                    {
                                        this.state.operador.medicinaPreventiva !== 'undefined' ?
                                            <p>
                                                <span>Vencimiento medicina prev: </span>
                                                {moment(this.state.operador.vencimientoMedicinaPreventiva).toDate().getDate()  + "/" +  (moment(this.state.operador.vencimientoMedicinaPreventiva).toDate().getMonth() + 1) + "/"  + moment(this.state.operador.vencimientoMedicinaPreventiva).toDate().getFullYear()}
                                            </p> :
                                            <p><span>Vencimiento medicina prev:</span> N/D</p>
                                    }
                                </div>
                                <div className="contenedor-button-detalle-operador">
                                    <button onClick={this.props.history.goBack} className="btn waves-effect waves-light">Regresar</button>
                                </div>
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
export default connect(mapStateToProps, null)(DetalleOperador);

