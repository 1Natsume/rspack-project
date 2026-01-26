import { configManager } from "./ConfigManager";

 export interface Music{
    title:string;
    url:string;
    author:string;
    pic:string;
    lrc:string;
 }

 class MusicPlayer{
    private musicApiUrl:string = 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r'

    async load(): Promise<Music[]> {
        var config = configManager.get()
        var url = this.musicApiUrl
        .replace(":server", config.music?.server as string)
        .replace(":type", config.music?.type as string)
        .replace(":id", config.music?.id as string)
        .replace(":r", '1')

        var res = await fetch(url)
        return await res.json()
    }
 }

 // 创建单例实例
 export const musicPlayer = new MusicPlayer();