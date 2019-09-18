import C from "./constants"

export const welcomeState = (state={},action={}) => {
    switch (action.type) {
        case C.HeartbeatData:
            return {
                ...state,
                heartbeatData:action.heartbeatData
            };
        case C.WsAddress:
            return {
                ...state,
                wsAddress:action.wsAddress,
            };
        default:
            return state;
    }
};
