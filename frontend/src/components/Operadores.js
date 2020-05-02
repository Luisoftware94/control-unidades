import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const ip = "http://localhost:4000/";

class Operadores extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        operadores: []
    } 
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        }
    }
    componentDidMount(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
        this.getOperadores();
    }
    async getOperadores(){
        const res = await axios.get(ip + 'api/operadores');
        this.setState({
            operadores: res.data
        });
        this.asignarColores();
    }
    operadoresCompania(e){
        const todosOperadores = document.getElementsByClassName('operadores-control');
        const operadoresCompania = document.getElementsByClassName(e.target.value);
        for(var i = 0; i < todosOperadores.length; i++){
            todosOperadores[i].classList.add("no-mostrar");
        }
        if(e.target.value === 'todo'){
            for(i = 0; i < todosOperadores.length; i++){
                todosOperadores[i].classList.remove("no-mostrar");
            }
        }
        for(i = 0; i < operadoresCompania.length; i++){
            operadoresCompania[i].classList.remove("no-mostrar");
        }
    }
    asignarColores(){
        if(this.props.auth.isAuthenticated){
            this.state.operadores.map((operador) => {
                switch(operador.estado){
                    case 'Activo':
                        document.getElementById(operador._id).classList.add('green');
                        break;
                    case 'Permiso':
                        document.getElementById(operador._id).classList.add('yellow-fuerte');
                        break;
                    case 'Posturero':
                        document.getElementById(operador._id).classList.add('yellow-fuerte');
                        break;
                    case 'Incapacidad':
                        document.getElementById(operador._id).classList.add('yellow-fuerte');
                        break;
                    case 'Ausentismo':
                        document.getElementById(operador._id).classList.add('yellow-fuerte');
                        break;
                    case 'Capacitación':
                        document.getElementById(operador._id).classList.add('yellow-fuerte');
                        break;
                    case 'Suspención':
                        document.getElementById(operador._id).classList.add('red');
                        break;
                    case 'Baja':
                        document.getElementById(operador._id).classList.add('red');
                        break;
                    case 'Jurídico':
                        document.getElementById(operador._id).classList.add('red');
                        break;
                    default:
                        document.getElementById(operador._id).classList.add('gray');
                        break;
                }
                return true;
            });
        }
        
    }

    render() {
        return (
            <div className="container">
                <div className="head-unidades">
                    <p>Mostrar:</p>
                    <select name="select-rol" id="select-rol" onChange={ this.operadoresCompania } className="browser-default"  >
                        <option value="todo" default>Todos</option>
                        <option value="ODM">ODM</option>
                        <option value="OMEX">OMEX</option>
                        <option value="COMARCA">COMARCA</option>
                        <option value="TRANSFER">TRANSFER</option>
                        <option value="TCJS" default>TCJS</option>
                    </select>
                </div>
                <div className="row">
                    {
                        this.state.operadores.map(operador => (
                            <div className={"col s12 m6 l4 xl3 operadores-control " + operador.compania} key={operador._id}>
                                <div className="card">
                                    <div className="card-content card-operador">
                                        <div className="card-operador-compania">
                                            <p>{ operador.compania }</p>
                                        </div>
                                        <div className="card-operador-imagen">
                                            { operador.pathFotografia ? <img src={ip + operador.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                                        </div>
                                        <div className="card-operador-content">
                                            <div className="operador-content operador-content-chico">
                                                <h6 className="operador-content-numempleado">{operador.numEmpleado}</h6>
                                                <div className="operador-nombre-content">
                                                    <p>{operador.nombre}</p>
                                                </div>
                                                <div className="operador-number-content-2">
                                                    <div className="operador-number-icono-2">
                                                        <img src="./phone.png" alt=""/>
                                                    </div>
                                                    <div className="operador-number-2">
                                                        <p>Tel. {operador.telefono}</p>
                                                    </div>
                                                </div>
                                                {
                                                    operador.numImss !== 'undefined' ?
                                                        <p className="mt-20"><span>IMSS:</span> {operador.numImss}</p> :
                                                        <p className="mt-20"><span>IMSS:</span> N/D</p>
                                                }
                                                {
                                                    operador.numLicencia !== 'undefined' ?
                                                        <p><span>Núm. de licencia:</span> {operador.numLicencia}</p> :
                                                        <p><span>Núm. de licencia:</span> N/D</p>
                                                }
                                                {
                                                    operador.tipoLicencia !== 'undefined' ?
                                                        <p><span>Tipo de licencia:</span> {operador.tipoLicencia}</p> :
                                                        <p><span>Tipo de licencia:</span> N/D</p>
                                                }
                                                {
                                                    operador.numLicencia !== 'undefined' ?
                                                        <p>
                                                            <span>Vencimiento de licencia: </span> 
                                                            {moment(operador.vencimientoLicencia).toDate().getDate()  + "/" +  (moment(operador.vencimientoLicencia).toDate().getMonth() + 1) + "/"  + moment(operador.vencimientoLicencia).toDate().getFullYear()}
                                                        </p> :
                                                        <p><span>Vencimiento de licencia:</span> N/D</p>
                                                }
                                                {
                                                    operador.medicinaPreventiva !== 'undefined' ?
                                                        <p><span>Medicina prev:</span> {operador.medicinaPreventiva}</p> :
                                                        <p><span>Medicina prev:</span> N/D</p>
                                                }
                                                {
                                                    operador.medicinaPreventiva !== 'undefined' ?
                                                        <p>
                                                            <span>Vencimiento medicina prev: </span>
                                                            {moment(operador.vencimientoMedicinaPreventiva).toDate().getDate()  + "/" +  (moment(operador.vencimientoMedicinaPreventiva).toDate().getMonth() + 1) + "/"  + moment(operador.vencimientoMedicinaPreventiva).toDate().getFullYear()}
                                                        </p> :
                                                        <p><span>Vencimiento medicina prev:</span> N/D</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        this.props.auth.user ?
                                            this.props.auth.user.rol === 'administrador' ?
                                                <div className="card-action action-operador">
                                                    <Link className="right" to={"/editaroperador/" + operador._id}>
                                                        Editar
                                                    </Link>
                                                </div> : null
                                            : null
                                    }
                                    <div className="estado-operador" id={operador._id}>
                                        {
                                            operador.estado ? <h6>{operador.estado}</h6> : <h6>Sin estado</h6>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                        
                    }
                </div>
                {
                    this.props.auth.user ?
                        this.props.auth.user.rol === 'administrador' ?
                            <div className="fixed-action-btn">
                                <Link to="/crearoperador" className="btn-floating btn-large waves-effect waves-light red "><i className="material-icons">add</i></Link>
                            </div> 
                            : null
                        : null
                }
                
            </div>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth  
});
export default connect(mapStateToProps, null)(Operadores);
