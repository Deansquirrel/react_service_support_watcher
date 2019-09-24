import C from "./constants"

export const heartBeatMonitorState = (state={},action={}) => {
    switch (action.type) {
        case C.WsAddress:
            return {
                ...state,
                wsAddress:action.wsAddress,
            };
        case C.Type:
            return {
                ...state,
                type:action.dType,
            };
        case C.Loading:
            return {
                ...state,
                loading:action.loading,
            };
        case C.Customer:
            return {
                ...state,
                customer:action.customer,
            };
        case C.HeartBeatData:
            return {
                ...state,
                heartbeatData:action.heartbeatData,
            };
        case C.LastRefresh:
            return {
                ...state,
                lastRefresh:action.lastRefresh,
            };
        default:
            return state;
    }
};
