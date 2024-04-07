import {defineConfig} from 'vitepress'

export default defineConfig({
    lang: "zh-CN",
    base: "/filament-study/",
    title: "Filament Panel Study",
    description: "Record some experience of using filament php panel.",
    lastUpdated: true,
    themeConfig: {
        logo: "",
        siteTitle: "代码片段",
        outline: {
            label: "章节导航",
            level: 'deep',
        },
        lastUpdated: {
            text: '最后更新时间'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        editLink: {
            pattern: "https://github.com/curder/code-snippets/edit/master/docs/:path",
            text: '编辑它'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/curder/code-snippets'}
        ],
        nav: nav(),
        sidebar: {
            "/guide": sidebarGuide(),
        }
    }
});


function nav()
{
    return [
        //
    ];
}

function sidebarGuide()
{
    return [
        //
    ];
}