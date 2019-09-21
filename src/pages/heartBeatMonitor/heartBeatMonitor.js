import React, {Component} from "react";
// import {Button,Divider,Spin} from 'antd';
import {Row, Col, Tabs, Table, Statistic, message} from 'antd';
import PropTypes from 'prop-types';
import {combineReducers, createStore} from "redux";
import {heartBeatMonitorState} from "./reducer";
import {CustomerAction, HeartBeatDataAction, WsAddressAction, TypeAction, LoadingAction} from "./actions";

import "../common.css"
import "./heartBeatMonitor.css"
import moment from "moment";

import {DelHeartbeat, GetHeartbeatMonitorData} from "../DataInterface/common";
import {jsonSort} from "./common";

const defaultState = {
    heartBeatMonitorState:{
        type:"",
        wsAddress:"",
        loading:false,
        customer:"aa",
        heartbeatData:[],
        lastRefresh:new moment(),
    },
};

const store = createStore(
    combineReducers({heartBeatMonitorState}),
    defaultState
);

const setStoreDefault = () => {
    // store.dispatch(LoadingAction(true));
    store.dispatch(TypeAction(defaultState.heartBeatMonitorState.type));
    store.dispatch(WsAddressAction(defaultState.heartBeatMonitorState.wsAddress));
    store.dispatch(CustomerAction(defaultState.heartBeatMonitorState.customer));
    store.dispatch(HeartBeatDataAction(defaultState.heartBeatMonitorState.heartbeatData));
    // store.dispatch(LoadingAction(false));
};

const setStoreProps = (props={}) => {
    if (props.hasOwnProperty("wsAddress")) {
        store.dispatch(WsAddressAction(props.wsAddress));
    }
    if (props.hasOwnProperty("type")){
        store.dispatch(TypeAction(props.type));
    }
};

const GetCustomerList = () => {
    const data = store.getState().heartBeatMonitorState.heartbeatData;
    let rList = [];
    // eslint-disable-next-line
    {data.map((item)=>{
        if(item.hasOwnProperty("coUserAb")&&rList.indexOf(item.coUserAb)<0){
            rList.push(item.coUserAb);
        }
        return item;
    })}
    return rList;
};

const refreshHeartbeatMonitorData = () => {
    if(store.getState().heartBeatMonitorState.wsAddress !== ""){
        GetHeartbeatMonitorData(
            store.getState().heartBeatMonitorState.wsAddress,
            store.getState().heartBeatMonitorState.type,
            // (heartbeatData)=>refreshHeartbeatData(heartbeatData),
            (data)=>refreshHeartbeatData(data),
            (errMsg)=>message.error(errMsg)
        )
    }
};

const refreshHeartbeatData = (d=[]) => {
    d = jsonSort(d,"coId");
    store.dispatch(HeartBeatDataAction(d));
    const customerList = GetCustomerList();

    if(customerList.length > 0){
        if(store.getState().heartBeatMonitorState.customer===defaultState.heartBeatMonitorState.customer){
            store.dispatch(CustomerAction(customerList[0]));
        } else {
            if(customerList.indexOf(store.getState().heartBeatMonitorState.customer)<0){
                store.dispatch(CustomerAction(customerList[0]));
            }
        }
    } else {
        if(store.getState().heartBeatMonitorState.customer!==defaultState.heartBeatMonitorState.customer){
            store.dispatch(CustomerAction(defaultState.heartBeatMonitorState.customer));
        }
    }
    // if(store.getState().heartBeatMonitorState.customer===defaultState.heartBeatMonitorState.customer
    //     && customerList.length > 0){
    //     store.dispatch(CustomerAction(customerList[0]));
    // } else {
    //     store.dispatch(CustomerAction(defaultState.heartBeatMonitorState.customer));
    // }
};

const delHeartbeat =(clientId="") => {
    store.dispatch(LoadingAction(true));
    DelHeartbeat(store.getState().heartBeatMonitorState.wsAddress,
        clientId,
        ()=>refreshHeartbeatMonitorData(),
        (msg)=>message.error(msg),
        ()=>store.dispatch(LoadingAction(false))
        )
};

