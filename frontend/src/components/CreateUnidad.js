import React, { Component } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const ip = "http://localhost:4000/";

class CreateUnidad extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    };
    state = {
        operadores: [],
        roles: [],
        numUnidad: "",
        estado: "",
        estadoAnterior: "",
        operador1: "",
        operador2: "",
        operador1Anterior: "",
        nombreOperador1Anterior: "",
        nombreOperador2Anterior: "",
        operador2Anterior: "",
        rol: "",
        rolAnterior: "",
        base: "",
        baseAnterior: "",
        fechaAccidente: null,
        ubicacionAccidente: "",
        editing: false,
        _id: "",
        indexOperador1Anterior: 0,
        indexOperador2Anterior: 0,
    }
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        } else {
            if(this.props.auth.user.rol !== 'administrador'){
                this.props.history.push('/');
            }
        }
    }
    async componentDidMount(){
        const res = await axios.get(ip + 'api/operadores/no/asignados');
        const res1 = await axios.get(ip + 'api/roles');
        this.setState({
            operadores: res.data,
            roles: res1.data
        });
        if(this.props.match.params.id){
            const res = await axios.get(ip + 'api/unidades/' + this.props.match.params.id);
            this.setState({
                numUnidad: res.data.numUnidad,
                estado: res.data.estado,
                estadoAnterior: res.data.estado,
                operador1: res.data.operador1,
                operador1Anterior: res.data.operador1,
                operador2: res.data.operador2,
                operador2Anterior: res.data.operador2,
                rol: res.data.rol,
                rolAnterior: res.data.rol,
                base: res.data.base,
                baseAnterior: res.data.base,
                ubicacionAccidente: res.data.ubicacionAccidente,
                ubicacionAccidenteAnterior: res.data.ubicacionAccidente,
                editing: true,
                _id: this.props.match.params.id
            });
            if(res.data.fechaAccidente){
                this.setState({
                    fechaAccidente: moment(res.data.fechaAccidente).toDate(),
                    fechaAccidenteAnterior: moment(res.data.fechaAccidente).toDate()
                });
            }
            const res1 = await axios.get(ip + 'api/operadores/' + this.state.operador1Anterior);
            const res2 = await axios.get(ip + 'api/operadores/' + this.state.operador2Anterior);
            this.setState({
                nombreOperador1Anterior: res1.data.nombre,
                nombreOperador2Anterior: res2.data.nombre
            });
            this.actualizarInputs();
        }
    }
    componentWillUpdate(){
        const { isAuthenticated } = this.props.auth;
        this.requireAuth(isAuthenticated);
    }
    actualizarInputs(){
        M.updateTextFields();
        var elems = document.querySelectorAll(".dateset");
            M.Datepicker.init(elems, {
                defaultDate: new Date(),
                format: "ddd d, mmm",
                container: "body",
                onSelect: function(date) {
                    this.setState({ fechaAccidente: this.state.value });
                },
                autoClose: true
            });
    }
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        
    }
    onchangeDate = fechaAccidente => {
        this.setState({fechaAccidente});
    }
    seleccionaOperador = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        switch(e.target.id){
            case 'operador1':
                if(this.state.indexOperador1Anterior !== 0){
                    document.getElementById('operador2').options[this.state.indexOperador1Anterior].disabled = false;
                }
                document.getElementById('operador2').options[e.target.selectedIndex].disabled = true;
                this.setState({indexOperador1Anterior: e.target.selectedIndex});
                break;
            case 'operador2':
                if(this.state.indexOperador1Anterior !== 0){
                    document.getElementById('operador1').options[this.state.indexOperador2Anterior].disabled = false;
                }
                document.getElementById('operador1').options[e.target.selectedIndex].disabled = true;
                this.setState({indexOperador2Anterior: e.target.selectedIndex});
                break;
            default:
                break;
        }
    }
    deleteUnidad = async (id) => {
        if(this.state.editing){
            if(window.confirm('¿Seguro que quieres eliminar la unidad ' + this.state.numUnidad + '?')){
                const respuesta = await axios.delete(ip + 'api/unidades/' + this.state._id);
                M.toast({html: respuesta.data.message});
                window.location.href = '/unidades';
            }
        }
    }
    validarFormulario(){
        if(/^(?:\+|-)?\d+$/.test(this.state.numUnidad) && this.state.numUnidad.length === 4){
            if(this.state.rol !== ""){
                if(this.state.base !== ""){
                    return true;
                } else{
                    M.toast({html: 'Debe seleccionar la base de la unidad'});    
                }
            } else{
                M.toast({html: 'Debe asignar la unidad a un rol'});
            }
        } else{
            M.toast({html: 'El número de la unidad debe ser de la forma: 5210'});
        }
    }
    onSubmit = async (e) => {
        e.preventDefault();
        if(this.validarFormulario()){
            if(this.state.editing){
                if(this.state.operador1Anterior !== this.state.operador1){
                    if(this.state.operador1Anterior !== ""){
                        await axios.put(ip + 'api/operadores/desasignado/' + this.state.operador1Anterior, this.state.operador1Anterior);
                        if(this.state.operador1 !== ""){
                            const res1 = await axios.get(ip + 'api/operadores/' + this.state.operador1);
                            const newHistorial = {descripcion: 'Se ha cambiado el operador 1 ' + this.state.nombreOperador1Anterior + ' por ' + res1.data.nombre };
                            await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                        } else {
                            const newHistorial = {descripcion: 'Se ha desasignado el operador 1 ' + this.state.nombreOperador1Anterior };
                            await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                        }
                    } else{
                        const res1 = await axios.get(ip + 'api/operadores/' + this.state.operador1);
                        const newHistorial = {descripcion: 'Se ha asignado el operador 1 ' + res1.data.nombre };
                        await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                    }
                    if(this.state.operador1 !== ""){
                        await axios.put(ip + 'api/operadores/asignado/' + this.state.operador1, this.state.operador1);
                    }
                }
                if(this.state.operador2Anterior !== this.state.operador2){
                    if(this.state.operador2Anterior !== ""){
                        await axios.put(ip + 'api/operadores/desasignado/' + this.state.operador2Anterior, this.state.operador2Anterior);
                        if(this.state.operador2 !== ""){
                            const res1 = await axios.get(ip + 'api/operadores/' + this.state.operador2);
                            const newHistorial = {descripcion: 'Se ha cambiado el operador 2 ' + this.state.nombreOperador2Anterior + ' por ' + res1.data.nombre };
                            await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                        } else {
                            const newHistorial = {descripcion: 'Se ha desasignado el operador 2 ' + this.state.nombreOperador2Anterior };
                            await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                        }
                    } else{
                        const res1 = await axios.get(ip + 'api/operadores/' + this.state.operador2);
                        const newHistorial = {descripcion: 'Se ha asignado el operador 2 ' + res1.data.nombre };
                        await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                    }
                    if(this.state.operador2 !== ""){
                        await axios.put(ip + 'api/operadores/asignado/' + this.state.operador2, this.state.operador2);
                    }
                }
                if(this.state.estado !== this.state.estadoAnterior){
                    if(this.state.estado === 'Accidente'){
                        const fecha = this.state.fechaAccidente.getDate() + "-" +  (this.state.fechaAccidente.getMonth() + 1) + "-" + this.state.fechaAccidente.getFullYear();
                        const hora = this.state.fechaAccidente.getHours() + ":" + this.state.fechaAccidente.getMinutes();
                        const newHistorial = {descripcion: 'La unidad tuvo un accidente el ' + fecha + ' en ' + this.state.ubicacionAccidente + ' a las ' + hora};
                        await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                    } else{
                        if(this.state.estadoAnterior === 'Accidente'){
                            this.setState({
                                fechaAccidente: "",
                                ubicacionAccidente: ""
                            });
                        }
                        const newHistorial = {descripcion: 'Se ha cambiado el estado de ' + this.state.estadoAnterior + ' a ' + this.state.estado };
                        await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                    }
                } else{
                    if(this.state.estado === 'Accidente'){
                        const fecha = this.state.fechaAccidente.getDate() + "-" +  (this.state.fechaAccidente.getMonth() + 1) + "-" + this.state.fechaAccidente.getFullYear();
                        const hora = this.state.fechaAccidente.getHours() + ":" + this.state.fechaAccidente.getMinutes();
                        const newHistorial = {descripcion: 'La unidad tuvo un accidente el ' + fecha + ' en ' + this.state.ubicacionAccidente + ' a las ' + hora};
                        await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                    }
                }
                if(this.state.rol !== this.state.rolAnterior){
                    const res = await axios.get(ip + 'api/roles/' + this.state.rolAnterior);
                    const res1 = await axios.get(ip + 'api/roles/' + this.state.rol);
                    const newHistorial = {descripcion: 'Se ha cambiado el rol del ' + res.data.nombre + ' al ' + res1.data.nombre};
                    await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                }
                if(this.state.base !== this.state.baseAnterior){
                    const newBase = {descripcion: 'Se ha cambiado la base de ' + this.state.baseAnterior + ' por ' + this.state.base};
                    await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newBase);
                }
                const newUnidad = {
                    numUnidad: this.state.numUnidad,
                    estado: this.state.estado,
                    operador1: this.state.operador1,
                    operador2: this.state.operador2,
                    rol: this.state.rol,
                    base: this.state.base,
                    fechaAccidente: this.state.fechaAccidente,
                    ubicacionAccidente: this.state.ubicacionAccidente
                }
                const respuesta = await axios.put(ip + 'api/unidades/' + this.state._id, newUnidad);
                M.toast({html: respuesta.data.message});
                window.location.href = "/unidades";
            } else{
                const newUnidad = {
                    numUnidad: this.state.numUnidad,
                    estado: this.state.estado,
                    operador1: this.state.operador1,
                    operador2: this.state.operador2,
                    rol: this.state.rol,
                    base: this.state.base,
                    fechaAccidente: this.state.fechaAccidente,
                    ubicacionAccidente: this.state.ubicacionAccidente
                }
                const respuesta = await axios.post(ip + 'api/unidades', newUnidad);
                if(respuesta.data.existe){
                    M.toast({html: respuesta.data.message});
                }else{
                    M.toast({html: respuesta.data.message});
                    if(this.state.operador1 !== ""){
                        await axios.put(ip + 'api/operadores/asignado/' + this.state.operador1, this.state.operador1);
                    }
                    if(this.state.operador2 !== ""){
                        await axios.put(ip + 'api/operadores/asignado/' + this.state.operador2, this.state.operador2);
                    }
                    window.location.href = "/unidades";
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
                                    Alta a unidades
                                </span>
                                {
                                    this.state.editing ? <div className="btn" onClick={() => this.deleteUnidad(this.state._id)}>Eliminar</div> : <p></p>
                                }
                                <form onSubmit={this.onSubmit}>
                                    <div className="input-field">
                                        {
                                            this.state.editing ? 
                                            <input id="numUnidad" onChange={this.onInputChange} name="numUnidad" type="text" value={this.state.numUnidad} disabled/> :
                                            <input id="numUnidad" onChange={this.onInputChange} name="numUnidad" type="text" value={this.state.numUnidad} />
                                        }
                                        <label htmlFor="numUnidad">Número de unidad</label>
                                    </div>
                                    <div className="input-field">
                                        <select className="browser-default" name="estado" onChange={this.onInputChange} value={this.state.estado} >
                                            <option value="" disabled defaultValue>Elige el estado de la unidad</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Taller">Taller</option>
                                            <option value="Guardia">Guardia</option>
                                            <option value="Accidente">Accidente</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                    {
                                        this.state.estado === 'Accidente' ? 
                                            <div className="input-field">
                                                <p className="label-fechaAccidente" >Fecha del accidente</p>
                                                <DatePicker 
                                                    selected={this.state.fechaAccidente}
                                                    onChange={this.onchangeDate}
                                                    className="fechaAccidente"
                                                    maxDate={new Date()}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="Hora del accidente"
                                                    id="fechaAccidente"
                                                    name="fechaAccidente"
                                                />
                                            </div> :
                                            null
                                    }
                                    {
                                        this.state.estado === 'Accidente' ? 
                                            <div className="input-field">
                                                <input id="ubicacionAccidente" onChange={this.onInputChange} name="ubicacionAccidente" type="text" value={this.state.ubicacionAccidente} />
                                                <label htmlFor="ubicacionAccidente">Ubicación del accidente</label>
                                            </div> :
                                            null
                                    }
                                    <div className="input-field">
                                        <select name="operador1" id="operador1" onChange={ this.seleccionaOperador } className="browser-default" value={this.state.operador1} >
                                            <option value="" disabled>Elige el operador 1</option>
                                            <option value="">Sin asignar</option>
                                            {
                                                this.state.operador1Anterior !== "" ? <option value={this.state.operador1Anterior}>{this.state.nombreOperador1Anterior}</option> : "" 
                                            }
                                            {
                                                this.state.operadores.map(operador => 
                                                    <option key={operador._id} value={operador._id}>
                                                        {operador.nombre}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <select name="operador2" id="operador2" onChange={this.seleccionaOperador} className="browser-default" value={this.state.operador2} >
                                            <option value="" disabled defaultValue>Elige el operador 2</option>
                                            <option value="">Sin asignar</option>
                                            {
                                                this.state.operador2Anterior !== "" ? <option value={this.state.operador2Anterior}>{this.state.nombreOperador2Anterior}</option> : "" 
                                            }
                                            {
                                                this.state.operadores.map(operador => 
                                                    <option key={operador._id} value={operador._id}>
                                                        {operador.nombre}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <select name="rol" id="rol" onChange={this.onInputChange} className="browser-default" value={this.state.rol} >
                                            <option value="" disabled defaultValue>Elige el rol</option>
                                            {
                                                this.state.roles.map(rol =>
                                                    <option key={rol._id} value={rol._id}>
                                                        {rol.nombre}
                                                    </option>    
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <select className="browser-default" name="base" onChange={this.onInputChange} value={this.state.base} >
                                            <option value="" disabled defaultValue>Elige la base de la unidad</option>
                                            <option value="CJS">CJS</option>
                                            <option value="MTY">MTY</option>
                                            <option value="TRC">TRC</option>
                                            <option value="CMX">CMX</option>
                                        </select>
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
export default connect(mapStateToProps, null)(CreateUnidad);
