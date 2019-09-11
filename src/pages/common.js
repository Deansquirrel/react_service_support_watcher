import axios from "axios";

export const GetWsAddress = async (successFunc = f => f, errFunc = f => f) => {
    let sysConfig = {};
    try {
        sysConfig = await axios.get("./config.json");
    } catch (e) {
        errFunc("get config file err");
        return;
    }
    if (sysConfig.status === 200) {
        let infoData = sysConfig.data;
        if (infoData.address !== undefined) {
            successFunc(infoData.address);
        } else {
            errFunc("get data err:data return do not contain address");
        }
    } else {
        const errMsg = "http error: " +
            "status-" + sysConfig.status +
            ",statusText-" + sysConfig.statusText +
            ",data-" + JSON.stringify(sysConfig.data);
        errFunc(errMsg);
    }
};
