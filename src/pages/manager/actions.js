import C from "./constants";

export const LoggingOutAction = (s=false) => (
    {
        type:C.LoggingOut,
        loggingOut: s
    }
);

export const CollapsedAction = (c=false) => (
    {
        type:C.Collapsed,
        collapsed:c
    }
);

export const CurrPageAction = (currPage="") => (
    {
        type:C.CurrPage,
        currPage:currPage
    }
);

export const VersionAction = (version="") => (
    {
        type:C.Version,
        version:version
    }
);

export const WsVersionAction = (wsVersion="") => (
    {
        type:C.WsVersion,
        wsVersion:wsVersion
    }
);

export const WsAddressAction = (wsAddress="") => (
    {
        type:C.WsAddress,
        wsAddress:wsAddress
    }
);

export const MenuAction = (menu=[]) => (
    {
        type:C.Menu,
        menu:menu
    }
);

export const OpenKeysAction = (openKeys=[]) => (
    {
        type:C.OpenKeys,
        openKeys:openKeys
    }
);

export const SelectedKeysAction = (selectedKeys=[]) => (
    {
        type:C.SelectedKeys,
        selectedKeys:selectedKeys
    }
);


export const HandleLogoutAction = (handleLogout=f=>f) => (
    {
        type:C.HandleLogout,
        handleLogout:handleLogout,
    }
);
