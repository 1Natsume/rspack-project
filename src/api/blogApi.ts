import { webScraper } from '@/utils/webScraper';
import { Archive, Pager, Comment } from '@/types/blog/types';
import { apiService } from '@/request/api.service';

const extractNumbers = (str: string): number[] => {
    const numbers: number[] = [];
    const regex = /\d+\.?\d*/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
        numbers.push(parseFloat(match[0]));
    }

    return numbers;
};

export const blogApi = {
    GetCategoryList: async (page: number = 1) => {
        let data: Archive[] = []
        let pager: Pager = {
            current: page,
            pages: []
        }
        const dom = await webScraper.scrapeHtml('/newjersey?page=' + page);
        pager.pages = extractNumbers(dom.querySelector('#homepage_bottom_pager .pager')?.textContent as string)
        const multipleResults = await webScraper.extractDatas(dom, '.forFlow .day');

        multipleResults?.forEach(el => {
            el.querySelector(".dayTitle a")?.textContent.trim();
            var ar = el.querySelectorAll('.postTitle')
            if (ar.length > 1) {
                ar.forEach((item, index) => {
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
                    a.title = item.querySelector("a span")?.textContent.trim().replace("[置顶]", "").replace(" [置顶]", "") as string;
                    let postDesc = el.querySelectorAll(".postDesc")[index].textContent;
                    a.editUrl = item.querySelector("a")?.getAttribute("href")?.trim().replace('https://www.cnblogs.com', '') as string;
                    // el.querySelector(".postCon .c_b_p_desc a")?.remove();
                    // a.isTop = el.classList.contains('pinned')
                    // a.desc = el.querySelector(".postCon .c_b_p_desc")?.textContent.replace('\n摘要：        \n', '') as string;
                    if (el.querySelectorAll(".desc_img")[index]) {
                        a.imgUrl = 'https://images.weserv.nl/?url=' + el.querySelectorAll(".desc_img")[index]?.attributes[0].value;
                    }
                    let idArr = a.editUrl.split("/");
                    a.id = parseInt(idArr[idArr.length - 1].replace(".html", ""));

                    if (postDesc) {
                        a.readNum = parseInt(postDesc.split("\n")[2].replace("阅读(", "").replace(")", "").trim());
                        a.commentNum = parseInt(postDesc.split("\n")[3].replace("评论(", "").replace(")", ""));
                        a.recommendNum = parseInt(postDesc.split("\n")[4].replace("推荐(", "").replace(")", ""));
                    }

                    data.push(a)
                })
            }
            else {
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
                a.title = el.querySelector(".postTitle a span")?.textContent.trim().replace("[置顶]", "").replace(" [置顶]", "") as string;
                let postDesc = el.querySelector(".postDesc")?.textContent;
                a.editUrl = el.querySelector(".postTitle a")?.getAttribute("href")?.trim().replace('https://www.cnblogs.com', '') as string;
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
            }

        })

        let res = {
            data,
            pager
        }
        return res
    },
    blogFollow: async () => {
        let res = await apiService.post(
            "/" + 'newjersey' + "/ajax/Follow/FollowBlogger.aspx", { blogUserGuid: 'c74cdce3-551f-4ab1-dbb7-08d9c527a5cc' }
        );
        if (res) return true
    },
    GetArticle: async (param: Archive) => {
        const dom = await webScraper.scrapeHtml(param.editUrl);
        let obj: Archive = {
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
        obj.comments = blogApi.GetCommentList(dom)
        return obj;
    },
    GetCommentList: (dom: Document) => {
        let data: Comment[] = []
        dom.querySelectorAll(".feedbackItem").forEach((v, i) => {
            console.log(v)
            let obj: Comment = {
                id: 0,
                date: '',
                author: '',
                desc: ''
            };
            obj.id = parseInt(v.querySelector("[class='layer']")?.getAttribute("href")?.replace("#", "") as string);
            // obj.level = $(v).find(".layer").html();
            // obj.label = $(v).find(".louzhu").html() || "";
            obj.date = $(v).find(".comment_date").html();
            obj.author = $(v).find("[id^='a_comment_author_']").text();
            // obj.authorUrl = $(v).find("[id^='a_comment_author_']").attr("href");
            // obj.desc = $(v).find("[id^='comment_body_']").html().replace(new RegExp("_src", 'g'), "src").trim();
            // obj.digg = $(v).find(".comment_digg").length >= 1 ? $(v).find(".comment_digg").html().trim().replace("支持(", "").replace(")", "") : undefined;
            // obj.burry = $(v).find(".comment_burry").length >= 1 ? $(v).find(".comment_burry").html().trim().replace("反对(", "").replace(")", "") : undefined;
            // obj.avatarUrl = ($(v).find("[id^='comment_'][id$='_avatar']").html() || "").trim();
            // obj.avatarHdUrl = (($(v).find("[id^='comment_'][id$='_avatar']").html() || "").trim()).replace("face", "avatar");
            // obj.replayBtn = $(v).find("[onclick^='return ReplyComment']").length > 0;
            // obj.quoteBtn = $(v).find("[onclick^='return QuoteComment']").length > 0;
            // obj.delBtn = $(v).find("[onclick^='return DelComment']").length > 0;
            // obj.updateBtn = $(v).find("[onclick^='return GetCommentBody']").length > 0;
            data.push(obj);
        });
        return data
    },

}
