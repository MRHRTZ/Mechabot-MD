import { AnyMessageContent, proto, MessageType } from '@adiwajshing/baileys'

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
    command: string | undefined | null;
    body: string | null | undefined;
    mentions: string[],
    isMedia: boolean,
    getBuffer: () => Promise<any>;
    replyMessage: (anyMessageContent: AnyMessageContent) => Promise<any>;
    quoted: QuotedMaterial
}

export {
    MessageMaterial
}