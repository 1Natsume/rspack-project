import GalgameCG from '@/components/gal/GalgameCG';
import { Cg } from '@/types/gal';
import { configManager } from '@/utils/ConfigManager';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CG = () => {
    const navigate = useNavigate()
    const [selectedCG, setSelectedCG] = useState<Cg | null>(null);
    const [open, setOpen] = useState(false);
    const config = configManager.get();
    const openCG = (cg: Cg) => {
        setOpen(true);
        setSelectedCG(cg);
    };

    const closeCG = () => {
        setOpen(false);
        setSelectedCG(null);
    };

    const datas: Cg[] = [
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
        {
            main: '/images/ev215a+pimg+2.png',
            expressions: [
                // {
                //     name: '',
                //     image: '',
                //     position: {
                //         x: '', y: ''
                //     },
                //     scale: 1
                // },
                {
                    name: "1",
                    image: "/images/ev215a+pimg+3.png",
                    position: { x: "19.52%", y: "26.82%" },
                    scale: 0.226
                },
                // {
                //     name: "2",
                //     image: "/images/ev215a+pimg+4.png",
                //     position: { x: "51.08%", y: "53.72%" },
                //     scale: 0.392
                // },
                // {
                //     name: "3",
                //     image: "/images/ev215a+pimg+5.png",
                //     position: { x: "51.08%", y: "52.42%" },
                //     scale: 0.4
                // },
                // {
                //     name: "4",
                //     image: "/images/ev215a+pimg+6.png",
                //     position: { x: "51.08%", y: "54.78%" },
                //     scale: 0.413
                // },
                // {
                //     name: "5",
                //     image: "/images/ev215a+pimg+7.png",
                //     position: { x: "51.08%", y: "54.78%" },
                //     scale: 0.413
                // },
            ]

        },
    ]

    return (
        <div className='relative'>
            <div className='gird grid-cols-3 gap-8 justify-center'>
                {
                    datas.map(item => (
                        <div key={item.main} className='w-64' onClick={() => openCG(item)}><img src={config.api.imageUrl + item.main} /></div>
                    ))
                }
            </div>

            <div className='relative w-auto'>
                {
                    selectedCG && (
                        <GalgameCG
                            isOpen={open}
                            onClose={closeCG}
                            backgroundImage={selectedCG.main}
                            expressions={selectedCG.expressions}
                            initialExpressionIndex={0}
                            width="1280px"
                            height="720px"
                            onExpressionChange={(name, index) => {
                                console.log(`切换到表情: ${name}, 索引: ${index}`);
                            }}
                            showExpressionSelector={true}
                            clickToSwitch={true}
                        />
                    )
                }
            </div>

        </div>
    )
}

export default CG;