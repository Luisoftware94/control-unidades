import React, { Component } from 'react'
import M from 'materialize-css'
import axios from 'axios'
import FormData from 'form-data'
const ip = "http://192.168.1.166:4000/";

export default class CreateOperador extends Component {
    
    state={
        nombre: "",
        numEmpleado: "",
        telefono: "",
        estado: "",
        asignado: "",
        fotografia: "",
        editing: false,
        _id: ""
    }

    async componentDidMount(){
        
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
        });
        if(this.props.match.params.id){
            const res = await axios.get(ip + 'api/operadores/' + this.props.match.params.id);
            this.setState({
                nombre: res.data.nombre,
                numEmpleado: res.data.numEmpleado,
                telefono: res.data.telefono,
                estado: res.data.estado,
                asignado: res.data.asignado,
                editing: true,
                _id: this.props.match.params.id
            });
            this.actualizarInputs();
        }
    }
    actualizarInputs(){
        M.updateTextFields();
    }
    onInputChange = e =>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onFileChange = e => {
        let file = e.target.files[0];
        this.setState({
            fotografia: file
        });
    }
    deleteOperador = async (id) =>{
        if(this.state.editing){
            if(window.confirm('¿Seguro que quieres eliminar el operador ' + this.state.nombre + '?')){
                const res = await axios.delete(ip + 'api/operadores/' + id);
                M.toast({html: res.data.message});
                window.location.href = "/operadores";
            }
        }   
    }
    validarFormulario(){
        if(this.state.nombre.length > 10 && this.state.nombre.length < 100){
            if(/^(?:\+|-)?\d+$/.test(this.state.numEmpleado) && this.state.numEmpleado.length >= 4){
                if(/^\d{10}$/.test(this.state.telefono) || this.state.telefono === ""){
                    return true;
                } else{
                    M.toast({html: 'El teléfono debe ser de la forma: 6561234567'});
                }
            } else{
                M.toast({html: 'El número de empleado deben ser 4 o más dígitos'});
            }
        }else{
            M.toast({html: 'El nombre debe contener por lo menos 10 caracteres y menos de 100'});
        }
    }
    onSubmit = async (e) => {
        e.preventDefault();
        if(this.validarFormulario()){
            const form = new FormData();
            form.append('nombre', this.state.nombre.toUpperCase());
            form.append('numEmpleado', this.state.numEmpleado);
            form.append('telefono', this.state.telefono);
            form.append('estado', this.state.estado);
            form.append('fotografia', this.state.fotografia);
            if(this.state.editing){
                const res = await axios.put(ip + 'api/operadores/' + this.state._id, form);
                M.toast({html: res.data.message});
                window.location.href = "/operadores";
            } else{
                const res = await axios.post(ip + 'api/operadores', form);
                if(res.data.existe){
                    M.toast({html: res.data.message});
                } else{
                    M.toast({html: res.data.message});
                    window.location.href = "/operadores";
                }
            }
        }
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title center">
                                    Alta a operadores
                                </span>
                                {
                                    this.state.editing ? <div className="btn" onClick={() => this.deleteOperador(this.state._id)}>Eliminar</div> : <p></p>
                                }
                                <form onSubmit={this.onSubmit}>
                                    <div className="input-field">
                                        <input 
                                            id="nombre" 
                                            name="nombre" 
                                            onChange={this.onInputChange} 
                                            type="text" 
                                            value={this.state.nombre}
                                        />
                                        <label htmlFor="nombre">Nombre</label>
                                    </div>
                                    <div className="input-field">
                                        {
                                            this.state.editing ? 
                                                <input id="num-empleado" name="numEmpleado" onChange={this.onInputChange} type="text" value={this.state.numEmpleado} disabled/> :
                                                <input id="num-empleado" name="numEmpleado" onChange={this.onInputChange} type="text" value={this.state.numEmpleado} />
                                        }
                                        <label htmlFor="num-empleado">Número de empleado</label>
                                    </div>
                                    <div className="input-field">
                                        <input id="telefono" type="tel" className="validate" name="telefono" onChange={this.onInputChange} value={this.state.telefono}/>
                                        <label htmlFor="telefono">Teléfono</label>
                                        <span className="helper-text" data-error="Debe contener 10 dígitos" data-success="Excelente">10 dígitos</span>
                                    </div>
                                    <div className="input-field">
                                        <select className="browser-default" name="estado" onChange={this.onInputChange} value={this.state.estado}>
                                            <option value="" disabled>Elige el estado del operador</option>
                                            {
                                                this.state.asignado ? 
                                                    <option value="Activo">Activo</option> :
                                                    <option value="Activo" disabled>Activo</option>
                                            }
                                            {
                                                this.state.asignado ? 
                                                    <option value="No asignado" disabled>No asignado</option> :
                                                    <option value="No asignado" defaultValue>No asignado</option>
                                            }
                                            <option value="Permiso">Permiso</option>
                                            <option value="Posturero">Posturero</option>
                                            <option value="Incapacidad">Incapacidad</option>
                                            <option value="Ausentismo">Ausentismo</option>
                                            <option value="Capacitación">Capacitación</option>
                                            <option value="Suspención">Suspención</option>
                                            <option value="Jurídico">Jurídico</option>
                                            <option value="Baja">Baja</option>
                                        </select>
                                    </div>
                                    <div className="file-field input-field">
                                        <p className="label-foto">Fotografía</p>
                                        <div className="btn btn-foto">
                                            <span>Archivo</span>
                                            <input type="file" name="fotografia" onChange={this.onFileChange} />
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text"/>
                                        </div>
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
