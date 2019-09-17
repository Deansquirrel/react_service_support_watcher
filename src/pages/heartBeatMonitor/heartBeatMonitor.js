import React, {Component} from "react";
// import {Button,Divider,Spin} from 'antd';
import {Row,Col,Tabs,Table,Statistic } from 'antd';
import PropTypes from 'prop-types';
import {combineReducers, createStore} from "redux";
import {heartBeatMonitorState} from "./reducer";
import {CustomerAction, HeartBeatDataAction, LoadingAction, TypeAction} from "./actions";

import "../common.css"
import "./heartBeatMonitor.css"
import moment from "moment";

import d from "./data";

const defaultState = {
    heartBeatMonitorState:{
        type:"",
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
    store.dispatch(LoadingAction(true));
    store.dispatch(TypeAction(defaultState.heartBeatMonitorState.type));
    store.dispatch(LoadingAction(false));
};

const refreshHeartbeatData = () => {
    store.dispatch(HeartBeatDataAction(d));
    const customerList = GetCustomerList();
    if(customerList.length > 0){
        store.dispatch(CustomerAction(customerList[0]));
    } else {
        store.dispatch(CustomerAction(""));
    }
};

const GetCustomerList = () => {
    const data = store.getState().heartBeatMonitorState.heartbeatData;
    let rList = [];
    // eslint-disable-next-line
    {data.map((item)=>{
        if(item.hasOwnProperty("customerName")&&rList.indexOf(item.customerName)<0){
            rList.push(item.customerName);
        }
        return item;
    })}
    return rList;
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
        refreshHeartbeatData();
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
        return item.hasOwnProperty("customerName")
            && item.customerName === customer
            && item.hasOwnProperty("isOffLine")
            && item.isOffLine === "false"
    });
};

const GetEData = (customer="") => {
    // const c = store.getState().heartBeatMonitorState.customer;
    return store.getState().heartBeatMonitorState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("customerName")
            && item.customerName === customer
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
            <DataPanel title={"异常心跳"} titleColor={GetEData(c).length>0?"#ff0000":"#000000"} data={GetEData(c)} />
            <DataPanel title={"正常心跳"} data={GetNData(c)} />
        </div>
    )
};

const TableColumns = [
    {
        title: 'ClientID',
        dataIndex: 'customerName',
        key: 'clientId',
    },
    {
        title: '门店ID',
        dataIndex: 'mdId',
        key: 'mdId',
    },
    {
        title: '门店名称',
        dataIndex: 'mdName',
        key: 'mdName',
    },
    {
        title: '最后心跳时间',
        dataIndex: 'heartBeat',
        key: 'heartBeat',
    },
    {
        title: "Action",
        dataIndex: '',
        key: 'x',
        render: (d) => (
            <span onClick={() => {
                if(d.hasOwnProperty("mdId")){
                    console.log(d.mdId)
                }
            }} style={{cursor:"pointer",color:"#1890ff"}}>
                Delete
            </span>
        )
    }
];

const DataPanel = ({title="",titleColor="#000000",data=[]}) => {
    return (
        <div style={{marginTop:'16px'}}>
            <h2 style={{marginLeft:'8px',color:titleColor}}>{title}({data.length})</h2>
            <Table
                rowKey={"mdId"}
                loading={store.getState().heartBeatMonitorState.loading}
                bordered
                pagination={false}
                dataSource={data}
                columns={TableColumns}/>
        </div>
    );
};
