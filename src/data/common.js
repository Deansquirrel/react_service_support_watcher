import user from "./user";
import menu from "./menu";

export const GetUserInfo = () => {
    let rList = [];
    rList.push(...user);
    return rList;
};

export const GetMenuData = () => {
    let rList = [];
    rList.push(...menu);
    return rList;
};