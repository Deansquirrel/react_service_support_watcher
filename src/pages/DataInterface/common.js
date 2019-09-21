import axios from 'axios';

//获取后端服务版本
export const GetWsVersionInfo = (address="",successFunc=f=>f,errFunc=f=>f) => {
    if(address===""){
        errFunc("address is empty");
        return
    }

    const url = address + "/version";
    axios.get(url)
        .then(function(response){
            if(response.status===200){
                let infoData = response.data;
                if(infoData.errcode !== undefined) {
                    if(infoData.errcode===200){
                        if(infoData.version !== undefined){
                            successFunc(infoData.version);
                        } else {
                            errFunc("get data err:data return do not contain version");
                        }
                    } else {
                        errFunc(infoData.errmsg);
                    }
                } else {
                    errFunc("get data err:data return do not contain errcode");
                }
            } else {
                const errMsg = "http error: " +
                    "status-" + response.status +
                    ",statusText-" + response.statusText +
                    ",data-" + JSON.stringify(response.data);
                errFunc(errMsg);
            }
        })
        .catch(function(error){
            errFunc(error.toString());
        });
};

//Welcome页面获取心跳异常信息
export const GetHeartbeatErrData = (baseAddress="",typeList="",successFunc=f=>f,errFunc=f=>f) => {
    if(baseAddress===""){
        errFunc("address is empty");
        return
    }
    let data = {"heartbeatClientType":typeList};
    const url = baseAddress + "/watchersupport/welcome";
    axios.post(url,data)
        .then(function(response){
            if(response.status===200){
                let infoData = response.data;
                if(infoData.errcode !== undefined) {
                    if(infoData.errcode===200){
                        if(infoData.heartbeatData !== undefined){
                            successFunc(infoData.heartbeatData);
                        } else {
                            errFunc("get data err:data return do not contain heartbeatData");
                        }
                    } else {
                        errFunc(infoData.errmsg);
                    }
                } else {
                    errFunc("get data err:data return do not contain errcode");
                }
            } else {
                const errMsg = "http error: " +
                    "status-" + response.status +
                    ",statusText-" + response.statusText +
                    ",data-" + JSON.stringify(response.data);
                errFunc(errMsg);
            }
        })
        .catch(function(error){
            errFunc(error.toString())
        })
};

//HeartbeatMonitor页面获取心跳数据
export const GetHeartbeatMonitorData = (baseAddress="",type="",successFunc=f=>f,errFunc=f=>f) => {
    if(baseAddress===""){
        errFunc("address is empty");
        return
    }
    let requestData = {"type":type};
    const url = baseAddress + "/watchersupport/heartbeatMonitorData";
    axios.post(url,requestData)
        .then(function(response){
            if(response.status===200){
                let infoData = response.data;
                if(infoData.errcode !== undefined) {
                    if(infoData.errcode===200){
                        if(infoData.data !== undefined){
                            successFunc(infoData.data);
                        } else {
                            errFunc("get data err:data return do not contain data");
                        }
                    } else {
                        errFunc(infoData.errmsg);
                    }
                } else {
                    errFunc("get data err:data return do not contain errcode");
                }
            } else {
                const errMsg = "http error: " +
                    "status-" + response.status +
                    ",statusText-" + response.statusText +
                    ",data-" + JSON.stringify(response.data);
                errFunc(errMsg);
            }
        })
        .catch(function(error){
            errFunc(error.toString())
        })
};

//HeartbeatMonitor页面DelHeartbeat
export const DelHeartbeat = (baseAddress="",clientId="",successFunc=f=>f,errFunc=f=>f,fFunc=f=>f) => {
    if(baseAddress===""){
        errFunc("address is empty");
        return
    }
    let requestData = {"clientId":clientId};
    const url = baseAddress + "/watchersupport/delHeartbeat";
    axios.post(url,requestData)
        .then(function(response){
            if(response.status===200){
                let infoData = response.data;
                if(infoData.errcode !== undefined) {
                    if(infoData.errcode===200){
                        successFunc();
                    } else {
                        errFunc(infoData.errmsg);
                    }
                } else {
                    errFunc("get data err:data return do not contain errcode");
                }
            } else {
                const errMsg = "http error: " +
                    "status-" + response.status +
                    ",statusText-" + response.statusText +
                    ",data-" + JSON.stringify(response.data);
                errFunc(errMsg);
            }
        })
        .catch(function(error){
            errFunc(error.toString());
        })
        .finally(function(){
            fFunc();
        })
};
