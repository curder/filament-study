# 其他 {#others}

## 线上优化 {#optimization}

为了[优化 Filament](https://filamentphp.com/docs/panels/installation#optimizing-filament-for-production) 以用于生产环境，应该在部署脚本中运行以下命令开启图标缓存：

::: code-group

```shell [优化命令]
php artisan filament:optimize
```

```yaml [deployer/deployer - deploy.yaml]
# ...

tasks:
  deploy:rsync:
    - deploy:release
    - rsync
    - deploy:shared
    - deploy:vendors
    - deploy:writable
    - artisan:storage:link
    - artisan:view:cache
    - artisan:config:cache
    - artisan:optimize
    - artisan:filament:optimize // [!code ++]
    - artisan:migrate
    - deploy:publish
    - php-fpm:reload
  artisan:filament:optimize: // [!code ++]
    - desc: 'Optimizing Filament for production to improving performance' // [!code ++]
    - cd: '{{release_path}}' // [!code ++]
    - run: '{{bin/php}} artisan filament:optimize' // [!code ++]
  yarn:run:prod:
    - desc: 'Running yarn run prod to build assets'
    - cd: '{{release_path}}'
    - run: '{{bin/yarn}} build'
  php-fpm:reload:
    - desc: 'Reloading php-fpm'
    - run: 'sudo /sbin/service {{php_fpm_service}} reload'

after:
  deploy:failed: deploy:unlock
```

:::

## 引入更多 SVG 图标 {#more-svg-icons}

Filament 默认使用 [Heroicons](https://heroicons.com/) 图标库中的图标。如果需要更多的 SVG 图标，可以使用 Blade Icons 包来引入其他图标库的图标。

[Blade Icons](https://blade-ui-kit.com/blade-icons) 生态中包含大量 SVG 图标，Filament 也可以通过 Blade 组件名称使用这些图标。

要在 Filament 中使用这些图标，请按照以下步骤操作：

1. 选择并安装图标包。例如，如果想安装 [Tabler Icons](https://github.com/secondnetwork/blade-tabler-icons) 图标包，可以使用 Composer 安装：

    ```shell
    composer require secondnetwork/blade-tabler-icons
    ```

    安装完成后，按照图标包的文档进行配置。通常情况下，图标包会自动注册 Blade 组件，因此不需要额外配置。

2. 在 Filament 或视图中使用新的图标。

    ::: code-group
    ```php [Filament 导航图标]
    protected static ?string $navigationIcon = 'tabler-book';
    ```

    ```php [Filament 替换默认图标]
    use Filament\Support\Facades\FilamentIcon;

    // https://filamentphp.com/docs/3.x/support/icons#available-icon-aliases
    FilamentIcon::register([
        'panels::topbar.global-search.field' => 'tabler-search',
        'panels::sidebar.group.collapse-button' => 'tabler-chevron-down',
        // ...
    ]);
    ```

    ```html [视图]
    <x-tabler-book />
    ```
    :::

   在 Filament 3 中，凡是接受图标名称的位置都可以使用 Blade Icons 的图标名，例如 `->icon()`、`->prefixIcon()`、`->suffixIcon()`、
   `->hintIcon()`、`->modalIcon()`、`->descriptionIcon()` 等。

   ::: code-group
   ```php [页面 Header Action]
   use Filament\Actions\Action;

   protected function getHeaderActions(): array
   {
       return [
           Action::make('create')
               ->url(route('posts.create'))
               ->icon('tabler-plus'), // [!code ++]
       ];
   }
   ```

   ```php [表格 Action]
   use Filament\Tables\Actions\Action;

   Action::make('edit')
       ->icon('tabler-pencil'); // [!code ++]
   ```

   ```php [表单 Action]
   use Filament\Forms\Components\Actions\Action;
   use Filament\Forms\Set;

   Action::make('generatePassword')
       ->icon('tabler-key') // [!code ++]
       ->action(function (Set $set) {
           // ...
       });
   ```

   ```php [表单字段图标]
   use Filament\Forms\Components\TextInput;

   TextInput::make('email')
       ->prefixIcon('tabler-mail') // [!code ++]
       ->suffixIcon('tabler-check') // [!code ++]
       ->hintIcon('tabler-info-circle');
   ```

   ```php [Action 弹窗图标]
   use Filament\Actions\Action;

   Action::make('delete')
       ->requiresConfirmation()
       ->icon('tabler-trash') // [!code ++]
       ->modalIcon('tabler-alert-triangle');
   ```

   ```php [统计描述图标]
   use Filament\Widgets\StatsOverviewWidget\Stat;

   Stat::make('Orders', '120')
       ->description('New orders')
       ->descriptionIcon('tabler-shopping-cart'); // [!code ++]
   ```
   :::

:::warning 请注意
如果你没有运行 `php artisan filament:optimize`，请在生产环境中单独运行以下命令缓存图标：

`php artisan icons:cache`
:::