export class HeartBeatMonitor extends Component {
    static propTypes = {
        type:PropTypes.string,
        wsAddress:PropTypes.string,
    };

    static defaultProps = {
        type:"",
        wsAddress:"",
    };

    componentDidMount() {
        this.unsubscribe = store.subscribe(
            () => this.forceUpdate()
        );
        setStoreDefault();
        setStoreProps(this.props);
        refreshHeartbeatMonitorData();
        this.refreshHeartbeatMonitorDataJob = setInterval(refreshHeartbeatMonitorData,60000);
    }

    componentWillUnmount() {
        this.unsubscribe();
        clearInterval(this.refreshHeartbeatMonitorDataJob);
        setStoreDefault();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props!==prevProps){
            setStoreDefault();
            setStoreProps(this.props);
            refreshHeartbeatMonitorData();
        }
    }

    render() {
        return (
            <div className={"ContentMargin"} style={{height:"100%"}}>
                <TotalInfo />
                <CustomerInfo />
            </div>
        )
    }
}

const TotalInfo = () => {
    return (
        <div style={{marginBottom:"32px"}}>
            <Row gutter={16}>
                <Col span={8}>
                    {/*<TotalInfoCard*/}
                    {/*    title={"客户"}*/}
                    {/*    tips={"接入的客户数量"}*/}
                    {/*    content={store.getState().heartBeatMonitorState.customerList.length}*/}
                    {/*/>*/}
                    <Statistic
                        className={"heartbeat_total_info_card"}
                        title="客户"
                        value={GetCustomerList().length}
                    />
                </Col>
                <Col span={8}>
                    {/*<TotalInfoCard*/}
                    {/*    title={"客户端"}*/}
                    {/*    tips={"接入的客户端数量"}*/}
                    {/*    content={store.getState().heartBeatMonitorState.heartbeatData.length}*/}
                    {/*/>*/}
                    <Statistic
                        className={"heartbeat_total_info_card"}
                        title="客户端"
                        value={store.getState().heartBeatMonitorState.heartbeatData.length}
                    />
                </Col>
                <Col span={8}>
                    {/*<TotalInfoCard*/}
                    {/*    title={"心跳异常"}*/}
                    {/*    tips={"心跳异常数量"}*/}
                    {/*    content={GetTotalEData().length}*/}
                    {/*    color={GetTotalEData().length > 0 ?"#ff0000":"#000000"}*/}
                    {/*/>*/}
                    <Statistic
                        className={"heartbeat_total_info_card"}
                        title="心跳异常"
                        value={GetTotalEData().length}
                        valueStyle={{ color: GetTotalEData().length>0?"#ff0000":"#000000" }}
                    />
                </Col>
            </Row>
        </div>
    )
};

// const TotalInfoCard = ({title="Card",content=0,tips="tips",color="#000000"}) => {
//     return (
//         <div className={"heartbeat_total_info_card"}>
//             <div className={"heartbeat_total_info_card_title"}>
//                 <span>{title}</span>
//                 <Tooltip className={"heartbeat_total_info_card_title_tips"} title={tips}>
//                     <Icon style={{marginTop:"4px"}} type="question-circle" />
//                 </Tooltip>
//             </div>
//             <div className={"heartbeat_total_info_card_content"} style={{color:color}}>
//                 <span>{content}</span>
//             </div>
//         </div>
//     );
// };

const { TabPane } = Tabs;
const CustomerInfo = () => {
    return (
        <div className={"heartbeat_customer_info"}>
            <Tabs size={"large"} onChange={(key)=>store.dispatch(CustomerAction(key))}>
                {/*{store.getState().heartBeatMonitorState.customerList.map((item)=>{*/}
                {/*    return (*/}
                {/*        <TabPane tab={item} key={item} />*/}
                {/*    )*/}
                {/*})}*/}
                {GetCustomerList().map((item)=>{
                    const l = GetEData(item).length;
                    const title = l>0?`${item}(${l})`:item;
                    return (
                        <TabPane tab={title} key={item} />
                    )
                })}
            </Tabs>
            <CustomerInfoDetail />
        </div>
    )
};

