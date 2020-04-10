import React, { Component } from 'react'

export default class ObtenerEstadoUnidad extends Component {
    render() {
        return (
            <div className="">
                { this.props.estado === 'Activo' ?  <div className="estado-unidad-principal green" id={this.props.unidad}><h6>{this.props.estado}</h6></div>: null}
                { this.props.estado === 'Taller' ||  this.props.estado === 'Guardia' ?  <div className="estado-unidad-principal yellow-fuerte" id={this.props.unidad}><h6>{this.props.estado}</h6></div>: null}
                { this.props.estado === 'Accidente' ?  <div className="estado-unidad-principal red" id={this.props.unidad}><h6>{this.props.estado}</h6></div>: null}
                { this.props.estado ? null : <div className="estado-unidad-principal gray" id={this.props.unidad}><h6>Sin estado</h6></div>}
            </div>
        )
    }
}
