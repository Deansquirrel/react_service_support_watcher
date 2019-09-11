import React, { Component } from 'react';
import PropTypes from "prop-types";
import {ConfigProvider,message} from "antd";

import zhCN from 'antd/lib/locale-provider/zh_CN';

import './App.css';

import moment from "moment";
import 'moment/locale/zh-cn';
import {Manager} from "./pages/manager/manager";
import {combineReducers, createStore} from "redux";
import {GetWsAddress} from "./pages/common";
import {Login} from "./pages/login/login";
import sysConfig from "./config";
import {GetWsVersionInfo} from "./pages/DataInterface/common";
import {Test} from "./pages/test/test";


moment.locale('zh-cn');
message.config({
    top:60,
});

class App extends Component {
    static propTypes = {
        wsAddress:PropTypes.string,
    };

    static defaultProps = {
        wsAddress:"",
    };


    componentDidMount() {
        this.unsubscribe = store.subscribe(
            ()=>this.forceUpdate()
        );
        if(store.getState().appState.version!==sysConfig.version){
            store.dispatch(VersionAction(sysConfig.version));
        }
        GetWsAddress(
            (address)=>store.dispatch(WsAddressAction(address)),
            (err)=>console.warn(err)
        ).then();
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(store.getState().appState.version!==sysConfig.version){
            store.dispatch(VersionAction(sysConfig.version));
        }
    }

    render() {
        return (
            <ConfigProvider  locale={zhCN}>
                <PageContent />
            </ConfigProvider>
        );
  }
}

export default App;


const PageContent = () => {
    switch (store.getState().appState.currPage) {
        case "manager":
            return <Manager
                version={store.getState().appState.version}
                wsVersion={store.getState().appState.wsVersion}
                wsAddress={store.getState().appState.wsAddress}
                handleLogout={()=>handleLogout()}
            />;
        case "test":
            return <Test />;
        default:
            return <Login
                version={store.getState().appState.version}
                wsVersion={store.getState().appState.wsVersion}
                wsAddress={store.getState().appState.wsAddress}
                handleLoginSuccess={(cId="")=>handleLogin(cId)}/>;
    }
};

const handleLogin = (cId="") => {
    store.dispatch(CIdAction(cId));
    if(cId !== ""){
        store.dispatch(CurrPageAction("manager"));
    }
};

const handleLogout = () => {
    store.dispatch(CIdAction(""));
    store.dispatch(CurrPageAction("login"));
};


const C = {
    Version:"VERSION",
    WsVersion:"WS_VERSION",
    WsAddress:"WS_ADDRESS",
    CId:"C_ID",
    CurrPage:"CURR_PAGE",
};

const VersionAction = (version="") => (
    {
        type:C.Version,
        version:version
    }
);

const WsVersionAction = (wsVersion="") => (
    {
        type:C.WsVersion,
        wsVersion:wsVersion
    }
);

const WsAddressAction = (wsAddress="") => (
    {
        type:C.WsAddress,
        wsAddress:wsAddress
    }
);

const CIdAction = (cId="") => (
    {
        type:C.CId,
        cId:cId,
    }
);

const CurrPageAction = (page="") => (
    {
        type:C.CurrPage,
        currPage:page,
    }
);

const appState = (state={},action={}) => {
    switch (action.type) {
        case C.Version:
            return {
                ...state,
                version:action.version,
            };
        case C.WsVersion:
            return {
                ...state,
                wsVersion:action.wsVersion,
            };
        case C.WsAddress:
            if(state.wsAddress!==action.wsAddress){
                GetWsVersionInfo(
                    action.wsAddress,
                    (wsVersion)=>store.dispatch(WsVersionAction(wsVersion)),
                    (err)=>console.log(err)
                );
            }
            return {
                ...state,
                wsAddress: action.wsAddress
            };
        case C.CId:
            return {
                ...state,
                cId:action.cId,
            };
        case C.CurrPage:
            return {
                ...state,
                currPage:action.currPage
            };
        default:
            return state;
    }
};

const defaultState = {
    appState:{
        version:"",
        wsVersion:"",
        wsAddress:"",
        currPage:"manager",
        cId:"",
    },
};

const store = createStore(
    combineReducers({appState}),
    defaultState
);
