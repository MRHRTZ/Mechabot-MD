interface ModulesField {
    name?: string;
}

interface ModulesFieldDelete {
    name?: string;
    delAll?: boolean;
}

interface ModulesList extends Array<ModulesField> {}

interface queryStatus {
    status: boolean;
    message?: any;
}

export {
    ModulesField,
    ModulesList,
    queryStatus,
    ModulesFieldDelete
}