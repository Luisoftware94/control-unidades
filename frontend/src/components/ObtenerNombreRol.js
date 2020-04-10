import React, { Component } from 'react'
import axios from 'axios';
const ip = "http://localhost:4000/"

export default class ObtenerNombreRol extends Component {
    state = {
        rol: []
    }
    componentDidMount(){
        this.getRol();
    }
    async getRol(){
        const res = await axios.get(ip + 'api/roles/' + this.props.id);
        this.setState({
            rol: res.data
        });
    }
    render() {
        return (
            <h3>{this.state.rol.nombre}</h3>
        )
    }
}
