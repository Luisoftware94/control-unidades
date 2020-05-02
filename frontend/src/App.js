import React from 'react'
import { Component } from 'react';
import { Provider } from 'react-redux';
import store from "./store";
import './App.css'
import 'materialize-css/dist/css/materialize.min.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { loadUser } from './actions/authActions';


// importamos los components
import Navbar from './components/Navbar';
import Principal from './components/Principal';
import Roles from './components/Roles';
import Unidades from './components/Unidades';
import Operadores from './components/Operadores';
import CreateOperador from './components/CreateOperador';
import CreateUnidad from './components/CreateUnidad';
import CreateRol from './components/CreateRol';
import HistorialUnidad from './components/HistorialUnidad';
import DetalleUnidad from './components/DetalleUnidad';
import DetalleOperador from './components/DetalleOperador';
import CreateUser from './components/CreateUser';
import Login from './components/Login';


export default class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render(){
    return (
      <Provider store={store}>
        <Router>
          <Navbar/>
          <div className="container">
            <Route path="/" exact component={Principal} />
            <Route path="/roles" component={Roles} />
            <Route path="/unidades" component={Unidades} />
            <Route path="/operadores" component={Operadores} />
            <Route path="/crearoperador" component={CreateOperador} />
            <Route path="/editaroperador/:id" component={CreateOperador} />
            <Route path="/crearunidad" component={CreateUnidad} />
            <Route path="/editarunidad/:id" component={CreateUnidad} />
            <Route path="/crearrol" component={CreateRol} />
            <Route path="/editarrol/:id" component={CreateRol} />
            <Route path="/historialunidad/:unidad" component={HistorialUnidad} />
            <Route path="/detalleunidad/:id" component={DetalleUnidad} />
            <Route path="/detalleoperador/:id" component={DetalleOperador} />
            <Route path="/crearusuario" component={CreateUser} />
            <Route path="/iniciarsesion" component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}
