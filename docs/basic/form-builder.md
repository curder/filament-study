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

## 自定义选择搜索逻辑 `getSearchResultsUsing()`

使用 `getSearchResultsUsing()` 方法自定义“选择”下拉列表以搜索所需的任何自定义逻辑。

- 选择搜索框中键入内容后通过姓名、电子邮件或电话搜索客户

    ```php
    use App\Models\User;
    use App\Models\Role;

    Forms\Components\Select::make('user_id')
        ->searchable()
        ->getSearchResultsUsing(function (string $search): array {
            return User::query()
                ->whereAny(['name', 'email', 'phone'] 'like', "%${search}%")
                ->where('role_id', Role::CUSTOMER)
                ->limit(50)
                ->get()
                ->mapWithKeys(
                    fn (User $customer) => [$customer->id => $customer->name]
                )
                ->toArray();
        })
    ```
  
- 发送外部HTTP请求

  ```php
  use Illuminate\Support\Facades\Http;

  Forms\Components\Select::make('city')
      ->searchable()
      ->getSearchResultsUsing(function (?string $search) {
          if (! filled($search)) {
              return [];
          }

          return Http::get('https://restcountries.com/v3.1/name/'.$search)
              ->collect('*.name')
              ->mapWithKeys(fn ($item) => [$item['common'] => $item['official']])
              ->toArray();
      }),
  ```
