import C from "./constants";

export const TypeAction = (type="") => (
    {
        type:C.Type,
        dType:type
    }
);

export const WsAddressAction = (address="") => (
    {
        type:C.WsAddress,
        wsAddress:address,
    }
);


export const LoadingAction = (l=false) => (
    {
        type:C.Loading,
        loading:l,
    }
);

export const CustomerAction = (customer="") => (
    {
        type:C.Customer,
        customer:customer,
    }
);

export const HeartBeatDataAction = (d=[]) => (
    {
        type:C.HeartBeatData,
        heartbeatData:d,
    }
);

export const LastRefreshAction = (t="") => (
    {
        type:C.LastRefresh,
        lastRefresh: t,
    }
);
