import React,{Component} from 'react';
import {Col, Row,Table} from "antd";

import "../common.css"
import "./welcome.css"
import {combineReducers, createStore} from "redux";
import {welcomeState} from "./reducer";

import testD from "./data";
import {HeartbeatDataAction} from "./actions";

const defaultState = {
    welcomeState:{
        heartbeatData:[]
    },
};

const store = createStore(
    combineReducers({welcomeState}),
    defaultState
);

export class Welcome extends Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(
            () => this.forceUpdate()
        );
        setStoreDefault();
        store.dispatch(HeartbeatDataAction(testD.heartbeatData));
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        return (
            <div className={"ContentMargin"} style={{height:"100%"}}>
                <div style={{marginBottom:"32px"}}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <HeartBeatErr />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

const setStoreDefault = () => {
    store.dispatch(HeartbeatDataAction(defaultState.welcomeState.heartbeatData));
};

const HeartBeatErr = () => {
    const columns = [
        {
            title:"customer",
            dataIndex:"name",
            key:"name"
        },
        {
            title:"count",
            dataIndex:"count",
        }
    ];
    const d = GetHeartBeatErrData();
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
                rowKey={"name"}
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

const GetHeartBeatErrData = () => {
    return store.getState().welcomeState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("count") && item.count > 0
    })
};
