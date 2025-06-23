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



## 自定义配色 `colors()` {#custom-colors}

1. 通过 `colors` 方法指定具体配色，它们默认来自 [tailwind 自定义颜色](https://tailwindcss.com/docs/customizing-colors)。

    ```php
    use Filament\Panel;
    use Filament\Support\Colors\Color;

    public function panel(Panel $panel): Panel
    {
        return $panel
            // ...
            ->colors([
              'danger' => Color::Red,
              'gray' => Color::Slate,
              'info' => Color::Blue,
              'primary' => Color::Blue,
              'success' => Color::Green,
              'warning' => Color::Amber,
            ]);
    }
    ```

2. 使用非 Tailwind 提供的颜色

    - 通过以 oklch 格式传递从 50 到 950 的色调数组来使用 Tailwind CSS 调色板中未包含的自定义颜色

   ```php
    use Filament\Support\Facades\FilamentColor;

    public function boot()
    {
        FilamentColor::register([
            'primary' => [
                50 => 'oklch(0.969 0.015 12.422)',
                100 => 'oklch(0.941 0.03 12.58)',
                200 => 'oklch(0.892 0.058 10.001)',
                300 => 'oklch(0.81 0.117 11.638)',
                400 => 'oklch(0.712 0.194 13.428)',
                500 => 'oklch(0.645 0.246 16.439)',
                600 => 'oklch(0.586 0.253 17.585)',
                700 => 'oklch(0.514 0.222 16.935)',
                800 => 'oklch(0.455 0.188 13.697)',
                900 => 'oklch(0.41 0.159 10.272)',
                950 => 'oklch(0.271 0.105 12.094)',
            ],
        ]);
    }
   ```

    - 从十六进制代码生成自定义颜色 `Color::hex()`

   ```php
   use Filament\Support\Colors\Color;
   use Filament\Support\Facades\FilamentColor;

   FilamentColor::register([
       'primary' => '#6366f1',
   ]);
   ```

    - 从 RGB 值生成自定义颜色 `Color::rgb()`

   ```php
   use Filament\Support\Colors\Color;
   use Filament\Support\Facades\FilamentColor;

   FilamentColor::register([
       'primary' => 'rgb(99, 102, 241)',
   ]);
   ```

3. 使用 `rgb` 方式

```php
use Filament\Panel;
use Filament\Support\Colors\Color;

public function panel(Panel $panel): Panel
{
   return $panel
       // ...
       ->colors([
         'primary' => '#6366f1',
         'danger' => 'rgb(99, 102, 241)',
       ]);
}
```

## 自定义字体 `font()` {#custom-fonts}

默认情况下，Filament 使用的是 [Inter](https://fonts.google.com/specimen/Inter) 字体。可以使用 `font()` 方法更改默认设置。

```php
use Filament\Panel;
 
public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->font('JetBrains Mono');
}
```

所有 [Google 字体](https://fonts.google.com/) 都可以使用。

默认使用 [Bunny Fonts CDN](https://fonts.bunny.net/) 用于提供字体。也可以使用 `font()` 方法的 `provider` 参数自定义字体提供者。

```php
use Filament\FontProviders\GoogleFontProvider;

$panel->font('Inter', provider: GoogleFontProvider::class)
```

或者，使用 `LocalFontProvider` 从本地样式表提供字体：

```php
use Filament\FontProviders\LocalFontProvider;

$panel->font(
    'Inter',
    url: asset('css/fonts.css'),
    provider: LocalFontProvider::class,
)
```

## 在视图中使用 Tailwind CSS 类 {#custom-classes-in-views}

即使 Filament 使用 Tailwind CSS 来编译框架，它也没有设置为自动扫描在项目中使用的任何 Tailwind 类，因此这些类不会包含在编译的 CSS 中。

要在项目中使用 Tailwind CSS 类，您需要设置一个[自定义主题](#custom-theme)来自定义面板中的已编译 CSS 文件。在主题的 `theme.css` 文件中，会发现两行：

```css
@source '../../../../app/Filament';
@source '../../../../resources/views/filament';
```

这 2 行告诉 Tailwind 扫描 `app/Filament` 和 `resources/views/filament` 目录，查找在项目中使用的任何 Tailwind 类。

可以在此处添加任何其他要扫描 Tailwind 类的目录。

## 禁用黑暗模式 `darkMode()` {#disabling-dark-mode}

要禁用黑暗模式切换，可以使用 `darkMode()` 方法进行配置。

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->darkMode(false);
}
```

## 更改默认主题模式 `defaultThemeMode()` {#changing-the-default-theme-mode}

默认情况下，Filament 使用用户的系统主题作为默认模式。

例如，如果用户的计算机处于黑暗模式，Filament 将默认使用黑暗模式。

如果用户更改计算机模式，Filament 中的系统模式是被动的。

如果想改变默认模式以强制亮模式或暗模式，使用 `defaultThemeMode()` 方法，传递 `ThemeMode::Light` 或 `ThemeMode::Dark`。

```php
use Filament\Panel;
use Filament\Enums\ThemeMode;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->defaultThemeMode(ThemeMode::Light);
}
```

## 添加Logo `brandLogo()` {#adding-a-logo}

默认情况下，Filament 使用应用名称来呈现简单的基于文本的徽标。

如果想简单地更改徽标中使用的文本，可以使用 `brandName()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandName('Filament');
}
```

要呈现图像，可以将 URL 传递给 `brandLogo()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(asset('images/logo.svg'));
}
```

或者，可以直接将 HTML 传递给 `brandLogo()` 方法以呈现内联 SVG 元素，例如：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(fn () => view('filament.admin.logo'));
}
```

如果黑暗模式下的Logo需要特殊处理，可以使用 `darkModeBrandLogo()` 方法。

使用 `brandLogoHeight()` 法自定义呈现徽标的高度：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(fn () => view('filament.admin.logo'))
        ->brandLogoHeight('2rem');
}
```

## 自定义 favicon `favicon()` {#customizing-the-favicon}

要添加一个自定义的 `favicon`，可以使用 `favicon()` 方法，将图标文件的 URL 传递给它。

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->favicon(asset('images/favicon.png'));
}
```