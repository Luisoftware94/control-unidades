import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

export class Login extends Component {
    state = {
        correo: '',
        contrasena: '',
        msg: null
    };
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };
    componentDidUpdate(prevProps){
        const { error } = this.props;
        if(error !== prevProps.error){
            // checamos el error de registro
            if(error.id === 'LOGIN_FAIL'){
                this.setState({msg: error.msg.msg});
            } else{
                this.setState({msg: null});    
            }
        }
        if(this.props.isAuthenticated){
            this.props.history.push('/');
        }
    }
    onInputChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    onSubmit = e => {
        e.preventDefault();
        
        const { correo, contrasena } = this.state;

        const user = {
            correo,
            contrasena
        }
        // intento de login
        this.props.login(user);
    };
    
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title center">
                                    Inicio de sesión
                                </span>
                                {
                                    this.state.msg ?
                                        <div className="msg-login">
                                            <p>{this.state.msg}</p>
                                        </div> : null
                                }
                                <form onSubmit={this.onSubmit}>
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
    error: state.error
});
export default connect(
    mapStateToProps,
    { login, clearErrors }
)(Login);