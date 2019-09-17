import C from "./constants";

export const HeartbeatDataAction = (d=[]) => (
    {
        type:C.HeartbeatData,
        heartbeatData:d
    }
);
