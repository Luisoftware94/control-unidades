import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const ip = "http://192.168.1.166:4000/";

export default class Operadores extends Component {

    state = {
        operadores: []
    } 
    componentDidMount(){
        this.getOperadores();
    }
    async getOperadores(){
        const res = await axios.get(ip + 'api/operadores');
        this.setState({
            operadores: res.data
        });
        this.asignarColores();
    }
    asignarColores(){
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

    render() {
        return (
            <div className="container">
                <div className="row">
                    {
                        this.state.operadores.map(operador => (
                            <div className="col s12 m6 l4 xl3" key={operador._id}>
                                <div className="card">
                                    <div className="card-content card-operador">
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-action action-operador">
                                        <Link className="right" to={"/editaroperador/" + operador._id}>
                                            Editar
                                        </Link>
                                    </div>
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
                <div className="fixed-action-btn">
                    <Link to="/crearoperador" className="btn-floating btn-large waves-effect waves-light red "><i className="material-icons">add</i></Link>
                </div>
            </div>
        )
    }
}
