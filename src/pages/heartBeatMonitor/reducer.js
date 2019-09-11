import C from "./constants"

export const heartBeatMonitorState = (state={},action={}) => {
    switch (action.type) {
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
        case C.CustomerList:
            return {
                ...state,
                customerList:action.customerList,
            };
        default:
            return state;
    }
};
