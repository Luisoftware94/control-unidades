import React, { Component } from 'react';
import axios from 'axios';
import M from 'materialize-css';
const ip = "http://192.168.1.166:4000/";

export default class CreateRol extends Component {
    state = {
        nombre: "",
        descripcion: "",
        editing: false,
        _id: ""
    }
    async componentDidMount(){
        if(this.props.match.params.id){
            const res = await axios.get(ip + 'api/roles/' + this.props.match.params.id );
            this.setState({
                nombre: res.data.nombre,
                descripcion: res.data.descripcion,
                editing: true,
                _id: this.props.match.params.id
            });
            this.actualizarInputs();
        }
    }
    actualizarInputs(){
        M.updateTextFields();
    }
    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    deleteUnidad = async (id) => {
        if(this.state.editing){
            if(window.confirm('¿Seguro que quieres eliminar el ' + this.state.nombre + '? Esto hará que las unidades asignadas a ese rol se eliminen')){
                const res = await axios.delete(ip + 'api/roles/' + this.state._id);
                M.toast({html: res.data.message});
                window.location.href = '/roles';
            }
        }
    }
    validarFormulario(){
        if(this.state.nombre.length > 6){
            return true;
        } else{
            M.toast({html: 'El nombre del rol debe ser de la forma: Rol 111'});
        }
    }
    onSubmit = async (e) => {
        e.preventDefault();
        if(this.validarFormulario()){
            const newRol = {
                nombre: this.state.nombre,
                descripcion: this.state.descripcion
            }
            if(this.state.editing){
                const res = await axios.put(ip + 'api/roles/' + this.state._id, newRol);
                M.toast({html: res.data.message});
            } else{
                const res = await axios.post(ip + 'api/roles', newRol);
                M.toast({html: res.data.message});
            }
            window.location.href = "/roles";
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    Alta de Roles
                                </span>
                                {
                                    this.state.editing ? <div className="btn" onClick={() => this.deleteUnidad(this.state._id)}>Eliminar</div> : <p></p>
                                }
                                <form onSubmit={this.onSubmit}>
                                    <div className="input-field">
                                        {
                                            this.state.editing ?
                                                <input id="nombre" name="nombre" type="text" onChange={this.onInputChange}  value={this.state.nombre} disabled /> :
                                                <input id="nombre" name="nombre" type="text" onChange={this.onInputChange}  value={this.state.nombre} />
                                        }
                                        <label htmlFor="nombre">Nombre</label>
                                    </div>
                                    <div className="input-field">
                                        <input id="descripcion" name="descripcion" type="text" onChange={this.onInputChange} value={this.state.descripcion} />
                                        <label htmlFor="descripcion">Descripción</label>
                                    </div>
                                    <div className="div-submit-operador">
                                        <button className="btn waves-effect waves-light" type="submit">Enviar
                                            <i className="material-icons right">send</i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}
