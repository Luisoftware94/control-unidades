import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

export class CreateUser extends Component {
    state = {
        modal: false,
        nombre: '',
        correo: '',
        contrasena: '',
        repContrasena: '',
        rol: '',
        msg: null
    };
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired
    };
    requireAuth(auth){
        if(!auth){
            this.props.history.push('/iniciarsesion');
        }
    }
    componentDidUpdate(prevProps){
        const { error } = this.props;
        if(error !== prevProps.error){
            // checamos el error de registro
            if(error.id === 'REGISTER_FAIL'){
                this.setState({msg: error.msg.msg});
                console.log(error.msg.msg);
                
            } else{
                this.setState({msg: null});
            }
        }
        if(this.state.msg){
            M.toast({html: this.state.msg});
        }
    }
    componentDidMount(){
        this.requireAuth(this.props.auth.token);
    }
    onInputChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    onSubmit = e => {
        e.preventDefault();
        const { nombre, correo, contrasena, rol } = this.state;
        //validamos el formulario        
        if(this.validarForm()){
            // crear objeto user
            const newUser = {
                nombre,
                correo, 
                contrasena,
                rol
            };
            // intentando registrar
            this.props.register(newUser);
        }
        window.location.href = "/";
    };
    validarForm(){
        // eslint-disable-next-line
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(this.state.nombre !== ''){
            if(regex.test(this.state.correo)) {
                if(this.state.contrasena === this.state.repContrasena){
                    if(this.state.rol !== ''){
                        return true;
                    } else{
                        return false;
                    }
                } else{
                    M.toast({html: 'Verifique la contraseña, no coincide en ambos campos'});
                }
            } else{
                M.toast({html: 'Introduzca una dirección de correo válida'});
            }
        } else {
            M.toast({html: 'Debe introducir el nombre'});
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
                                    Alta a usuarios
                                </span>
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
                                        <input 
                                            id="correo" 
                                            name="correo" 
                                            onChange={this.onInputChange} 
                                            type="text" 
                                            value={this.state.correo}
                                        />
                                        <label htmlFor="nombre">Correo</label>
                                    </div>
                                    <div className="input-field">
                                        <input 
                                            id="contrasena" 
                                            name="contrasena" 
                                            onChange={this.onInputChange} 
                                            type="password" 
                                            value={this.state.contrasena}
                                        />
                                        <label htmlFor="nombre">Contraseña</label>
                                    </div>
                                    <div className="input-field">
                                        <input 
                                            id="repContrasena" 
                                            name="repContrasena" 
                                            onChange={this.onInputChange} 
                                            type="password" 
                                            value={this.state.repContrasena}
                                        />
                                        <label htmlFor="nombre">Repita la contraseña</label>
                                    </div>
                                    <div className="input-field">
                                        <select className="browser-default" name="rol" onChange={this.onInputChange} value={this.state.rol}>
                                            <option value="" disabled>Elige el rol del usuario</option>
                                            <option value="administrador">Administrador</option>
                                            <option value="inspector">Inspector</option>
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
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth,
    error: state.error
});
export default connect(
    mapStateToProps,
    { register, clearErrors }
)(CreateUser);