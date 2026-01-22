 export interface Music{
    title:string;
    url:string;
    author:string;
    pic:string;
    lrc:string;
 }

 class MusicPlayer{
    private songlist: Music[] = []
    private musicApiUrl:string = 'https://api.i-meto.com/meting/api?server=netease&type=:type&id=:id&r=:r'
    private currentIndex:number = 0;

    async load(): Promise<void> {
        var url = this.musicApiUrl.replace(":type", "playlist")
        .replace(":id", '7282638202')
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