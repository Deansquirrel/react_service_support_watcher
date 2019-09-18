import C from "./constants";

export const HeartbeatDataAction = (d=[]) => (
    {
        type:C.HeartbeatData,
        heartbeatData:d
    }
);

export const WsAddressAction = (address="") => (
    {
        type:C.WsAddress,
        wsAddress:address,
    }
);
