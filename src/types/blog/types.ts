export interface Archive  {
    id: number;
    title: string;
    url: string;
    desc: string;
    time: string;
    readNum: number;
    commentNum: number;
    recommendNum: number;
    editUrl: string;
    imgUrl: string;
    isTop: boolean;
    comments?:Comment[]
}

export interface Pager{
    current:number;
    pages:number[];
}

export interface Comment{
    id: number;
    date:string;
    author:string;
    desc:string;
}