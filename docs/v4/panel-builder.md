# 面板 Panel Builder {#panel-builder}

如果在面板中使用到了导航组，可以考虑使用枚举来配置不同的分组。

::: code-group
```php [定义导航组枚举]
<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Icons\Heroicon;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Illuminate\Contracts\Support\Htmlable;

enum NavigationGroupEnum implements HasIcon, HasLabel
{
    case ProjectManagement;
    case UserManagement;

    public function getIcon(): string|BackedEnum|null
    {
        return match ($this) {
            self::ProjectManagement => Heroicon::Cog6Tooth,
            self::UserManagement => Heroicon::User,
        };
    }

    public function getLabel(): string|Htmlable|null
    {
        return match ($this) {
            self::ProjectManagement => __('navigations.project_management'),
            self::UserManagement => __('navigations.user_management'),
        };
    }
}
```

```php [UserResource 使用]
// App\Filament\Resources\UserResource.php
use App\Enums\NavigationGroupEnum;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    //    protected static string|BackedEnum|null $navigationIcon = Heroicon::Users;
    protected static string|UnitEnum|null $navigationGroup = NavigationGroupEnum::UserManagement;
    // ...
}

```
```php [ProjectResource 使用]
// App\Filament\Resources\ProjectResource.php
use App\Enums\NavigationGroupEnum;

class ProjectResource extends Resource
{
    protected static ?string $model = User::class;

    //    protected static string|BackedEnum|null $navigationIcon = Heroicon::Bars3;
    protected static string|UnitEnum|null $navigationGroup = NavigationGroupEnum::ProjectManagement;
    // ...
}
```
:::

使用枚举优势如下：

- 在一个地方 `NavigationGroupEnum` 管理导航组
- 通过实现 `HasLabel` 接口将导航组翻译成多种语言
- 通过实现 `HasIcon` 接口来管理图标
- 只需改变枚举的顺序即可轻松更改组的排序
    ```php
    // App\Providers\Filament\AdminPanelProvider.php
    use App\Enums\NavigationGroupEnum;
  
    public function panel(Panel $panel): Panel
    {
        return $panel
                ->navigationGroups(NavigationGroupEnum::class);
    }
    ```
