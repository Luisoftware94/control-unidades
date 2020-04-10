import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ObtenerOperador from './ObtenerOperador';
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
                    document.getElementById(unidad._id).classList.add('yellow-fuerte');
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
                                    <div className="col s12 m10 offset-m1 l6" key={unidad._id}>
                                        <div className="card card-unidad">
                                            <div className="card-content content-unidad">
                                                <div className="card-title"><h4 className="unidad-title">Unidad { unidad.numUnidad}</h4></div>
                                                <div className="operadores-unidad center-align hide-on-med-and-down">
                                                    <div className="operador left">
                                                        {
                                                            unidad.operador1 ? <ObtenerOperador id={unidad.operador1} operador="1" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                    <div className="operador right">
                                                        {
                                                            unidad.operador2 ? <ObtenerOperador id={unidad.operador2} operador="2" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="operadores-unidad center-align hide-on-large-only">
                                                    <div className="operador">
                                                        {
                                                            unidad.operador1 ? <ObtenerOperador id={unidad.operador1} operador="1" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                    <div className="operador">
                                                        {
                                                            unidad.operador2 ? <ObtenerOperador id={unidad.operador2} operador="2" unidad={unidad.numUnidad}/> : <p className="vertical-center">No asignado</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="action-principal">
                                                <Link to={"/historialunidad/" + unidad.numUnidad} className="left mar-left">Historial</Link>
                                                <Link to={"/editarunidad/" + unidad._id} className="right">Asignar</Link>
                                            </div>
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
                        <p className="texto-no-unidad">No hay unidades asignadas al rol</p>
                }
                
            </div>
        );
    }
}

export default class Unidades extends Component {
    state={
        roles: []
    }
    async componentDidMount(){
        this.getRoles();
    }
    async getRoles(){
        const res = await axios.get(ip + 'api/roles');
        this.setState({
            roles: res.data
        });
    }
    render() {
        return (
            <div className="container">
                {
                    this.state.roles.map(rol => (
                        <div key={rol._id}>
                            <div className="col s12 m12">
                                <h5 className="titulo-rol-unidades" >{rol.nombre}</h5>
                            </div>
                            <div className="row">
                                <ObtenerUnidades rol={rol._id} />
                            </div>
                            
                        </div>
                    ))
                }
                <div className="fixed-action-btn">
                    <Link to="/crearunidad" className="btn-floating btn-large waves-effect waves-light red "><i className="material-icons">add</i></Link>
                </div>
            </div>        
        )
    }
}
