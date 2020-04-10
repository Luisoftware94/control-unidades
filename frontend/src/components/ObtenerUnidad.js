import React, { Component } from 'react'
import axios from 'axios';
const ip = "http://192.168.1.166:4000/";

export default class ObtenerUnidad extends Component {
    state = {
        unidades: []
    }
    async obtenerUnidad(){
        const res = await axios.get(ip + 'api/unidades/rol/' + this.props.rol);
        this.setState({
            unidades: res.data
        });
        this.asignarColores();
    }
    componentDidMount(){
        this.obtenerUnidad();
        
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
                    break;
            }
            return true;
        });
    }
    render() {
        return (
            <div>
                {
                    this.state.unidades.length > 0 ? 
                        <div className="collection">
                            {
                                this.state.unidades.map(unidad => (
                                    <a href="#!" key={unidad._id} className="collection-item">
                                        {
                                            unidad.estado ? 
                                                <span className="badge" id={unidad._id}>{ unidad.estado }</span> :
                                                <span className="badge" id={unidad._id}>Sin estado</span>
                                        }
                                        { unidad.numUnidad }
                                    </a>
                                ))
                            }
                        </div> :
                        <p className="no-asignadas-rol center">No hay unidades asignadas al rol</p> 
                }
            </div>
        )
    }
}
