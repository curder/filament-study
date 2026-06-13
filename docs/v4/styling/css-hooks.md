# CSS 钩子 {#css-hooks}

[CSS Hooks](https://filamentphp.com/docs/4.x/styling/css-hooks) 是 Filament 框架中用于定制用户界面样式的一种机制。

它们是一组以 `fi-` 为前缀的 CSS 类，设计目的是让开发者能够轻松地针对 Filament UI 中的特定元素应用自定义样式。

这种方法提供了一种标准化的方式来覆盖默认样式，无需深入修改 Filament 的内部 CSS 结构，从而简化了个性化界面设计的流程。

Filament 是一个基于 Laravel 的管理面板框架，结合 Livewire 和 Alpine.js 构建，其样式高度依赖 CSS。

通过 CSS Hooks，开发者可以快速调整组件的外观，例如侧边栏、按钮、表格等。

要查找可用的 CSS Hooks，可以使用浏览器的开发者工具检查 Filament UI 元素的 HTML 结构。

这些钩子类通常以 `fi-` 开头，出现在类列表中，便于识别和使用。

以下是基于文档内容整理的使用 CSS Hooks 应用样式的具体示例：

## 定义侧边栏样式 {#custom-sidebar-styles}

```css
/* ./resources/css/admin/theme.css */
.fi-sidebar {
    @apply bg-[#fafafa] dark:bg-[#000];
}
```

此规则将侧边栏的背景颜色设置为浅灰色，在暗模式下，将背景颜色设置为黑色，可以根据需要修改成需要的颜色。

## 定义主内容区域样式 {#custom-main-content-styles}

```css
/* ./resources/css/admin/theme.css */
.fi-main-ctn {
    @apply bg-[#fff] dark:bg-[#111];
}
```

此规则将主内容区域的背景颜色设置为白色，在暗模式下，将背景颜色设置为深灰色，根据需要修改成需要的颜色。

## 侧边栏收起样式 {#custom-collapsed-sidebar-styles}

在 `AdminPanelServiceProvider` 中使用 `sidebarCollapsibleOnDesktop()` 方法来启用桌面端的侧边栏收起功能：

```php
use Filament\Panel;
class AdminPanelProvider extends PanelProvider
{
  public function panel(Panel $panel): Panel
  {
    return $panel
        ->topbar(false) // [!code ++]
        ->sidebarCollapsibleOnDesktop(); //[!code ++]
  }
}
```

配置好后，默认情况下，收起操作按钮会显示在站点Logo的左侧，可以通过CSS调整到站点Logo的右侧：

```css
/* ./resources/css/admin/theme.css */
.fi-sidebar-header {
    @apply flex-row-reverse;
}

/* 关闭按钮默认隐藏状态 */
.fi-sidebar-close-collapse-sidebar-btn {
    @apply hidden;
}

/* 鼠标悬浮到左侧按钮处展示关闭按钮 */
.fi-sidebar:hover .fi-sidebar-close-collapse-sidebar-btn {
    @apply inline-flex;
}
```



## 调整按钮样式 {#custom-button-styles}

若想为 Filament 中的按钮添加圆角效果，可以使用以下 CSS：

```css
.fi-btn {
    @apply rounded-2xl; /* 16px */
}
```

这将使所有使用 `.fi-btn` 类的按钮具有圆润的边角。

## 修改表格行样式 {#custom-table-row-styles}

要调整表格行的样式，例如更改悬停时的背景颜色，可以使用：

```css
.fi-ta-row:hover {
    background-color: #e0f7fa;
}
```

这会在鼠标悬停时将表格行的背景变为浅蓝色。
