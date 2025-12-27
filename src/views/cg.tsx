import GalgameCG from '@/components/gal/GalgameCG';
import datas, { Cg } from '@/types/gal';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CG = () => {
    const navigate = useNavigate()
    const [selectedCG, setSelectedCG] = useState<Cg | null>(null);

    const openCG = (cg: Cg) => {

        setSelectedCG(cg);
    };

    return (
        <div className='relative'>
            <div>
                {
                    datas.map(item => (
                        <div className='' onClick={() => openCG(item)}><img src={item.main} /></div>
                    ))
                }
            </div>
            <div>
                {
                    selectedCG && (
                        <GalgameCG
                            backgroundImage={selectedCG.main}
                            expressions={selectedCG.expressions}
                            initialExpressionIndex={0}
                            width="1920px"
                            height="1080px"
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