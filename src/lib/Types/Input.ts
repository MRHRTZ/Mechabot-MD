interface InputField {
    id?: number;
    created_at?: Date;
    jid?: string;
    feature?: string;
    input_type?: string;
    is_input?: string;
    value?: string;
}

interface InputFieldNew {
    jid?: string;
    feature?: string;
    input_type?: string;
    is_input?: string;
}

interface InputFieldUpdate {
    jid?: string;
    feature?: string;
    is_input?: string;
    value?: string;
}

interface InputList extends Array<InputField> {}

interface queryStatus {
    status: boolean;
    message?: any;
}

export {
    InputList,
    InputField,
    InputFieldNew,
    InputFieldUpdate,
    queryStatus
}