import C from "./constants"

export const managerState = (state={},action={}) => {
    switch (action.type) {
        case C.LoggingOut:
            return {
                ...state,
                loggingOut:action.loggingOut
            };
        case C.Collapsed:
            return {
                ...state,
                collapsed:action.collapsed,
            };
        case C.CurrPage:
            return {
                ...state,
                currPage:action.currPage,
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
        case C.Menu:
            return {
                ...state,
                menuData:menuData(state.menuData,action)
            };
        case C.OpenKeys:
            return {
                ...state,
                menuData:menuData(state.menuData,action)
            };
        case C.SelectedKeys:
            return {
                ...state,
                menuData:menuData(state.menuData,action)
            };
        case C.HandleLogout:
            return {
                ...state,
                handleLogout:action.handleLogout,
            };
        default:
            return state;
    }
};

const menuData = (state={},action={}) => {
    switch (action.type) {
        case C.Menu:
            return {
                ...state,
                menu:action.menu
            };
        case C.OpenKeys:
            return {
                ...state,
                openKeys:action.openKeys
            };
        case C.SelectedKeys:
            return {
                ...state,
                selectedKeys:action.selectedKeys
            };
        default:
            return state;
    }
};
