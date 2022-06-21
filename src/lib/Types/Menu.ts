interface MenuField {
    module_id?: number;
    name?: string;
    description?: string;
    required?: string;
    modulePath?: string;
    featureStatus?: string;
    triggerMsg?: string;
    responseJSON?: string
}

interface MenuFieldUpdate {
    module_id?: number;
    name?: string;
    description?: string;
    required?: string;
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