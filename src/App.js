import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProductLine from './components/ProductLine';
import UploadFile from './components/UploadFile'
import Header from './components/Header';
import './App.css';
import {showProduct, googleAuthEvent, logout} from './actions/productActions';
import {conf} from './helpers/googleapi/gapi_conf';

const gapi = require("./helpers/googleapi/gapi");

class App extends Component {

    constructor(props) {
        super(props);
        this.initClient = this.initClient.bind(this);
        gapi.load('client:auth2', this.initClient); // it gets the auth2 function

    }

    initClient() {
        gapi.client.init(conf).then(() => {
            this.updateReduxWithGoogleAuthInfo()
            gapi.auth2.getAuthInstance().isSignedIn.listen(() => this.updateReduxWithGoogleAuthInfo())
        });
    }

    updateReduxWithGoogleAuthInfo() {
        this.props.googleAuthEvent(gapi.auth2.getAuthInstance().isSignedIn.get());
    }

    render() {
        return (
            <div className="App">
                { !this.props.isAuthenticated &&
                <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Log in</button> }
                { this.props.isAuthenticated && <button onClick={() => this.props.logout()}>Log out</button> }
                <div className="container">
                    <Header/>
                    { this.props.products.map(x => <ProductLine key={x.id} onClick={() => this.props.getFiles()}
                                                                product={x}/>) }
                </div>
                <div>
                    <UploadFile/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.products,
        isAuthenticated: state.googleauth.isAuthenticated,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        googleAuthEvent: (message) => dispatch(googleAuthEvent(message)),
        getFiles: () => dispatch({type: "GET_FILES"}),
        logout: () => dispatch(logout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);