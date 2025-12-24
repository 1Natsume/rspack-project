// import React, { useEffect } from 'react';
// import { useState } from 'react'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Virtual } from 'swiper/modules';
// import { Navigation, Pagination, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';
// const apiUrl = import.meta.env.VITE_API_BASE_URL;

// const playActiveSlideVideo = (swiperInstance) => {
//     // 暂停所有视频
//     // document.querySelectorAll('.swiper-slide video').forEach(video => {
//     //     video.pause();
//     // });
//     // 播放当前活动视频
//     // const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
//     // console.log(swiperInstance)
//     // const activeVideo = activeSlide.querySelector('video');
//     // if (activeVideo) {
//     //     activeVideo.play().catch(error => {
//     //         console.log('视频自动播放失败:', error);
//     //     });
//     // }
// }


// const Video = () => {
//     const [videos, setvideos] = useState([]);
//     const [activeIndex, setactiveIndex] = useState(0);
//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await fetch(apiUrl + '/videos');
//             const data = await response.json();
//             setvideos(data)
//         }
//         //fetchData()
//         // 清理函数
//         return () => {
//             // videos.destroy();
//         };
//     }, []); // 空依赖数组确保只在组件挂载时执行一次
//     return (
//         <div>
//             <Swiper className="swiper-container"
//                 onSlideChange={(swiper) => playActiveSlideVideo(swiper)}
//                 // onSwiper={(swiper) => console.log(1)}
//                 direction={'vertical'}
//                 loop={true}
//                 autoplay={{ delay: 4000, disableOnInteraction: false }}
//             >
//                 {videos.map((item, index) => (
//                     <SwiperSlide className={activeIndex === index ? 'swiper-slide active' : 'swiper-slide'} key={item.id} virtualIndex={index}>

//                         <video className="video-player" src={apiUrl + item.url} webkit-playsinline="true" preload="auto" autoPlay={true} muted></video>
//                         <div className="video-info">
//                             <h3 className="video-title">{item.title}</h3>
//                             <div className="video-tags">{item.tags.map((tag, index) => (
//                                 <span className="video-tag" key={index}><a>{tag}</a></span>
//                             ))}
//                             </div>

//                         </div>
//                     </SwiperSlide>
//                 ))}

//             </Swiper>
//             <div className="bottom-nav">
//                 <div className="nav-item active">
//                     <i className="fas fa-home"></i>
//                     <span>首页</span>
//                 </div>
//                 <div className="nav-item">
//                     <i className="fas fa-compass"></i>
//                     <span>发现</span>
//                 </div>
//                 <div className="nav-item">
//                     <i className="fas fa-plus-circle"></i>
//                     <span>创作</span>
//                 </div>
//                 <div className="nav-item">
//                     <i className="fas fa-comment-dots"></i>
//                     <span>消息</span>
//                 </div>
//                 <div className="nav-item">
//                     <i className="fas fa-user"></i>
//                     <span>我</span>
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default Video;