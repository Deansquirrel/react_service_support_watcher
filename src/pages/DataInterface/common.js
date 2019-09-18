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
