import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const ip = "http://localhost:4000/";

class DetalleUnidad extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        unidad: "",
        rol: "",
        operador1: "",
        operador2: ""
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        } else{
            this.asignarColores();
        }
    }
    async componentDidMount(){
        this.getUnidad();
    }
    componentWillUpdate(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
    }
    async getUnidad(){
        const res = await axios.get(ip + 'api/unidades/' + this.props.match.params.id);
        this.setState({unidad: res.data});
        this.getRol();
        if(this.state.unidad.operador1){
            const op1data = await axios.get(ip + 'api/operadores/' + this.state.unidad.operador1);
            this.setState({operador1: op1data.data});
        }
        if(this.state.unidad.operador2){
            const op2data = await axios.get(ip + 'api/operadores/' + this.state.unidad.operador2);
            this.setState({operador2: op2data.data});
        }
        
    }
    async getRol(){
        const resRol = await axios.get(ip + 'api/roles/' + this.state.unidad.rol);
        this.setState({rol: resRol.data.nombre});
    }    
    asignarColores(){
        if(this.props.auth.isAuthenticated){
            switch(this.state.unidad.estado){
                case 'Activo':
                    document.getElementById(this.state.unidad._id).classList.add('green');
                    break;
                case 'Taller':
                    document.getElementById(this.state.unidad._id).classList.add('yellow-fuerte');
                    break;
                case 'Guardia':
                    document.getElementById(this.state.unidad._id).classList.add('azul');
                    break;
                case 'Accidente':
                    document.getElementById(this.state.unidad._id).classList.add('red');
                    break;
                default:
                    document.getElementById(this.state.unidad._id).classList.add('gray');
                    break;
                
            }
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col s12 m10 l8 offset-m1 offset-l2">
                    <div className="card card-detalle-unidad">
                        <p className="compania">{this.state.rol}</p>
                        <h3 className="titulo">Unidad {this.state.unidad.numUnidad}</h3>
                        <div className="operadores-unidad center-align hide-on-large-only">
                            <div className="operador detalle-unidad">
                                <div>
                                    <div className="operador-imagen-contenedor">
                                        { this.state.operador1.pathFotografia ? <img src={ip + this.state.operador1.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                                    </div>
                                    <div className="operador-content">
                                        <div className="operador-content-numEmpleado">
                                            <h6>{ this.state.operador1.numEmpleado }</h6>
                                        </div>
                                        <div className="operador-content-nombre valign-wrapper">
                                            <p className="operador-nombre">{ this.state.operador1.nombre }</p>
                                        </div>
                                        <div className="operador-number-content">
                                            <div className="operador-number-icono">
                                                <img src="./phone.png" alt=""/>
                                            </div>
                                            <div className="operador-number">
                                                <p>Cel. { this.state.operador1.telefono }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="link">
                                        <Link to={"/detalleoperador/" + this.state.unidad.operador1} className="center-align">Más información</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="operador detalle-unidad">
                                <div>
                                    <div className="operador-imagen-contenedor">
                                        { this.state.operador2.pathFotografia ? <img src={ip + this.state.operador2.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                                    </div>
                                    <div className="operador-content">
                                        <div className="operador-content-numEmpleado">
                                            <h6>{ this.state.operador2.numEmpleado }</h6>
                                        </div>
                                        <div className="operador-content-nombre valign-wrapper">
                                            <p className="operador-nombre">{ this.state.operador2.nombre }</p>
                                        </div>
                                        <div className="operador-number-content">
                                            <div className="operador-number-icono">
                                                <img src="./phone.png" alt=""/>
                                            </div>
                                            <div className="operador-number">
                                                <p>Cel. { this.state.operador2.telefono }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="link">
                                        <Link to={"/detalleoperador/" + this.state.unidad.operador2} className="center-align">Más información</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="operadores-unidad center-align hide-on-med-and-down">
                            <div className="operador left detalle-unidad">
                                <div>
                                    <div className="operador-imagen-contenedor">
                                        { this.state.operador1.pathFotografia ? <img src={ip + this.state.operador1.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                                    </div>
                                    <div className="operador-content">
                                        <div className="operador-content-numEmpleado">
                                            <h6>{ this.state.operador1.numEmpleado }</h6>
                                        </div>
                                        <div className="operador-content-nombre valign-wrapper">
                                            <p className="operador-nombre">{ this.state.operador1.nombre }</p>
                                        </div>
                                        <div className="operador-number-content">
                                            <div className="operador-number-icono">
                                                <img src="./phone.png" alt=""/>
                                            </div>
                                            <div className="operador-number">
                                                <p>Cel. { this.state.operador1.telefono }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="link">
                                        <Link to={"/detalleoperador/" + this.state.unidad.operador1} className="center-align">Más información</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="operador right detalle-unidad">
                                <div>
                                    <div className="operador-imagen-contenedor">
                                        { this.state.operador2.pathFotografia ? <img src={ip + this.state.operador2.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                                    </div>
                                    <div className="operador-content">
                                        <div className="operador-content-numEmpleado">
                                            <h6>{ this.state.operador2.numEmpleado }</h6>
                                        </div>
                                        <div className="operador-content-nombre valign-wrapper">
                                            <p className="operador-nombre">{ this.state.operador2.nombre }</p>
                                        </div>
                                        <div className="operador-number-content">
                                            <div className="operador-number-icono">
                                                <img src="./phone.png" alt=""/>
                                            </div>
                                            <div className="operador-number">
                                                <p>Cel. { this.state.operador2.telefono }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="link">
                                        <Link to={"/detalleoperador/" + this.state.unidad.operador2} className="center-align">Más información</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.unidad.estado === 'Accidente' ?
                                <div className="accidente">
                                    <p className="intro">La unidad se encuentra accidentada:</p>
                                    <p> 
                                        Fecha: 
                                        {
                                            " " + moment(this.state.unidad.fechaAccidente).toDate().getDate() + "/" +  (moment(this.state.unidad.fechaAccidente).toDate().getMonth() + 1) + "/" + moment(this.state.unidad.fechaAccidente).toDate().getFullYear()
                                        }
                                    </p>
                                    <p>
                                        Hora:
                                        {
                                            " " + moment(this.state.unidad.fechaAccidente).toDate().getHours() + ":" + moment(this.state.unidad.fechaAccidente).toDate().getMinutes()
                                        }
                                    </p>
                                    <p>
                                        En:
                                        {
                                            " " + this.state.unidad.ubicacionAccidente
                                        }
                                    </p>
                                </div> :
                                null
                        }
                        {
                            this.props.auth.user ?
                                this.props.auth.user.rol === 'administrador' ?
                                    <div className="action-principal">
                                        <Link to={"/historialunidad/" + this.state.unidad.numUnidad} className="left mar-left">Historial</Link>
                                        <Link to={"/editarunidad/" + this.state.unidad._id} className="right">Asignar</Link>
                                    </div> :
                                    <div className="action-principal">
                                        <Link to={"/historialunidad/" + this.state.unidad.numUnidad} className="right">Historial</Link>
                                    </div>
                                : null
                        }
                        
                        <div className="estado-unidad-principal" id={this.state.unidad._id}>
                            {
                                this.state.unidad.estado ?
                                    <h6>{ this.state.unidad.estado }</h6> :
                                    <h6>Sin estado</h6>
                            }
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
export default connect(mapStateToProps, null)(DetalleUnidad);
