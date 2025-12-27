import { AppMenu } from "@/types/config";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

interface AppMenuProps {
    menu?: AppMenu[]
}

const AppMenu = ({ menu }: AppMenuProps) => {
    var navigate = useNavigate()

    const clickItem = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        event.preventDefault();
        if (!url) {
            return;
        }
        else if (url.startsWith("me")) {
            //this.foucsMe()
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


    return (
        <div className="absolute h-auto right-0 top-1/2 transform -translate-y-1/2 z-10">
            <ul>
                {
                    menu?.map(item => (
                        <li key={item.name} className="text-[#f57878] hover:text-cyan-300 text-right mr-2">
                            <a style={{cursor: 'pointer'}} onClick={(e) =>clickItem(e,item.path)}>
                                <div className="relative text-[40px] [text-shadow:-1px_0_white,0_1px_white,1px_0_white,0_-1px_white]">{item.name}</div>
                                <div className="relative -mt-4">{item.title}</div>
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default AppMenu;