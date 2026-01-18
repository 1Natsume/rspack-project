export interface ConfigState {
    collapsed: boolean;
    bg: string;
    darkMode: boolean;
    fontSize: string;
    fontColor: string;
    lang: string;
    token: string;
    refreshToken: string;
    setCollapsed: (collapsed: boolean) => void;
    setDarkMode: (darkMode: boolean) => void;
    setLang: (lang: string) => void;
    setToken: (lang: string) => void;
    setRefreshToken: (lang: string) => void;
    setBg: (bg: string) => void;
}