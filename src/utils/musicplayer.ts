import { configManager } from "./ConfigManager";

 export interface Music{
    title:string;
    url:string;
    author:string;
    pic:string;
    lrc:string;
 }

 class MusicPlayer{
    private songlist: Music[] = []
    private musicApiUrl:string = 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r'
    private currentIndex:number = 0;

    async load(): Promise<void> {
        var config = configManager.get()
        var url = this.musicApiUrl
        .replace(":server", config.music?.server as string)
        .replace(":type", config.music?.type as string)
        .replace(":id", config.music?.id as string)
        .replace(":r", '1')

        var res = await fetch(url)
        this.songlist = await res.json()
    }

    next(){
        this.currentIndex += 1
        return this.songlist[this.currentIndex]
    }

    Previous(){
        this.currentIndex -= 1
        return this.songlist[this.currentIndex]
    }
 }

 // 创建单例实例
 export const musicPlayer = new MusicPlayer();