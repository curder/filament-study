# 表单

## 字段宏 `macro`

如果在项目中使用的是 [filament/spatie-laravel-translatable-plugin](https://github.com/filamentphp/spatie-laravel-translatable-plugin)，可能想向用户展示哪些字段是可翻译的。


在对应字段上使用 `hint()` 和 ` hintIcon()` 方法向用户显示哪些字段是可翻译的。

```php
<?php

use Filament\Forms\Components\TextInput;

// before
TextInput::make('name')
         ->hint('Translatable')
         ->hintIcon('heroicon-m-language');

// after
TextInput::make('name')
    ->translatable(); // [!code ++]
```

![](images/form-builder/form-field-macro.png)

如果项目中有很多类似的翻译需求，也可以在 `Filament\Forms\Components\Field` 类上创建一个 `translatable` 宏。

```php
<?php

namespace App\Providers\Filament;

use Filament\Forms\Components\Field;

class AdminPanelServiceProvider extends PanelProvider
{
    // ...
    public function boot()
    {
        Field::macro('translatable', function () { // [!code ++]
            return $this->hint('Translatable') // [!code ++]
                ->hintIcon('heroicon-m-language'); // [!code ++]
        }); // [!code ++]
    }
}
```