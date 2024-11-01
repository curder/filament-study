import {defineConfig} from 'vitepress'

export default defineConfig({
    lang: "zh-CN",
    base: "/filament-study/",
    title: "Filament PHP Study",
    description: "Record some experience of using filament php panel.",
    lastUpdated: true,
    themeConfig: {
        search: {
            provider: 'local'
        },
        logo: "",
        siteTitle: "Filament PHP",
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
            pattern: "https://github.com/curder/filament-study/edit/master/docs/:path",
            text: '编辑它'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/curder/filament-study'}
        ],
        nav: nav(),
        sidebar: {
            "/basic": sidebarBasic(),
        }
    }
});


function nav() {
    return [
        {text: "基础", link: "/basic/customize-panel", activeMatch: "/basic/"},
    ];
}

function sidebarBasic() {
    return [
        {
            text: '',
            items: [
                {text: "面板 Panel Builder", link: "/basic/customize-panel"},
                {text: "表单 Form Builder", link: "/basic/form-builder"},
                {text: "表格 Tables", link: "/basic/tables"},
                {text: "详情 Infolists", link: "/basic/infolists"},
                {text: "操作 Actions", link: "/basic/actions"},
                {text: "小组件 Widgets", link: "/basic/widgets"},
                {text: "其他 Others", link: "/basic/others"},
                {text: "插件推荐 Plugins", link: "/basic/recommended-plugins"},
                {text: "开源项目 Projects", link: "/basic/open-source-projects"},
            ]
        },
    ];
}