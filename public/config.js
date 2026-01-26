// 这是运行时配置文件
// 部署后可以修改此文件而不需要重新编译

window._config = {
  api: {
    // baseUrl: 'http://8.137.84.46:8000',
    timeout: 30000,
    authHeader: 'X-Auth-Token',
    imageUrl:'https://1natsume.pages.dev'
  },
  menu: [
    { name: "HOME", title: "首页", path: "/blog", icon: "fc-lol-huli fc-icon-40" },
    { name: 'CG', title: 'CG', path: '/cg' },
    { name: "FOLLOW", title: "关注", path: 'me', icon: "fc-lol-ruiwen fc-icon-40" },
  ],
  bg:'https://api.chino.mom/api/',
  music:{
    enable:true,
    server: 'netease',
    type: 'playlist',
    id:'7282638202'
  },
  ishome: false,
  movies:["https://video.cdn.queniuqe.com/store_trailers/256982456/movie480_vp9.webm?t=1703239286"]
};