# 自定义样式

## 自定义主题 {#custom-theme}

Filament 允许您通过编译自定义样式表来替换默认样式表，从而更改用于呈现 UI 的 CSS，这种自定义样式表称为“主题”。

要为面板创建自定义主题，可以使用 `php artisan make:filament-theme` 命令：

```shell
# 指定使用 yarn 构建主题
php artisan make:filament-theme --pm=yarn

# 如果存在多个后台可以添加参数指定自定义主题的名称
php artisan make:filament-theme admin
```

`--pm` 指定编译的工具，默认是 `npm`，如果使用 `yarn` 则需要添加 `--pm=yarn` 参数。

该命令将在目录中创建一个 CSS 文件 `/resources/css/filament` 和 Tailwind 配置文件，然后可以通过编辑这些文件来自定义主题。

它还将为您提供有关如何编译主题并将其注册到 Filament 中的说明。**请按照命令中的说明完成设置过程**：

```text
⇂ First, add a new item to the `input` array of `vite.config.js`: `resources/css/filament/admin/theme.css`
⇂ Next, register the theme in the admin panel provider using `->viteTheme('resources/css/filament/admin/theme.css')`
⇂ Finally, run `npm run build` to compile the theme
```

1. 添加新项到 `vite.config.js` 的 `input` 数组中：`resources/css/filament/admin/theme.css`
2. 在 `AdminPanelProvider` 中使用 `->viteTheme('resources/css/filament/admin/theme.css')` 注册主题
3. 运行 `npm run build` 或者 `yarn build` 编译主题

::: tip **注意**
请参考命令查看需要注册的确切文件名，它们可能不是 `admin/theme.css`。
:::

