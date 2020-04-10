import React, { Component } from 'react';
import M from 'materialize-css';
import axios from 'axios';
const ip = "http://localhost:4000/"

export default class CreateUnidad extends Component {
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
        editing: false,
        _id: "",
        indexOperador1Anterior: 0,
        indexOperador2Anterior: 0,
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
                editing: true,
                _id: this.props.match.params.id
            });
            const res1 = await axios.get(ip + 'api/operadores/' + this.state.operador1Anterior);
            const res2 = await axios.get(ip + 'api/operadores/' + this.state.operador2Anterior);
            this.setState({
                nombreOperador1Anterior: res1.data.nombre,
                nombreOperador2Anterior: res2.data.nombre
            });
            this.actualizarInputs();
        }
    }
    actualizarInputs(){
        M.updateTextFields();
    }
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
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
                return true;
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
            const newUnidad = {
                numUnidad: this.state.numUnidad,
                estado: this.state.estado,
                operador1: this.state.operador1,
                operador2: this.state.operador2,
                rol: this.state.rol
            }
            if(this.state.editing){
                const respuesta = await axios.put(ip + 'api/unidades/' + this.state._id, newUnidad);
                M.toast({html: respuesta.data.message});
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
                    const newHistorial = {descripcion: 'Se ha cambiado el estado de ' + this.state.estadoAnterior + ' a ' + this.state.estado };
                    await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                }
                if(this.state.rol !== this.state.rolAnterior){
                    const res = await axios.get(ip + 'api/roles/' + this.state.rolAnterior);
                    const res1 = await axios.get(ip + 'api/roles/' + this.state.rol);
                    const newHistorial = {descripcion: 'Se ha cambiado el rol del ' + res.data.nombre + ' al ' + res1.data.nombre}
                    await axios.post(ip + 'api/historialunidades/' + this.state.numUnidad, newHistorial);
                }
                window.location.href = "/unidades";
            } else{
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
                                        </select>
                                    </div>
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
