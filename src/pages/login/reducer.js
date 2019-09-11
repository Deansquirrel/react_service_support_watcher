import C from "./constants"

export const loginState = (state={},action={}) => {
    switch (action.type) {
        case C.LoggingIn:
            return {
                ...state,
                loggingIn:action.loggingIn
            };
        case C.Version:
            return {
                ...state,
                version:action.version,
            };
        case C.WsVersion:
            return {
                ...state,
                wsVersion:action.wsVersion,
            };
        case C.WsAddress:
            return {
                ...state,
                wsAddress: action.wsAddress,
            };
        case C.HandleLoginSuccess:
            return {
                ...state,
                handleLoginSuccess:action.handleLoginSuccess
            };
        default:
            return state;
    }
};
