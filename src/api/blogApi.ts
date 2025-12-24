import { webScraper } from '@/utils/webScraper';
import { Archive } from '@/types/blog/types';
import { apiService } from '@/request/api.service';

export const blogApi = {
    GetCategoryList: async (page: number = 1) => {
        let data: Archive[] = []
        const multipleResults = await webScraper.scrapeElements(
            '/newjersey?page=' + page,
            '.forFlow .day',
            15000
        );

        multipleResults?.forEach(el => {
            let a: Archive = {
                id: 0,
                title: '',
                url: '',
                desc: '',
                time: '',
                readNum: 0,
                commentNum: 0,
                recommendNum: 0,
                editUrl: '',
                imgUrl: '',
                isTop: false
            };
            el.querySelector(".dayTitle a")?.textContent.trim();
            a.title = el.querySelector(".postTitle a span")?.textContent.trim().replace("[置顶]", "").replace(" [置顶]", "") as string;
            let postDesc = el.querySelector(".postDesc")?.textContent;
            a.editUrl = el.querySelector(".postTitle a")?.getAttribute("href")?.trim().replace('https://www.cnblogs.com','') as string;
            el.querySelector(".postCon .c_b_p_desc a")?.remove();
            a.isTop = el.classList.contains('pinned')
            a.desc = el.querySelector(".postCon .c_b_p_desc")?.textContent.replace('\n摘要：        \n', '') as string;
            if (el.querySelector(".desc_img")) {
                a.imgUrl = 'https://images.weserv.nl/?url=' + el.querySelector(".desc_img")?.attributes[0].value;
            }

            if (postDesc) {
                a.readNum = parseInt(postDesc.split("\n")[2].replace("阅读(", "").replace(")", "").trim());
                a.commentNum = parseInt(postDesc.split("\n")[3].replace("评论(", "").replace(")", ""));
                a.recommendNum = parseInt(postDesc.split("\n")[4].replace("推荐(", "").replace(")", "")); 
                let idArr = a.editUrl.split("/");
                a.id = parseInt(idArr[idArr.length - 1].replace(".html", ""));
            }

            data.push(a)
        })
        return data
    },
    blogFollow: async () => {
        let res = await apiService.post(
            "/" + 'newjersey' + "/ajax/Follow/FollowBlogger.aspx", { blogUserGuid: 'c74cdce3-551f-4ab1-dbb7-08d9c527a5cc' }
        );
        if (res) return true
    },
    GetArticle: async (param:Archive) => {
        const dom = await webScraper.scrapeHtml(param.editUrl);
        let obj:Archive = {
            id: 0,
            title: '',
            url: '',
            desc: '',
            time: '',
            readNum: 0,
            commentNum: 0,
            recommendNum: 0,
            editUrl: '',
            imgUrl: '',
            isTop: false
        };
        obj.title = dom.querySelector("#topics #cb_post_title_url span")?.textContent as string;
        obj.desc = dom.querySelector("#topics .postBody")?.textContent.replace(new RegExp("_src", 'g'), "src") as string;
        obj.time = dom.querySelector("#topics .postDesc #post-date")?.textContent as string;
        obj.editUrl = dom.querySelector("#topics .postDesc [rel='nofollow']")?.getAttribute("href") as string;
        //obj.fontNum = dom.find("#topics").find(".postBody").text().length;
        obj.readNum = parseInt(dom.querySelector("#post_view_count")?.textContent as string);
        obj.id = param.id;
        return obj;
    },

}