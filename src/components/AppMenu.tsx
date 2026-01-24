import { blogApi } from "@/api/blogApi";
import { AppMenu } from "@/types/config";
import { antdUtils } from "@/utils/antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AppMenuProps {
    menu?: AppMenu[]
}

const AppMenu = ({ menu }: AppMenuProps) => {
    const [Follow, setFollow] = useState<boolean>(false);
    var navigate = useNavigate()

    const blogFollow = async () => {
        const res = await blogApi.blogFollow()
        return res
    }

    const loadFollow = async () => {
        const res = await blogApi.loadBlogFollow()
        setFollow(res)
    }

    const clickItem = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        event.preventDefault();
        if (!url) {
            return;
        }
        else if (url.startsWith("me")) {
            antdUtils.message.info(blogFollow())
            
            return;
        }
        else if (url.startsWith("http")) {
            window.open(url);
            return;
        }
        else {
            navigate(url, { replace: true });
        }

    };

    useEffect(()=>{
        loadFollow()
    },[])


    return (
        <div className="absolute h-auto right-0 top-1/2 transform -translate-y-1/2 z-10">
            <ul>
                {
                    menu?.map(item =>

                    (
                        item.name === "FOLLOW" && !Follow ? (
                            <li key={item.name} className="text-[#eee] text-right mr-2">
                                <a style={{ cursor: 'pointer' }}>
                                    <div className="relative text-[40px]">{item.name}</div>
                                    <div className="relative -mt-4">已{item.title}</div>
                                </a>
                            </li>
                        ) : (
                            <li key={item.name} className="text-[#f57878] hover:text-cyan-300 text-right mr-2">
                                <a style={{ cursor: 'pointer' }} onClick={(e) => clickItem(e, item.path)}>
                                    <div className="relative text-[40px] [text-shadow:-1px_0_white,0_1px_white,1px_0_white,0_-1px_white]">{item.name}</div>
                                    <div className="relative -mt-4">{item.title}</div>
                                </a>
                            </li>
                        )
                    ))
                }
            </ul>
        </div>
    )
}

export default AppMenu;