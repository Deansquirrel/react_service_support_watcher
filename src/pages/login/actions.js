import C from "./constants";

export const LoggingInAction = (s=false) => (
    {
        type:C.LoggingIn,
        loggingIn:s
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

export const HandleLoginSuccessAction = (handleLoginSuccess=f=>f) => (
    {
        type:C.HandleLoginSuccess,
        handleLoginSuccess:handleLoginSuccess
    }
);
