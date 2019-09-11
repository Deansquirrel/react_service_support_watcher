import React, {Component} from "react";
// import {Button,Divider,Spin} from 'antd';
import {Empty,Menu,Icon,Dropdown,Button} from 'antd';
import PropTypes from 'prop-types';
import {combineReducers, createStore} from "redux";
import {heartBeatMonitorState} from "./reducer";
import {CustomerAction, CustomerListAction, LoadingAction, TypeAction} from "./actions";

const defaultState = {
    heartBeatMonitorState:{
        type:"",
        loading:false,
        customer:"",
        customerList:[],
    },
};

const store = createStore(
    combineReducers({heartBeatMonitorState}),
    defaultState
);

const setStoreDefault = () => {
    store.dispatch(LoadingAction(true));
    store.dispatch(TypeAction(defaultState.heartBeatMonitorState.type));
    store.dispatch(LoadingAction(false));
};

const refreshCustomerList = (customerList=[]) => {
    store.dispatch(CustomerListAction(customerList));
    if(customerList.length > 0){
        store.dispatch(CustomerAction(customerList[0]));
    } else {
        store.dispatch(CustomerAction(""));
    }
};

export class HeartBeatMonitor extends Component {
    static propTypes = {
        type:PropTypes.string,
    };

    static defaultProps = {
        type:"",
    };

    componentDidMount() {
        this.unsubscribe = store.subscribe(
            () => this.forceUpdate()
        );
        setStoreDefault();

        store.dispatch(TypeAction(this.props.type));
        refreshCustomerList(["aaa","bbbbbbbb","cccccccccc"]);
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.type!==prevProps.type){
            setStoreDefault();
            store.dispatch(TypeAction(this.props.type));
        }
    }

    render() {
        return (
            <div>
                <h1>{store.getState().heartBeatMonitorState.type}</h1>
                <div style={{height:'100%'}}>
                    {store.getState().heartBeatMonitorState.customerList.length === 0 && <Empty />}
                    {store.getState().heartBeatMonitorState.customerList.length !== 0 && <Detail />}
                </div>
            </div>
        )
    }
}

const CustomerList = () => {
    if(store.getState().heartBeatMonitorState.customerList.length===0){
        return <div>&nbsp;</div>
    } else {
        const onClick = ({key}) => {
            store.dispatch(CustomerAction(key));
        };

        const menu = (
            <Menu onClick={onClick}>
                {store.getState().heartBeatMonitorState.customerList.map((item)=>
                    <Menu.Item key={item}>{item}</Menu.Item>
                )}
            </Menu>
        );
        return (
            <Dropdown overlay={menu}>
                {/*<a className="ant-dropdown-link" href={"#"}>*/}
                {/*    {store.getState().heartBeatMonitorState.customer} <Icon type="down" />*/}
                {/*</a>*/}
                <Button type="link">{store.getState().heartBeatMonitorState.customer} <Icon type="down" /></Button>
            </Dropdown>
        )
    }
};

const Detail = () => {
    return (
        <div>
            <span>T</span>
            <CustomerList />
        </div>
    )
};
