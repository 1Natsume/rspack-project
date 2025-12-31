export interface expression {
    name: string;
    image: string;
    position: position;
    scale: number;
}

export interface position {
    x: string;
    y: string;
}

export interface Cg {
    main: string;
    expressions: expression[];
}