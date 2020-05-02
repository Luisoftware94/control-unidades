import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ObtenerOperador from './ObtenerOperador';
import ObtenerNombreRol from './ObtenerNombreRol';
import ObtenerEstadoUnidad from './ObtenerEstadoUnidad';
const ip = "http://localhost:4000/"

class Principal extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        unidades: [],
        auth: false
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
        const res = await axios.get(ip + 'api/unidades/unidades/rol');
        this.setState({
            unidades: res.data
        });
    }
    
    render() {
        
        return (
            <div className="container margin-5">
                <div className="row">
                    {
                        this.state.unidades ?  <p></p> : <h3 className="center">No hay unidades registradas!</h3>
                    }
                    <div className="col s12 l10 offset-l1">
                        <Carousel showThumbs={false} useKeyboardArrows={true} autoPlay={true} infiniteLoop={true}>
                            {
                                this.state.unidades.map(unidad => (
                                    <div key={unidad._id}>
                                        <div className="header-rol">
                                            <ObtenerNombreRol id={unidad.rol} />
                                        </div>
                                        <div className="header-unidad">
                                            <h2>Unidad {unidad.numUnidad}</h2>
                                        </div>
                                        <div className="contenido-unidad-principal hide-on-med-and-down">
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
                                        <div className="contenido-unidad-principal hide-on-large-only">
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
                                        {
                                            this.props.auth.user ?
                                                this.props.auth.user.rol === 'administrador' ?
                                                    <div className="action-principal">
                                                        <Link to={"/detalleunidad/" + unidad._id} className="left mar-left">Detalle</Link>
                                                        <Link to={"/editarunidad/" + unidad._id} className="right">Asignar</Link>
                                                    </div> :
                                                    <div className="action-principal">
                                                        <Link to={"/detalleunidad/" + unidad._id} className="right">Detalle</Link>
                                                    </div>
                                                : null
                                        }
                                        <ObtenerEstadoUnidad estado={unidad.estado} unidad={unidad._id} />
                                    </div>
                                ))
                            }
                        </Carousel>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth  
});
export default connect(mapStateToProps, null)(Principal);
