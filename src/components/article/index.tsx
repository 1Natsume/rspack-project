import { useEffect, useRef, useState } from "react";
import ArticleTOC from "../article-toc"
import CodeBlock from "../CodeBlock"
import RichTextEditor from "../RichTextEditor"
import { Archive } from "@/types/blog/types";
import { configManager } from "@/utils/ConfigManager";
import { blogApi } from "@/api/blogApi";
import { useParams } from 'react-router-dom';

const Article = () => {
    const [selectedCG, setSelectedCG] = useState<Archive | null>(null);
    const config = configManager.get();
    const hasMounted = useRef(false);
    const params = useParams();

    const Get = async () => {
        const res = await blogApi.GetArticle(params.id as string)
        setSelectedCG(res)
    }

    useEffect(() => {
        if (hasMounted.current) return;
        Get()
        hasMounted.current = true;
    }, [])

    return (
        <div className="relative w-screen bg-white">
            {/* <button className="cg-close fixed top-2 right-2 z-10" onClick={closeCG}>
                <img src={config.api?.imageUrl + "/images/close.png"}></img>
            </button> */}
            <div className={`relative`}>
                <div className="" style={{
                    // backgroundImage: 'url(' + selectedCG?.imgUrl + ')',
                    // backgroundSize: 'cover',
                    // backgroundPosition: 'center',
                    // backgroundRepeat: 'no-repeat',
                    // backgroundAttachment: 'fixed', // 视差效果
                }}></div>
                {/* <img className='w-full h-44 object-cover' src={selectedCG?.imgUrl} /> */}
                {/* <h3 className='absolute w-auto text-center top-16 inset-0 m-auto z-10 text-2xl'>{selectedCG?.title}</h3> */}
            </div>
            <div className="flex flex-row w-screen">
                <div className='flex-2'>
                    {/* {<CodeBlock code={selectedCG?.desc as string} language={'html'}></CodeBlock>} */}
                    <div
                        dangerouslySetInnerHTML={{ __html: selectedCG?.desc as string }}
                        className="rendered-html article-content"
                    />
                </div>
                <div className='flex-1'>
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