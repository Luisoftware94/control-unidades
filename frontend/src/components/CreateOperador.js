import React, { Component } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import FormData from 'form-data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment';
const ip = "http://localhost:4000/";

class CreateOperador extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state={
        nombre: "",
        numEmpleado: "",
        telefono: "",
        estado: "",
        asignado: "",
        fotografia: "",
        editing: false,
        _id: "",
        compania: "",
        numImss: "",
        numLicencia: "",
        tipoLicencia: "",
        vencimientoLicencia: new Date(),
        medicinaPreventiva: "",
        vencimientoMedicinaPreventiva: new Date()
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        } else{
            if(this.props.auth.user.rol !== 'administrador'){
                this.props.history.push('/');
            }  
        }
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
                compania: res.data.compania,
                numImss: res.data.numImss,
                numLicencia: res.data.numLicencia,
                tipoLicencia: res.data.tipoLicencia,
                medicinaPreventiva: res.data.medicinaPreventiva,
                editing: true,
                _id: this.props.match.params.id
            });
            if(res.data.vencimientoLicencia){
                this.setState({
                    vencimientoLicencia: moment(res.data.vencimientoLicencia).toDate()
                });
            }
            if(res.data.vencimientoMedicinaPreventiva){
                this.setState({
                    vencimientoMedicinaPreventiva: moment(res.data.vencimientoMedicinaPreventiva).toDate()
                });
            }
            this.actualizarInputs();
            const { isAuthenticated } = this.props.auth;
            this.requireAuth(isAuthenticated);
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

    onchangeDateLicencia = vencimientoLicencia => {
        this.setState({vencimientoLicencia});
    }

    onchangeDateMedicinaPrev = vencimientoMedicinaPreventiva => {
        this.setState({vencimientoMedicinaPreventiva});
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
            form.append('compania', this.state.compania);
            form.append('numImss', this.state.numImss);
            form.append('numLicencia', this.state.numLicencia);
            form.append('tipoLicencia', this.state.tipoLicencia);
            form.append('vencimientoLicencia', this.state.vencimientoLicencia);
            form.append('medicinaPreventiva', this.state.medicinaPreventiva);
            form.append('vencimientoMedicinaPreventiva', this.state.vencimientoMedicinaPreventiva);

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
                                    
                                    <div className="input-field">
                                        <select className="browser-default" name="compania" onChange={this.onInputChange} value={this.state.compania}>
                                            <option value="" disabled>Elige la compañia</option>
                                            <option value="ODM">1 - ODM</option>
                                            <option value="OMEX">2 - OMEX</option>
                                            <option value="COMARCA">31 - COMARCA</option>
                                            <option value="TRANSFER">42 - TRANSFER</option>
                                            <option value="TCJS">43 - TCJS</option>
                                        </select>
                                    </div>

                                    <div className="input-field">
                                        <input id="numImss" type="text" name="numImss" onChange={this.onInputChange} value={this.state.numImss}/>
                                        <label htmlFor="numImss">Número de IMSS</label>
                                    </div>
                                    
                                    <div className="input-field">
                                        <input id="numLicencia" type="text" name="numLicencia" onChange={this.onInputChange} value={this.state.numLicencia}/>
                                        <label htmlFor="numLicencia">Número de licencia</label>
                                    </div>
                                        
                                    <div className="input-field">
                                        <input id="tipoLicencia" type="text" name="tipoLicencia" onChange={this.onInputChange} value={this.state.tipoLicencia}/>
                                        <label htmlFor="tipoLicencia">Tipo de licencia</label>
                                    </div>
                                        
                                    <div className="input-field">
                                        <p className="label-fechaAccidente" >Vigencia de licencia</p>
                                        <DatePicker 
                                            selected={this.state.vencimientoLicencia}
                                            onChange={this.onchangeDateLicencia}
                                            className="fechaAccidente"
                                            id="fechaAccidente"
                                            name="fechaAccidente"
                                        />
                                    </div>
                                    
                                    <div className="input-field">
                                        <input id="medicinaPreventiva" type="text" name="medicinaPreventiva" onChange={this.onInputChange} value={this.state.medicinaPreventiva}/>
                                        <label htmlFor="medicinaPreventiva">Número de medicina preventiva</label>
                                    </div>
                                    
                                    <div className="input-field">
                                        <p className="label-fechaAccidente" >Vigencia de medicina preventiva</p>
                                        <DatePicker 
                                            selected={this.state.vencimientoMedicinaPreventiva}
                                            onChange={this.onchangeDateMedicinaPrev}
                                            className="vencimientoMedicinaPreventiva"
                                            id="vencimientoMedicinaPreventiva"
                                            name="vencimientoMedicinaPreventiva"
                                        />
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
const mapStateToProps = state => ({
    auth: state.auth  
});
export default connect(mapStateToProps, null)(CreateOperador);