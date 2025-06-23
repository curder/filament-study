import {DefaultTheme, defineConfig} from 'vitepress'

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
            "/v3": sidebarV3(),
            "/v4": sidebarV4(),
        }
    }
});


function nav(): DefaultTheme.NavItem[] {
    return [
        {text: "安装", link: "/v4/installation", activeMatch: "/v4/installation"},
        {
            text: "",
            items: [
                {text: "v4.x", link: "/v4/installation", activeMatch: "/v4/"},
                {text: "v3.x", link: "/v3/customize-panel", activeMatch: "/v3/"},
            ]
        },
    ];
}

function sidebarV3() {
    return [
        {
            text: '',
            items: [
                {text: "面板 Panel Builder", link: "/v3/customize-panel"},
                {text: "表单 Form Builder", link: "/v3/form-builder"},
                {text: "表格 Tables", link: "/v3/tables"},
                {text: "详情 Infolists", link: "/v3/infolists"},
                {text: "操作 Actions", link: "/v3/actions"},
                {text: "小组件 Widgets", link: "/v3/widgets"},
                {text: "其他 Others", link: "/v3/others"},
                {text: "插件推荐 Plugins", link: "/v3/recommended-plugins"},
                {text: "开源项目 Projects", link: "/v3/open-source-projects"},
            ]
        },
    ];
}

function sidebarV4() {
    return [
        {
            text: "",
            items: [
                {text: "安装 Installation", link: "/v4/installation"},
            ]
        },
        {
            text: "自定义样式 Styling",
            items: [
                {text: "概述", link: "/v4/styling/overview"},
            ]
        }
    ];
}
