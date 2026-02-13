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
import MusicPlayer from '../music-player';

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
                <div className="cg-grid relative top-10 grid sm:grid-cols-4 lg:grid-cols-3 gap-8 justify-center pl-6 pr-6 sm:pl-20 sm:pr-20 xl:grid-cols-4"
                id='cg-grid'>
                    {unlockedCGs.map((cg, index) => (
                        <div
                            key={cg.id}
                            // style={{ cursor: 'pointer' }}
                            style={{
                                backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Crect width=%2232%22 height=%2232%22 fill=%22%23ffe2ed%22 /%3E%3Crect x=%220%22 y=%220%22 width=%2216%22 height=%2216%22 fill=%22%23ffccd9%22 /%3E%3Crect x=%2216%22 y=%2216%22 width=%2216%22 height=%2216%22 fill=%22%23ffccd9%22 /%3E%3C!-- 小星星 --%3E%3Ccircle cx=%228%22 cy=%228%22 r=%221.5%22 fill=%22%23fff%22 /%3E%3Ccircle cx=%2224%22 cy=%2224%22 r=%221.5%22 fill=%22%23fff%22 /%3E%3C!-- 小心心 --%3E%3Cpath d=%22M6 20L8 18L10 20L8 24Z%22 fill=%22%23ff80a5%22 /%3E%3Cpath d=%22M26 8L28 6L30 8L28 12Z%22 fill=%22%23ff80a5%22 /%3E%3C!-- 可罗米小骷髅蝴蝶结元素 --%3E%3Ccircle cx=%2216%22 cy=%227%22 r=%222%22 fill=%22%23000%22 /%3E%3Crect x=%2215%22 y=%225%22 width=%222%22 height=%222%22 fill=%22%23fff%22 /%3E%3C/svg%3E')",
                  backgroundRepeat: 'repeat', 
                  backgroundSize: '32px 32px'
                            }}
                            className="pixel-card relative  rounded-xl 
                            border-4 border-[#ffa6c9] shadow-[6px_6px_0px_0px_#b34180] 
                            h-40 xl:h-44 3xl:h-[230px] 4xl:h-[350px] xl:text-2xl 
                            overflow-hidden 
                            hover:shadow-[4px_4px_0px_0px_#87255b] transition-all duration-100"
                            onClick={() => openCG(cg, index)}
                        >
                            <div className="absolute inset-0 bg-[rgba(255,235,240,0.7)] [image-rendering:pixelated]"></div>
                            <div className={`cg-image absolute inset-0 w-full h-full object-cover`}>
                                {
                                    cg.imgUrl && (<img src={cg.imgUrl} referrerPolicy="no-referrer" />)
                                }
                            </div>
                            <div className="cg-title absolute inset-0 text-[#4d2634] w-full h-8 text-center self-center text-[14px] 3xl:text-[30px] overflow-hidden text-ellipsis">
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
            {
                configManager.get().music?.enable && unlockedCGs.length>0 && (
                    <MusicPlayer></MusicPlayer>
                )
            }
        </div>
    );
};

export default CGGallery;