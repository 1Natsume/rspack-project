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

let datas: Cg[] = [
    {
        main: '/images/ev201a+pimg+2.png',
        expressions: [
            {
                name: '',
                image: '',
                position: {
                    x: '', y: ''
                },
                scale: 1
            },
            {
                name: "恶心",
                image: "/images/ev201a+pimg+3.png",
                position: { x: "77.1%", y: "19.2%" },
                scale: 0.3
            },
        ]

    },
    {
        main: '/images/ev208a+pimg+2.png',
        expressions: [
            {
                name: '',
                image: '',
                position: {
                    x: '', y: ''
                },
                scale: 1
            },
            {
                name: "1",
                image: "/images/ev208a+pimg+3.png",
                position: { x: "51.08%", y: "53.12%" },
                scale: 0.402
            },
            {
                name: "2",
                image: "/images/ev208a+pimg+4.png",
                position: { x: "51.08%", y: "53.72%" },
                scale: 0.392
            },
            {
                name: "3",
                image: "/images/ev208a+pimg+5.png",
                position: { x: "51.08%", y: "52.42%" },
                scale: 0.4
            },
            {
                name: "4",
                image: "/images/ev208a+pimg+6.png",
                position: { x: "51.08%", y: "54.78%" },
                scale: 0.413
            },
        ]

    },
]

export default datas