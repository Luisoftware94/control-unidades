import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ObtenerOperador from './ObtenerOperador';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const ip = "http://localhost:4000/"

class ObtenerUnidades extends Component{
    state={
        unidades: []
    }
    async componentDidMount(){
        this.getUnidades();
    }
    
    async getUnidades(){
        const res = await axios.get(ip +'api/unidades/rol/' + this.props.rol);
        this.setState({
            unidades: res.data
        });
        this.asignarColores();
    }
    asignarColores(){
        this.state.unidades.map((unidad) => {
            switch(unidad.estado){
                case 'Activo':
                    document.getElementById(unidad._id).classList.add('green');
                    break;
                case 'Taller':
                    document.getElementById(unidad._id).classList.add('yellow-fuerte');
                    break;
                case 'Guardia':
                    document.getElementById(unidad._id).classList.add('azul');
                    break;
                case 'Accidente':
                    document.getElementById(unidad._id).classList.add('red');
                    break;
                default:
                    document.getElementById(unidad._id).classList.add('gray');
            }
            return true;
        });
    }
    render(){
        return (
            <div>
                {
                    this.state.unidades.length > 0 ?
                        <div>
                            {
                                this.state.unidades.map(unidad => (
                                    <div className={"col s12 m10 offset-m1 l6 " + unidad.rol + " unidad-control"} key={unidad._id}>
                                        <div className="card card-unidad">
                                            <div className="card-content content-unidad">
                                                <div className="card-title"><h4 className="unidad-title">Unidad { unidad.numUnidad}</h4></div>
                                                <div className="operadores-unidad center-align hide-on-med-and-down">
                                                    <div className="operador left">
                                                        {
                                                            unidad.operador1 !== "" ? <ObtenerOperador id={unidad.operador1} operador="1" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                    <div className="operador right">
                                                        {
                                                            unidad.operador2 !== "" ? <ObtenerOperador id={unidad.operador2} operador="2" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="operadores-unidad center-align hide-on-large-only">
                                                    <div className="operador">
                                                        {
                                                            unidad.operador1 !== "" ? <ObtenerOperador id={unidad.operador1} operador="1" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                    <div className="operador">
                                                        {
                                                            unidad.operador2 !== "" ? <ObtenerOperador id={unidad.operador2} operador="2" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                this.props.rolUser ?
                                                    this.props.rolUser === 'administrador' ?
                                                        <div className="action-principal">
                                                            <Link to={"/detalleunidad/" + unidad._id} className="left mar-left">Detalle</Link>
                                                            <Link to={"/editarunidad/" + unidad._id} className="right">Asignar</Link>
                                                        </div> :
                                                        <div className="action-principal">
                                                            <Link to={"/detalleunidad/" + unidad._id} className="right">Detalle</Link>
                                                        </div>
                                                    : null
                                            }
                                            <div className="estado-unidad-principal" id={unidad._id}>
                                                {
                                                    unidad.estado ?
                                                        <h6>{ unidad.estado }</h6> :
                                                        <h6>Sin estado</h6>
                                                }
                                            </div>
                                        </div>
                                    </div>                    
                                ))
                            }
                        </div> :
                        <p className="texto-no-unidad unidad-control">No hay unidades asignadas al rol</p>
                }
                
            </div>
        );
    }
}

class Unidades extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state={
        roles: []
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        }
    }
    async componentDidMount(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
        this.getRoles();
    }
    async getRoles(){
        const res = await axios.get(ip + 'api/roles');
        this.setState({
            roles: res.data
        });
    }
    unidadesPorRol(e){
        const unidadesRol = document.getElementsByClassName(e.target.value);
        const todasUnidades = document.getElementsByClassName('unidad-control');
        for(var i = 0; i < todasUnidades.length; i++){
            todasUnidades[i].classList.add("no-mostrar");
        }
        if(e.target.value === 'todo'){
            for(i = 0; i < todasUnidades.length; i++){
                todasUnidades[i].classList.remove("no-mostrar");
            }
        }
        for(i = 0; i < unidadesRol.length; i++){
            unidadesRol[i].classList.remove("no-mostrar");
        }
    }
    render() {
        return (
            <div className="container">
                <div className="head-unidades">
                    <p>Mostrar:</p>
                    <select name="select-rol" id="select-rol" onChange={ this.unidadesPorRol } className="browser-default"  >
                        <option value="todo" default>Todos</option>
                        {
                            this.state.roles.map(rol => 
                                <option key={rol._id} value={rol._id}>
                                    {rol.nombre}
                                </option>
                            )
                        }
                    </select>
                </div>
                {
                    this.state.roles.map(rol => (
                        <div key={rol._id}>
                            <div className={"col s12 m12 unidad-control " + rol._id} >
                                <h5 className="titulo-rol-unidades" >{rol.nombre}</h5>
                            </div>
                            <div className="row">
                                <ObtenerUnidades rol={rol._id} rolUser={this.props.auth.user.rol}/> 
                            </div>
                        </div>
                    ))
                }
                {
                    this.props.auth.user ?
                        this.props.auth.user.rol === 'administrador'?
                            <div className="fixed-action-btn">
                                <Link to="/crearunidad" className="btn-floating btn-large waves-effect waves-light red "><i className="material-icons">add</i></Link>
                            </div> : null
                        : null
                }
            </div>        
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth  
});
export default connect(mapStateToProps, null)(Unidades);
