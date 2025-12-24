
import { useconfigStore } from "@/stores/config";
import { useUserStore } from "@/stores/user";
import { Avatar, Dropdown, MenuProps, Space, Switch } from "antd";

const User = () => {
    const { user, logout } = useUserStore();
    const {darkMode,setDarkMode} = useconfigStore()
    const apiUrl = '';
    const handlelogout = () => {
        logout()
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: '退出',
            icon: '',
            extra: '',
            onClick: () => {
                handlelogout()
            }
        },
    ];

    const handleSwitchTheme = (value: any) => {
        if (value == true) {
            setDarkMode(true);
        }
        else {
            setDarkMode(false);
        }
        document.documentElement.classList.toggle(
            "dark",
            darkMode && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    return (
        <div className="flex flex-row h-full">
            <div className="w-14 self-center">
                <Switch onClick={handleSwitchTheme} />
            </div>
            <div className="w-18 self-center"><Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                    <label className="text-center">{user?.name}</label>  <Avatar src={apiUrl + user?.avatar} />
                </a>
            </Dropdown> </div>
        </div>

    )
}

export default User;