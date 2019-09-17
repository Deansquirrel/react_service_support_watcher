import C from "./constants"

export const welcomeState = (state={},action={}) => {
    switch (action.type) {
        case C.HeartbeatData:
            return {
                ...state,
                heartbeatData:action.heartbeatData
            };
        default:
            return state;
    }
};
