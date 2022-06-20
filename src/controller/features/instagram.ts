import { AnyWASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";

export default async function instagram(sock?: AnyWASocket, m?: MessageMaterial, updateSQL?: string) {
    const _trigger: string[] = ['instagram', 'ig', 'insta', 'igstory', 'reels']
    const usingCmd: boolean = !m!.isCommand! 
    const _obj: MenuField = {
        name: 'Instagram Downloader',
        description: 'All instagram downloader, post, reels, and story, etc.',
        featureStatus: 'maintenance',
        triggerMsg: _trigger.join('|')
    }

    if (updateSQL) return _obj
    if (usingCmd) return
    if (!_trigger.includes(m!.command!)) return
    // Place your code here
}