const GetNData = (customer="") => {
    // const c = store.getState().heartBeatMonitorState.customer;
    return store.getState().heartBeatMonitorState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("coUserAb")
            && item.coUserAb === customer
            && item.hasOwnProperty("isOffLine")
            && item.isOffLine === "false"
    });
};

const GetEData = (customer="") => {
    // const c = store.getState().heartBeatMonitorState.customer;
    return store.getState().heartBeatMonitorState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("coUserAb")
            && item.coUserAb === customer
            && item.hasOwnProperty("isOffLine")
            && item.isOffLine === "true"
    });
};

const GetTotalEData = () => {
    return store.getState().heartBeatMonitorState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("isOffLine")
            && item.isOffLine === "true"
    });
};

const CustomerInfoDetail = () => {
    const c = store.getState().heartBeatMonitorState.customer;
    return (
        <div className={"heartbeat_customer_info_detail"}>
            <span style={{float:'right',marginRight:'16px',marginTop:'8px'}}>
                最后刷新时间：{store.getState().heartBeatMonitorState.lastRefresh.format("YYYY-MM-DD HH:mm:ss")}
            </span>
            <DataPanel
                title={"异常心跳"}
                titleColor={GetEData(c).length>0?"#ff0000":"#000000"}
                data={GetEData(c)}
                del={true}
            />
            <DataPanel title={"正常心跳"} data={GetNData(c)} />
        </div>
    )
};

const TableColumns = [
    {
        title: 'ClientID',
        dataIndex: 'clientId',
        key: 'clientId',
    },
    {
        title: 'ClientVersion',
        dataIndex: 'clientVersion',
        key: 'clientVersion',
    },
    {
        title: '机构ID',
        dataIndex: 'coId',
        key: 'coId',
    },
    {
        title: '名称',
        dataIndex: 'coAb',
        key: 'coAb',
    },
    {
        title: '版本',
        dataIndex: 'svVer',
        key: 'svVer',
    },
    {
        title: '最后心跳时间',
        dataIndex: 'heartbeat',
        // key: 'heartbeat',
    }
];
const TableColumnsWithDel = [
    {
        title: 'ClientID',
        dataIndex: 'clientId',
        key: 'clientId',
    },
    {
        title: 'ClientVersion',
        dataIndex: 'clientVersion',
        key: 'clientVersion',
    },
    {
        title: '机构ID',
        dataIndex: 'coId',
        key: 'coId',
    },
    {
        title: '名称',
        dataIndex: 'coAb',
        key: 'coAb',
    },
    {
        title: '版本',
        dataIndex: 'svVer',
        key: 'svVer',
    },
    {
        title: '最后心跳时间',
        dataIndex: 'heartbeat',
        // key: 'heartbeat',
    },
    {
        title: "Action",
        dataIndex: '',
        // key: 'x',
        render: (d) => (
            <span onClick={() => {
                if(d.hasOwnProperty("clientId")){
                    delHeartbeat(d.clientId);
                }
            }} style={{cursor:"pointer",color:"#1890ff"}}>
                Delete
            </span>
        )
    }
];

const DataPanel = ({title="",titleColor="#000000",data=[],del=false}) => {
    return (
        <div style={{marginTop:'16px'}}>
            <h2 style={{marginLeft:'8px',color:titleColor}}>{title}({data.length})</h2>
            <Table
                rowKey={(r)=>{
                    let k = "";
                    if(r.hasOwnProperty("clientId")){
                        k = k + r.clientId
                    }
                    if(r.hasOwnProperty("coId")){
                        k = k + r.coId
                    }
                    return k;
                }}
                loading={store.getState().heartBeatMonitorState.loading}
                bordered
                pagination={false}
                dataSource={data}
                columns={del?TableColumnsWithDel:TableColumns}/>
        </div>
    );
};
