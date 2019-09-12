import React, {Component} from "react";
// import {Button,Divider,Spin} from 'antd';
import {Icon,Row,Col,Tooltip,Tabs,Table } from 'antd';
import PropTypes from 'prop-types';
import {combineReducers, createStore} from "redux";
import {heartBeatMonitorState} from "./reducer";
import {CustomerAction, CustomerListAction, HeartBeatDataAction, LoadingAction, TypeAction} from "./actions";

import "../common.css"
import "./heartBeatMonitor.css"
import {GetCustomerList} from "./common";
import moment from "moment";

import d from "./data";

const defaultState = {
    heartBeatMonitorState:{
        type:"",
        loading:false,
        totalClient:-1,
        totalErr:-1,
        customer:"aa",
        customerList:[],
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
        refreshCustomerList(GetCustomerList(store.getState().heartBeatMonitorState.type));

        store.dispatch(HeartBeatDataAction(d));
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
                    <TotalInfoCard
                        title={"客户"}
                        tips={"接入的客户数量"}
                        content={store.getState().heartBeatMonitorState.customerList.length}
                    />
                </Col>
                <Col span={8}>
                    <TotalInfoCard
                        title={"客户端"}
                        tips={"接入的客户端数量"}
                        content={store.getState().heartBeatMonitorState.totalClient}
                    />
                </Col>
                <Col span={8}>
                    <TotalInfoCard
                        title={"异常数"}
                        tips={"心跳异常数量"}
                        content={store.getState().heartBeatMonitorState.totalErr}
                        color={store.getState().heartBeatMonitorState.totalErr > 0 ?"#ff0000":"#000000"}
                    />
                </Col>
            </Row>
        </div>
    )
};

const TotalInfoCard = ({title="Card",content=0,tips="tips",color="#000000"}) => {
    return (
        <div className={"heartbeat_total_info_card"}>
            <div className={"heartbeat_total_info_card_title"}>
                <span>{title}</span>
                <Tooltip className={"heartbeat_total_info_card_title_tips"} title={tips}>
                    <Icon style={{marginTop:"4px"}} type="question-circle" />
                </Tooltip>
            </div>
            <div className={"heartbeat_total_info_card_content"} style={{color:color}}>
                <span>{content}</span>
            </div>
        </div>
    );
};

const { TabPane } = Tabs;
const CustomerInfo = () => {
    return (
        <div className={"heartbeat_customer_info"}>
            <Tabs size={"large"} onChange={(key)=>store.dispatch(CustomerAction(key))}>
                {store.getState().heartBeatMonitorState.customerList.map((item)=>{
                    return (
                        <TabPane tab={item} key={item} />
                    )
                })}
            </Tabs>
            <CustomerInfoDetail />
        </div>
    )
};

const CustomerInfoDetail = () => {
    const c = store.getState().heartBeatMonitorState.customer;
    const nData = store.getState().heartBeatMonitorState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("customerName")
            && item.customerName === c
            && item.hasOwnProperty("isOffLine")
            && item.isOffLine === "true"
    });
    const eData = store.getState().heartBeatMonitorState.heartbeatData.filter((item)=>{
        return item.hasOwnProperty("customerName")
            && item.customerName === c
            && item.hasOwnProperty("isOffLine")
            && item.isOffLine === "false"
    });
    return (
        <div className={"heartbeat_customer_info_detail"}>
            <span style={{float:'right',marginRight:'16px',marginTop:'8px'}}>
                最后刷新时间：{store.getState().heartBeatMonitorState.lastRefresh.format("YYYY-MM-DD HH:mm:ss")}
            </span>
            <DataPanel title={"异常心跳"} titleColor={nData.length>0?"#ff0000":"#000000"} data={nData} />
            <DataPanel title={"正常心跳"} data={eData} />
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
