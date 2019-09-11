import React, {Component} from "react";
import PropTypes from 'prop-types';
import {combineReducers,createStore} from "redux";

import "./manager.css"
import "../../App.css"
import {Button,Layout,Icon,Menu} from "antd";

import {managerState} from "./reducer";
import {
    CollapsedAction,
    HandleLogoutAction,
    WsAddressAction,
    WsVersionAction,
    VersionAction, LoggingOutAction, CurrPageAction, MenuAction, OpenKeysAction, SelectedKeysAction
} from "./actions";
import {Welcome} from "../welcome/welcome";
import {Test} from "../test/test";
import {GetMenuOpenKeys, GetMenuSelectedKeys} from "./common";
import {GetMenuData} from "../../data/common";
import {HeartBeatMonitor} from "../heartBeatMonitor/heartBeatMonitor";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const defaultState = {
    managerState:{
        loggingOut:false,
        collapsed: false,
        currPage:"",
        version:"",
        wsVersion:"",
        wsAddress:"",
        menuData:{
            menu:[],
            openKeys:[],
            selectedKeys:[],
        },
        handleLogout:f=>f,
    },
};

const store = createStore(
    combineReducers({managerState}),
    defaultState
);

const setStoreDefault = () => {
    store.dispatch(LoggingOutAction(defaultState.managerState.loggingOut));
    store.dispatch(CollapsedAction(defaultState.managerState.collapsed));
    store.dispatch(CurrPageAction(defaultState.managerState.currPage));
    store.dispatch(VersionAction(defaultState.managerState.version));
    store.dispatch(WsVersionAction(defaultState.managerState.wsVersion));
    store.dispatch(WsAddressAction(defaultState.managerState.wsAddress));
    store.dispatch(MenuAction(defaultState.managerState.menuData.menu));
    store.dispatch(OpenKeysAction(defaultState.managerState.menuData.openKeys));
    store.dispatch(SelectedKeysAction(defaultState.managerState.menuData.selectedKeys));
    store.dispatch(HandleLogoutAction(defaultState.managerState.handleLogout()));
};

const refreshMenuData = (menu=[]) => {
    store.dispatch(MenuAction(menu));
    const selectedKeys = GetMenuSelectedKeys(menu);
    const openKeys = GetMenuOpenKeys(menu);
    store.dispatch(OpenKeysAction(openKeys));
    store.dispatch(SelectedKeysAction(selectedKeys));
};


export class Manager extends Component {
    static propTypes = {
        version:PropTypes.string,
        wsVersion:PropTypes.string,
        wsAddress:PropTypes.string,
        handleLogout:PropTypes.func,
    };

    static defaultProps = {
        version:"",
        wsVersion:"",
        wsAddress:"",
        handleLogout:f=>f,
    };

    componentDidMount() {
        this.unsubscribe = store.subscribe(
            ()=>this.forceUpdate()
        );
        setStoreDefault();

        // const testData = [
        //     {key:"welcome",icon:"table",title:"Welcome",child:[]},
        //     {key:"testPage",icon:"table",title:"TestPage",child:[
        //             {key:"testPage01",title:"TestPage01"},
        //         ]}
        // ];
        refreshMenuData(GetMenuData());
        store.dispatch(HandleLogoutAction(this.props.handleLogout));
        store.dispatch(VersionAction(this.props.version));
        store.dispatch(WsVersionAction(this.props.wsVersion));
        store.dispatch(WsAddressAction(this.props.wsAddress));
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
    }

    render() {
        return (
            <div className={"rootContainer"}>
                <Layout>
                    <Sider
                        width={256}
                        style={{minHeight:'100vh'}}
                        trigger={null}
                        collapsible
                        collapsed={store.getState().managerState.collapsed}>
                        <div className="logo" />
                        <MenuList style={{marginBottom:'80px'}} />
                        <div style={{width:'100%',height:'80px',backgroundColor:'transparent'}} />
                        <div className={"VersionInfo"}
                             style={{display:store.getState().managerState.collapsed?"none":"block"}}>
                            <span>{store.getState().managerState.version}</span>
                            <br/>
                            <span>{store.getState().managerState.wsVersion}</span>
                        </div>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 , width: '100%' }}>
                            <Icon
                                className="trigger"
                                type={store.getState().managerState.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={()=>store.dispatch(CollapsedAction(!store.getState().managerState.collapsed))}
                            />
                            <div className={"rightHeader"}>
                                <Button type={"link"}
                                        onClick={()=>store.getState().managerState.handleLogout()}>
                                    <Icon type="logout" />Logout
                                </Button>
                            </div>
                        </Header>
                        <Content style={{margin: '24px 16px',padding: 24,background: '#fff'}}>
                            <PageContent style={{height:'100%'}} />
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

const MenuList = () => {
    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={store.getState().managerState.menuData.selectedKeys}
            defaultOpenKeys={store.getState().managerState.menuData.openKeys}
        >
            {store.getState().managerState.menuData.menu.map((item)=>{
                if (item.child&&item.child.length > 0){
                    return (
                        <SubMenu
                            key={item.key}
                            title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                            {item.child.map((subItem)=>{
                                return (
                                    <Menu.Item key={subItem.key}
                                               onClick={()=>HandleMenuClick(subItem.key)} >
                                        <span>{subItem.title}</span>
                                    </Menu.Item>
                                )
                            })}
                        </SubMenu>
                    )
                } else {
                    return (
                        <Menu.Item key={item.key} onClick={()=>HandleMenuClick(item.key)}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Menu.Item>
                    )
                }
            })}
        </Menu>
    )
};

const HandleMenuClick = (page="") => {
    store.dispatch(CurrPageAction(page));
    const selectedKeys = GetMenuSelectedKeys(store.getState().managerState.menuData.menu,page);
    const openKeys = GetMenuOpenKeys(store.getState().managerState.menuData.menu,page);
    store.dispatch(OpenKeysAction(openKeys));
    store.dispatch(SelectedKeysAction(selectedKeys));
};

const PageContent = () => {
    switch (store.getState().managerState.currPage) {
        case "welcome":
            return <Welcome/>;
        case "testPage01":
            return <Test/>;
        case "Z5MdDataTrans":
            return <HeartBeatMonitor type={"Z5MdDataTrans"} />;
        case "Z9MdDataTransV2":
            return <HeartBeatMonitor type={"Z9MdDataTransV2"} />;
        default:
            return <Welcome/>;
    }
};
