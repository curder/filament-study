# 安装

::: warning ⚠️ 请注意️
当前 Filament V4 版本处于测试阶段，并不稳定，在测试期间，版本可能会引入突破性的更改。
:::

Filament 需要依赖以下版本的软件才能运行：

- PHP 8.2 +
- Laravel v11.28 +
- Tailwind CSS v4.0 +

## 安装 Panel Builder {#installation-panel-builder}

由于 Filament v4 处于测试阶段，因此在安装任何软件包之前，需要将 `composer.json` 文件中的最低稳定性设置为测试版。

```shell
composer config minimum-stability beta
```

或者修改 `composer.json` 中的 `minimum-stability`：

```json
{
  "minimum-stability": "beta"
}
```

通过在 Laravel 项目目录中运行以下命令来安装 Panel Builder:

```shell
composer require filament/filament:"^4.0"

php artisan filament:install --panels
```

## 创建新用户 {#make-filament-user}

使用以下命令创建新的用户登陆帐户：

```shell
php artisan make:filament-user
```

在 Web 浏览器中打开 /admin，登录并开始构建的应用。

## 生产环境 {#production-environment}

### 1. 允许用户访问面板 {#user-can-access-panel}

默认情况下，所有用户模型都可以本地访问 Filament。

但是，当部署到生产环境或运行单元测试时，必须更新 `App\Models\User` 以实现 `FilamentUser` 接口。

并在模型中实现 `canAccessPanel` 方法，确保只有正确的用户才能访问面板：

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser
{
    // ...

    public function canAccessPanel(Panel $panel): bool
    {
        return str_ends_with($this->email, '@yourdomain.com') && $this->hasVerifiedEmail();
    }
}
```

### 2. 优化面板性能 {#optimize-panel-performance}

要针对生产环境优化 Filament，应在部署脚本中运行以下命令：

```shell
php artisan filament:optimize
```

这个命令是命令 `php artisan filament:cache-components` 和 `php artisan icons：cache` 的简写。

要立即清除缓存，可以运行：

```shell
php artisan filament:optimize-clear
```

### 3. 优化 Laravel 应用 {#optimize-laravel-app}

还应该考虑通过在部署脚本种优化 Laravel 应用程序。

```shell
php artisan optimize
```

这将缓存配置文件、事件、路由和视图。
