import type { Sidebar } from './types';

const sidebar: Sidebar = [
    {
        text: "",
        items: [
            {text: "安装 Installation", link: "/v4/installation"},
            {text: "面板 Panel Builder", link: "/v4/panel-builder"},
            {text: "表格 Tables", link: "/v4/tables"},
            {text: "插件推荐 Plugins", link: "/v4/recommended-plugins"},
        ]
    },
    {
        text: "自定义样式 Styling",
        items: [
            {text: "概述", link: "/v4/styling/overview"},
            {text: "CSS 钩子", link: "/v4/styling/css-hooks"},
        ]
    }
];

export default sidebar;
