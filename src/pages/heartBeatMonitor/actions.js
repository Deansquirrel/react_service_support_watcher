import C from "./constants";

export const TypeAction = (type="") => (
    {
        type:C.Type,
        dType:type
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

export const CustomerListAction = (list=[]) => (
    {
        type:C.CustomerList,
        customerList:list,
    }
);
