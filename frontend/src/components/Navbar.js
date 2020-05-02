import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Clock from './Clock';
import Logout from './Logout';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Navbar extends Component {
  static propTypes = {
      auth: PropTypes.object.isRequired
  };
  componentDidMount(){
    this.tabSelected();
  }
    componentDidUpdate(){
      this.tabSelected();
    }
    tabSelected(){
        const pathName = window.location.pathname;
        document.getElementById('principal').classList.remove('activo');
        document.getElementById('roles').classList.remove('activo');
        document.getElementById('unidades').classList.remove('activo');
        document.getElementById('operadores').classList.remove('activo');
        switch(pathName){
          case '/':
            document.getElementById('principal').classList.add('activo');
            break;
          case '/roles':
            document.getElementById('roles').classList.add('activo');
            break;
          case '/unidades':
            document.getElementById('unidades').classList.add('activo');
            break;
          case '/operadores':
            document.getElementById('operadores').classList.add('activo');
            break;
          default:
            break;
        }
    }
    
    render() {
        return (
        <nav className="nav-extended">
          <div className="nav-wrapper">
            <div className="brand-logo"><img src="./logoblanco.webp" className="icono-odm" onClick={() => this.tabSelected()} alt="logo-omnibus"/></div>
            <Clock/>
          </div>
          <div className="nav-content">
            <ul className="tabs tabs-transparent">
              <li className="tab activo" id="principal" onClick={() => this.tabSelected()}><Link className="active" to="/">Principal</Link></li>
              <li className="tab" id="roles" onClick={() => this.tabSelected()}><Link className="" to="/roles">Roles</Link></li>
              <li className="tab" id="unidades" onClick={() => this.tabSelected()}><Link className="" to="/unidades">Unidades</Link></li>
              <li className="tab" id="operadores" onClick={() => this.tabSelected()}><Link className="" to="/operadores">Operadores</Link></li>
              {
                this.props.auth.isAuthenticated ?
                  <li className="tab">
                    <Logout />
                  </li> : null
              }
            </ul>
          </div>
        </nav>
        )
    }
}
const mapStateToProps = state => ({
  auth: state.auth  
});
export default connect(mapStateToProps, null)(Navbar);