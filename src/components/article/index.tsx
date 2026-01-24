import { useEffect, useRef, useState } from "react";
import ArticleTOC from "../article-toc"
import RichTextEditor from "../RichTextEditor"
import { Archive } from "@/types/blog/types";
import { configManager } from "@/utils/ConfigManager";
import { blogApi } from "@/api/blogApi";
import { useNavigate, useParams } from 'react-router-dom';

const Article = () => {
    const [selectedCG, setSelectedCG] = useState<Archive | null>(null);
    const config = configManager.get();
    const hasMounted = useRef(false);
    const params = useParams();
    const navigate = useNavigate()

    const Get = async () => {
        const res = await blogApi.GetArticle(params.id as string)
        setSelectedCG(res)
    }

    const closeCG = () => {
        setSelectedCG(null);
        navigate('/blog', { replace: true })
    };

    useEffect(() => {
        if (hasMounted.current) return;
        Get()
        hasMounted.current = true;
    }, [])

    return (
        <div className="relative w-screen bg-white">
            <button className="cg-close fixed top-2 right-2 z-10 hover:rotate-[360deg] transition-transform duration-1000" onClick={closeCG}>
                <img src={config.api?.imageUrl + "/images/close.png"}></img>
            </button>
            <div className={`relative h-40`}>
                <div className="" style={{
                    // backgroundImage: 'url(' + selectedCG?.imgUrl + ')',
                    // backgroundSize: 'cover',
                    // backgroundPosition: 'center',
                    // backgroundRepeat: 'no-repeat',
                    // backgroundAttachment: 'fixed', // 视差效果
                }}></div>
                {/* <img className='w-full h-44 object-cover' src={selectedCG?.imgUrl} /> */}
                <h3 className='absolute w-auto text-center top-16 inset-0 m-auto z-10 text-2xl'>{selectedCG?.title}</h3>
            </div>
            <div className="relative pl-20 pr-20">
                <div
                    dangerouslySetInnerHTML={{ __html: selectedCG?.desc as string }}
                    className="rendered-html article-content w-auto"
                />
                <div className='absolute top-0 w-60 right-2'>
                    {<ArticleTOC></ArticleTOC>}
                </div>
            </div>
            {/* <div className='cg-editor'>
                {
                    <RichTextEditor></RichTextEditor>
                }
            </div> */}
            <div className='cg-comment'>
                {

                    selectedCG?.comments?.map(item => (
                        <div>{item.desc}</div>
                    ))
                }
            </div>
        </div>
    )
}

export default Article;