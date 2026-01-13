import {DefaultTheme, defineConfig} from 'vitepress'
import {v3, v4} from './sidebars'

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
            "/v3": v3,
            "/v4": v4,
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
