interface MenuField {
    name?: string;
    description?: string;
    modulePath?: string;
    featureStatus?: string;
    triggerMsg?: string;
    responseJSON?: string
}

interface MenuFieldUpdate {
    oldname?: string;
    name?: string;
    description?: string;
    modulePath?: string;
    featureStatus?: string;
    triggerMsg?: string;
    responseJSON?: string
}

interface MenuList extends Array<MenuField> {}

interface queryStatus {
    status: boolean;
    message?: any;
}

export {
    MenuField,
    MenuFieldUpdate,
    MenuList,
    queryStatus
}