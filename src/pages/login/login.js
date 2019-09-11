import React, {Component} from "react";
import PropTypes from 'prop-types';
import { Form,Icon, Input,Button,message } from 'antd';

import uuid from "uuid";

import "./login.css"
import {combineReducers, createStore} from "redux";
import {loginState} from "./reducer";
import {VersionAction,
    WsVersionAction,
    WsAddressAction,
    LoggingInAction,
    HandleLoginSuccessAction} from "./actions";

import {GetUserInfo} from "../../data/common";

const loginCheck =(user="",pwd="") => {
    return GetUserInfo().filter((item)=>{
        return item.u===user && item.p === pwd;
    }).length > 0
};

const defaultState = {
    loginState:{
        loggingIn:false,
        version:"",
        wsVersion:"",
        wsAddress:"",
        handleLoginSuccess:f=>f,
    },
};

const store = createStore(
    combineReducers({loginState}),
    defaultState
);

export class Login extends Component {

    static propTypes = {
        version:PropTypes.string,
        wsVersion:PropTypes.string,
        wsAddress:PropTypes.string,
        handleLoginSuccess:PropTypes.func,
    };

    static defaultProps = {
        version:"",
        wsVersion:"",
        wsAddress:"",
        handleLoginSuccess:f=>f,
    };

    componentDidMount() {
        this.unsubscribe = store.subscribe(
            ()=>this.forceUpdate()
        );
        store.dispatch(VersionAction(this.props.version));
        store.dispatch(WsVersionAction(this.props.wsVersion));
        store.dispatch(WsAddressAction(this.props.wsAddress));
        store.dispatch(HandleLoginSuccessAction(this.props.handleLoginSuccess));
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.version!==prevProps.version){
            store.dispatch(VersionAction(this.props.version));
        }
        if(this.props.wsVersion!==prevProps.wsVersion){
            store.dispatch(WsVersionAction(this.props.wsVersion));
        }
        if(this.props.wsAddress!==prevProps.wsAddress){
            store.dispatch(WsAddressAction(this.props.wsAddress));
        }
        if(this.props.handleLoginSuccess!==prevProps.handleLoginSuccess){
            store.dispatch(HandleLoginSuccessAction(this.props.handleLoginSuccess));
        }
    }

    render() {
        return (
            <div>
                <LoginForm />
                <div className={"VersionInfo"}>
                    <span>{store.getState().loginState.version}</span>
                    <br/>
                    <span>{store.getState().loginState.wsVersion}</span>
                </div>
            </div>
        )
    }
}

const newSessionId = () => {
    return uuid.v4().replace(/-/g,"").toUpperCase();
};

class LoginFormR extends React.Component {
    constructor(props){
        super(props);
        this.initFocus.bind(this);
    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            store.dispatch(LoggingInAction(true));
            if (!err) {
                if(loginCheck(values["username"],values["password"])){
                    store.getState().loginState.handleLoginSuccess(newSessionId());
                } else {
                    this.initFocus(1);
                    message.error("登录名不存在或密码错误");
                }
            } else {
                if(values["username"]===undefined||values["username"]===""){
                    this.initFocus(0);
                } else {
                    this.initFocus(1)
                }
            }
            store.dispatch(LoggingInAction(false));
        });
    };

    componentDidMount() {
        this.initFocus();
    }

    initFocus = (c=0) => {
        if(c===0){
            document.getElementById("normal_login_username").focus();
        } else {
            document.getElementById("normal_login_password").focus();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={"login-form"}>
                <h1>Login in</h1>
                <Form style={{marginTop:'50px'}} onSubmit={this.handleSubmit}>
                     <Form.Item>
                         {getFieldDecorator('username', {
                             rules: [{ required: true, message: 'Please input your username!' }],
                         })(
                             <Input size={"large"}
                                 prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                 placeholder="Username"
                             />,
                         )}
                     </Form.Item>
                    <Form.Item>
                          {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                         <Input size={"large"}
                             prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                             type="password"
                             placeholder="Password"
                         />,
                     )}
                    </Form.Item>
                    <Form.Item>
                        <Button
                            loading={store.getState().loginState.loggingIn}
                            type="primary"
                            style={{width:'100%',marginTop:'30px'}}
                            size={"large"}
                            htmlType="submit"
                            className="login-form-button">
                            {store.getState().loginState.loggingIn?"Logging in":"Log in"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const LoginForm = Form.create({ name: 'normal_login' })(LoginFormR);
