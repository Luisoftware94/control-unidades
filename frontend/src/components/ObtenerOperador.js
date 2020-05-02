import React, { Component } from 'react';
import axios from 'axios';
const ip = "http://localhost:4000/"


export default class ObtenerOperador extends Component {
    state = {
        operador: [],
        pathFotografia: ""
    }
    async obtenerOperador(){
        const res = await axios.get(ip + 'api/operadores/' + this.props.id);
        this.setState({
            operador: res.data
        });
        return true;
    }
    componentDidMount(){
        this.obtenerOperador();
    }

    render() {
        return (
            <div>
                <div className="operador-imagen-contenedor">
                    { this.state.operador.pathFotografia ? <img src={ip + this.state.operador.pathFotografia} alt=""/> : <img src={ip + "avatar.jpg"} alt=""/> }
                </div>
                
                <div className="operador-content">
                    <div className="operador-content-numEmpleado">
                        <h6>{ this.state.operador.numEmpleado }</h6>
                    </div>
                    <div className="operador-content-nombre valign-wrapper">
                        <p className="operador-nombre">{ this.state.operador.nombre }</p>
                    </div>
                    <div className="operador-number-content">
                        <div className="operador-number-icono">
                            <img src="./phone.png" alt=""/>
                        </div>
                        <div className="operador-number">
                            <p>Cel. { this.state.operador.telefono }</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
