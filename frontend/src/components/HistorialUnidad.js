import React, { Component } from 'react'
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
const ip = "http://localhost:4000/"

export default class HistorialUnidad extends Component {
    state = {
        historial: []
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
                                <Link to={"/unidades"} className="right">
                                    <button className="btn waves-effect waves-light">Regresar</button>
                                </Link>

                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
