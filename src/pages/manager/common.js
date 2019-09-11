export const GetMenuOpenKeys = (menu=[],page="") => {
    let list = [];
    if(menu.length===0){
        return list;
    }

    let listMap = getMenuKeyMap(menu);
    if(page===""){
        let keys = Object.keys(listMap);
        if(keys.length>0){
            list.push(listMap[keys[0]]);
        }
        return list;
    }

    // eslint-disable-next-line
    for(let key in listMap){
        if(key===page){
            list.push(listMap[key]);
        }
    }

    if(list.length===0){
        return GetMenuOpenKeys(menu);
    }
    return list;
};

export const GetMenuSelectedKeys = (menu=[],page="") => {
    let list = [];
    if(menu.length===0){
        return list;
    }

    let listMap = getMenuKeyMap(menu);
    if(page===""){
        let keys = Object.keys(listMap);
        if(keys.length>0){
            list.push(keys[0]);
        }
        return list;
    }

    // eslint-disable-next-line
    for(let key in listMap){
        if(key===page){
            list.push(key);
        }
    }

    if(list.length===0){
        return GetMenuSelectedKeys(menu);
    }
    return list;
};

const getMenuKeyMap = (menu=[]) => {
    let listMap = new Map();
    menu.map((item)=>{
        if(item.child&&item.child.length > 0){
            item.child.map((subItem)=>{
                listMap[subItem.key]=item.key;
                return subItem.key;
            })
        } else {
            listMap[item.key]=item.key;
        }
        return item.key;
    });
    return listMap;
};
