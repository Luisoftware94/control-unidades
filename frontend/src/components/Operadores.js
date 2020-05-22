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
    componentDidUpdate(){
        this.contadorOperadores();
    }
    contadorOperadores(){
        var activos = 0, permiso = 0, posturero = 0, 
            incapacidad = 0, ausentismo = 0, capacitacion = 0, 
            suspencion = 0, juridico = 0, baja = 0, todos = 0, noApto = 0;
        this.state.operadores.map((operador) => {
            todos++;
            switch(operador.estado){
                case 'Activo':
                    activos++;
                    break;
                case 'Permiso':
                    permiso++;
                    break;
                case 'Posturero':
                    posturero++;
                    break;
                case 'Incapacidad':
                    incapacidad++;
                    break;
                case 'Ausentismo':
                    ausentismo++;
                    break;
                case 'Capacitación':
                    capacitacion++;
                    break;
                case 'Suspención':
                    suspencion++;
                    break;
                case 'Baja':
                    baja++;
                    break;
                case 'Jurídico':
                    juridico++;
                    break;
                case 'No-apto':
                    noApto++;
                    break;
                default:
                    break;
            }
            return true;
        });
        document.getElementById('tabla-todos').innerHTML = todos;
        document.getElementById('tabla-activos').innerHTML = activos;
        document.getElementById('tabla-permiso').innerHTML = permiso;
        document.getElementById('tabla-posturero').innerHTML = posturero;
        document.getElementById('tabla-incapacidad').innerHTML = incapacidad;
        document.getElementById('tabla-ausentismo').innerHTML = ausentismo;
        document.getElementById('tabla-capacitacion').innerHTML = capacitacion;
        document.getElementById('tabla-suspencion').innerHTML = suspencion;
        document.getElementById('tabla-no-apto').innerHTML = noApto;
        document.getElementById('tabla-juridico').innerHTML = juridico;
        document.getElementById('tabla-baja').innerHTML = baja;
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
    buscarOperador(e){
        const todosOperadores = document.getElementsByClassName('operadores-control');
        const operadores = document.getElementsByClassName(e.target.value);
        if(operadores.length > 0){
            for(var i = 0; i < todosOperadores.length; i++){
                todosOperadores[i].classList.add("no-mostrar");
            }
            operadores[0].classList.remove("no-mostrar");
        } else{
            for(i = 0; i < todosOperadores.length; i++){
                todosOperadores[i].classList.remove("no-mostrar");
            }
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
                    case 'No-apto':
                        document.getElementById(operador._id).classList.add('yellow-fuerte');
                        break;
                    default:
                        document.getElementById(operador._id).classList.add('gray');
                        break;
                }
                return true;
            });
        }
    }
    estadoOperador(estado){
        const operadores = document.getElementsByClassName(estado);
        const todosOperadores = document.getElementsByClassName('operadores-control');
        if(estado === 'Todos'){
            for(var i = 0; i < todosOperadores.length; i++){
                todosOperadores[i].classList.remove("no-mostrar");
            }
        } else{
            for(i = 0; i < todosOperadores.length; i++){
                todosOperadores[i].classList.add("no-mostrar");
            }
            for(i = 0; i < operadores.length; i++){
                operadores[i].classList.remove("no-mostrar");
            }
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
                    <div className="buscador-operadores">
                        <input onChange={this.buscarOperador} type="text" placeholder="Buscar operador..." name="buscar" className="browser-default input-buscador" id="buscar-operador"></input>
                        <button><i className="fa fa-search"></i></button>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div className="card contenedor-stats">
                            <h3>Estado de operadores</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Todo</th>
                                        <th>Act</th>
                                        <th>Perm</th>
                                        <th>Post</th>
                                        <th>Inca</th>
                                        <th>Ause</th>
                                        <th>Capa</th>
                                        <th>Susp</th>
                                        <th>N/Ap</th>
                                        <th>Jurí</th>
                                        <th>Baj</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td onClick={this.estadoOperador.bind(this, 'Todos')}><p id="tabla-todos"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Activo')}><p id="tabla-activos"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Permiso')}><p id="tabla-permiso"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Posturero')}><p id="tabla-posturero"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Incapacidad')}><p id="tabla-incapacidad"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Ausentismo')}><p id="tabla-ausentismo"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Capacitación')}><p id="tabla-capacitacion"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Suspención')}><p id="tabla-suspencion"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'No-apto')}><p id="tabla-no-apto"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Jurídico')}><p id="tabla-juridico"></p></td>
                                        <td onClick={this.estadoOperador.bind(this, 'Baja')}><p id="tabla-baja"></p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        this.state.operadores.map(operador => (
                            <div className={"col s12 m6 l4 xl3 operadores-control " + operador.compania + " " + operador.numEmpleado + " " + operador.estado} key={operador._id}>
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
                                            operador.estado ? 
                                                operador.estado === 'No-apto' ?
                                                        <h6>No apto</h6> :
                                                        operador.estado === 'Suspención' ?
                                                            <h6>Suspensión</h6> :
                                                            <h6>{operador.estado}</h6> 
                                                : 
                                                <h6>Sin estado</h6>
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
