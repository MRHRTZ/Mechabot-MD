import { AnyMessageContent, proto, MessageType, GroupMetadata } from '@adiwajshing/baileys'

interface QuotedMaterial {
    isMedia: boolean;
    isQuoted: boolean;
    type: MessageType;
    body: string | null | undefined;
    getBuffer: () => Promise<any>;
}

interface MessageMaterial {
    from: string | null | undefined;
    pushname: string | null | undefined;
    fromMe: boolean | null | undefined;
    sender: string;
    type: MessageType;
    isOwner: boolean | undefined;
    args: string[],
    isCommand: boolean | undefined;
    command: string | undefined | null;
    body: string | null | undefined;
    mentions: string[],
    isMedia: boolean,
    getBuffer: () => Promise<any>;
    replyMessage: (anyMessageContent: AnyMessageContent) => Promise<proto.WebMessageInfo | undefined>;
    revokeMessage: () => Promise<proto.WebMessageInfo | undefined>;
    reactMessage: (text: string | undefined | null) => Promise<proto.WebMessageInfo | undefined>;
    isGroup: boolean | undefined;
    getGroupMetadata: () => Promise<GroupMetadata | null | undefined>;
    quoted: QuotedMaterial
}

export {
    MessageMaterial
}