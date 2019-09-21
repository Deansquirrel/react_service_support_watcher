import React,{Component} from 'react';
import {Col, Row,Table,message} from "antd";

import "../common.css"
import "./welcome.css"
import {combineReducers, createStore} from "redux";
import {welcomeState} from "./reducer";

import {HeartbeatDataAction,WsAddressAction} from "./actions";
import PropTypes from "prop-types";
import {GetHeartbeatErrData} from "../DataInterface/common";

const defaultState = {
    welcomeState:{
        wsAddress:"",
        heartbeatData:[]
    },
};

const store = createStore(
    combineReducers({welcomeState}),
    defaultState
);

export class Welcome extends Component {
    static propTypes = {
        wsAddress:PropTypes.string,
    };

    static defaultProps = {
        wsAddress:"",
    };


    componentDidMount() {
        this.unsubscribe = store.subscribe(
            () => this.forceUpdate()
        );
        setStoreDefault();
        store.dispatch(WsAddressAction(this.props.wsAddress));

        refreshHeartbeatErrData();
        this.refershHeartbeatErrDataJob = setInterval(refreshHeartbeatErrData,60000);
    }

    componentWillUnmount() {
        this.unsubscribe();
        clearInterval(this.refershHeartbeatErrDataJob);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.wsAddress!==prevProps.wsAddress){
            store.dispatch(WsAddressAction(this.props.wsAddress));
            refreshHeartbeatErrData();
        }
    }

    render() {
        return (
            <div className={"ContentMargin"} style={{height:"100%",width:"100%"}}>
                <div style={{marginBottom:"32px"}}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <HeartBeatErr />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

const setStoreDefault = () => {
    store.dispatch(WsAddressAction(defaultState.welcomeState.wsAddress));
    store.dispatch(HeartbeatDataAction(defaultState.welcomeState.heartbeatData));
};

const refreshHeartbeatErrData = () => {
    if(store.getState().welcomeState.wsAddress !== ""){
        GetHeartbeatErrData(
            store.getState().welcomeState.wsAddress,
            "Z5MdDataTrans|Z9MdDataTransV2",
            (heartbeatData)=>store.dispatch(HeartbeatDataAction(heartbeatData)),
            (errMsg)=>message.error(errMsg)
        )
    }
};

const HeartBeatErr = () => {
    const columns = [
        {
            title:"Type",
            dataIndex:"type",
            key:"type"
        },
        {
            title:"count",
            dataIndex:"count",
        }
    ];
    const d = store.getState().welcomeState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("count") && item.count > 0
    });
    let t = 0;
    d.map((item)=>{
        if(item.hasOwnProperty("count")){
            t = t + item.count;
        }
        return item;
    });
    return (
        <div style={{background:"white",padding:'24px'}}>
            <h3 style={{color:t>0?"#ff0000":"#000000"}}>心跳异常({t})</h3>
            <Table
                style={{marginTop:"24px"}}
                rowKey={"type"}
                showHeader={false}
                pagination={false}
                bordered={false}
                columns={columns}
                dataSource={d}
                size="small"
            />
        </div>
    )
};
