// src/components/CGGallery.tsx
import { blogApi } from '@/api/blogApi';
import { Archive, Pager } from '@/types/blog/types';
import React, { useEffect, useRef, useState } from 'react';
import Background from './Background';
import RichTextEditor from '../RichTextEditor';
import { configManager } from '@/utils/ConfigManager';
import { useConfigStore } from '@/stores';
import ArticleTOC from '../article-toc';
import { useNavigate } from 'react-router-dom';

interface CGGalleryProps {
    onClose: () => void;
}

const CGGallery: React.FC<CGGalleryProps> = ({ onClose }) => {
    const [selectedCG, setSelectedCG] = useState<Archive | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [unlockedCGs, setunlockedCGs] = useState<Archive[]>([]);
    const [pager, setPager] = useState<Pager>();
    const hasMounted = useRef(false);
    const { bg } = useConfigStore()
    const config = configManager.get();
    var navigate = useNavigate()

    useEffect(() => {
        if (hasMounted.current) return;
        GetCategoryList(1)
        hasMounted.current = true;
    }, [])

    const Get = async (cg: Archive) => {
        const res = await blogApi.GetArticle(cg.editUrl)
        res.imgUrl = cg.imgUrl;
        setSelectedCG(res)
    }

    const openCG = (cg: Archive, index: number) => {
        //Get(cg);
        navigate(cg.editUrl)
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

    const GetCategoryList = async (page: number) => {
        let res = await blogApi.GetCategoryList(page);
        setunlockedCGs(res.data);
        setPager(res.pager);
    }

    const clickItem = (event: React.MouseEvent<HTMLAnchorElement>, page: number) => {
        event.preventDefault();
        GetCategoryList(page)
    };

    return (
        <div className="cg-gallery h-screen relative" style={{
            backgroundImage: 'url(' + bg + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', // 视差效果
        }}>
            <div className="cg-gallery-header text-blue-300 h-auto w-full relative">
                <div className='absolute text-[25px] left-1'>{config.logo}</div>
                {
                    config.ishome && (
                        <button className="close-gallery absolute right-2 top-2  hover:rotate-[360deg] transition-transform duration-1000" onClick={onClose}>
                            <img className='' src={config.api?.imageUrl + "/images/close.png"}></img>
                        </button>
                    )
                }

            </div>

            {unlockedCGs.length == 0 ? (
                <div className="no-cg-message">
                    <p>尚未解锁任何CG</p>
                    <p>继续游戏以解锁更多CG</p>
                </div>
            ) : (
                <div className="cg-grid relative top-10 grid sm:grid-cols-4 lg:grid-cols-3 gap-8 justify-center pl-6 pr-6 sm:pl-20 sm:pr-20 xl:grid-cols-4">
                    {unlockedCGs.map((cg, index) => (
                        <div
                            key={cg.id}
                            style={{ cursor: 'pointer' }}
                            className="cg-item relative bg-black/40 rounded-xl h-40 xl:h-44 3xl:h-72 xl:text-2xl overflow-hidden 
                            hover:shadow-xl hover:-translate-y-1 
            transition-all duration-300 ease-in-out"
                            onClick={() => openCG(cg, index)}
                        >
                            <div className={`cg-image absolute inset-0 w-full h-full object-cover`}>
                                {
                                    cg.imgUrl && (<img src={cg.imgUrl} referrerPolicy="no-referrer" />)
                                }
                            </div>
                            <div className="cg-title absolute inset-0 text-white w-full h-8 text-center self-center text-[14px] 3xl:text-[30px] overflow-hidden text-ellipsis">
                                {cg.title}
                            </div>
                            <div className='cg-date'>
                                {cg.time}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* {selectedCG && (
                <div className="cg-viewer absolute top-0 w-screen inset-0 m-auto bg-white overflow-y-scroll">
                    <h3 className='absolute text-center top-16 inset-0 m-auto z-10 text-2xl'>{selectedCG.title}</h3>
                    <button className="cg-close fixed top-2 right-2 z-10" onClick={closeCG}>
                        <img src={config.api?.imageUrl+"/images/close.png"}></img>
                    </button>
                    <div className={`cg-full-image relative`}><img className='w-full h-44 object-cover' src={selectedCG.imgUrl} /></div>
                    <div className="cg-viewer-content relative w-full z-10 flex">
                        <div className=''>
                        </div>
                        
                        <div className=''>
                            {<ArticleTOC></ArticleTOC>}
                        </div>
                    </div>
                    <div className='cg-editor'>
                        {
                            <RichTextEditor></RichTextEditor>
                        }
                    </div>
                    <div className='cg-comment'>
                        {

                            selectedCG.comments?.map(item => (
                                <div>{item.desc}</div>
                            ))
                        }
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
            )} */}
            {
                pager && (
                    <div className='cg-pager pagination relative top-10 flex items-center justify-center'>
                        {
                            pager.pages.map(item => (
                                <a key={item} style={{ cursor: 'pointer' }} className={pager.current == item ? 'active' : ''} onClick={(e) => clickItem(e, item)}>{item}</a>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default CGGallery;