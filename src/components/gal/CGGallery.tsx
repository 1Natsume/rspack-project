// src/components/CGGallery.tsx
import { blogApi } from '@/api/blogApi';
import { Archive } from '@/types/blog/types';
import React, { useState } from 'react';
import CodeBlock from '../CodeBlock';

interface CGGalleryProps {
    cgs: Archive[];
    onClose: () => void;
}

const CGGallery: React.FC<CGGalleryProps> = ({ cgs, onClose }) => {
    const [selectedCG, setSelectedCG] = useState<Archive | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const unlockedCGs = cgs;

    const Get = async (cg: Archive) => {
        const res = await blogApi.GetArticle(cg)
        res.imgUrl = cg.imgUrl;
        setSelectedCG(res)
    }

    const openCG = (cg: Archive, index: number) => {
        Get(cg);
        setCurrentIndex(index);
    };

    const closeCG = () => {
        setSelectedCG(null);
    };

    const nextCG = () => {
        if (currentIndex < unlockedCGs.length - 1) {
            const nextIndex = currentIndex + 1;
            setSelectedCG(unlockedCGs[nextIndex]);
            setCurrentIndex(nextIndex);
        }
    };

    const prevCG = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setSelectedCG(unlockedCGs[prevIndex]);
            setCurrentIndex(prevIndex);
        }
    };

    return (
        <div className="cg-gallery">
            <div className="cg-gallery-header text-blue-300 h-20 w-full">
                <h2>CG画廊</h2>
                <button className="close-gallery" onClick={onClose}>
                    ×
                </button>
            </div>

            {unlockedCGs.length == 0 ? (
                <div className="no-cg-message">
                    <p>尚未解锁任何CG</p>
                    <p>继续游戏以解锁更多CG</p>
                </div>
            ) : (
                <div className="cg-grid grid sm:grid-cols-4 lg:grid-cols-3 gap-8 justify-center pl-6 pr-6 sm:pl-20 sm:pr-20 xl:grid-cols-5">
                    {unlockedCGs.map((cg, index) => (
                        <div
                            key={cg.id}
                            className="cg-item relative bg-gray-500 rounded-xl h-10 xl:h-40 xl:text-2xl overflow-hidden"
                            onClick={() => openCG(cg, index)}
                        >
                            <div className={`cg-image absolute inset-0 w-full h-full object-cover`}><img src={cg.imgUrl} /></div>
                            <div className="cg-title absolute top-16 text-white w-full h-8 text-center self-center text-[14px] overflow-hidden text-ellipsis">
                                {cg.title}
                            </div>
                            <div className='cg-date'>
                                {cg.time}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedCG && (
                <div className="cg-viewer absolute top-0 w-2/3 inset-0 m-auto overflow-hidden bg-[rgba(0,0,0,0.5)]">
                    <h3 className='absolute text-center top-16 inset-0 m-auto z-10 text-2xl'>{selectedCG.title}</h3>
                    <button className="cg-close absolute top-0 right-2 z-10" onClick={closeCG}>×</button>
                    <div className={`cg-full-image relative`}><img className='w-full h-44 object-cover' src={selectedCG.imgUrl} /></div>
                    <div className="cg-viewer-content relative w-full h-96 overflow-y-scroll z-10">
                        {<CodeBlock code={selectedCG.desc} language={'javascript'}></CodeBlock>}
                    </div>
                    <div className="cg-navigation w-fit inset-0 m-auto z-10">
                        <button
                            className="cg-nav-button"
                            onClick={prevCG}
                            disabled={currentIndex === 0}
                        >
                            ◀
                        </button>
                        <span className="cg-counter">
                            {currentIndex + 1} / {unlockedCGs.length}
                        </span>
                        <button
                            className="cg-nav-button"
                            onClick={nextCG}
                            disabled={currentIndex === unlockedCGs.length - 1}
                        >
                            ▶
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CGGallery;