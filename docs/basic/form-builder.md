# 表单

## 左右布局

在表单中需要左右布局，比如：左边是主布局，右边的是侧边栏的布局，可以使用下面的方式

```php
public static function form(Form $form): Form
{
    return $form
        ->schema([
            Section::make()
                ->schema([
                    // ...
                ])
                ->columnSpan(2), // [!code focus] // [!code ++]

            Section::make()
                ->schema([
                    // ...
                ])
                ->columnSpan(1) // [!code focus] // [!code ++]
        ])
        ->columns(3);// [!code focus] // [!code ++]
}
```

::: details 查看自定义布局效果

![custom section column](images/form-builder/custom-section-column.png)
:::

## 保存/取消按钮操作Sticky

当新增、编辑表单时，如果表单内容过多，可能会导致保存/取消按钮需要下拉很久才能看到，为此可以在对应的新增、编辑类中添加如下属性解决这个问题。

```php
<?php

namespace App\Filament\Resources\PostCategoryResource\Pages;

class EditPost extends EditRecord
{
    public static bool $formActionsAreSticky = true; // [!code ++]
}
```

::: details 查看效果
![sticky actions](images/form-builder/sticky-actions.png)
:::

## 字段宏 `macro`

如果在项目中使用的是 [filament/spatie-laravel-translatable-plugin](https://github.com/filamentphp/spatie-laravel-translatable-plugin)，可能想向用户展示哪些字段是可翻译的。

在对应字段上使用 `hint()` 和 `hintIcon()` 方法向用户显示哪些字段是可翻译的。

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

![form field macro](images/form-builder/form-field-macro.png)

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
  
## 禁用创建另一个

在使用 Filament 开发后台管理系统时，当创建一个资源时，默认会在创建页面或弹出层中显示两个按钮：

- `Create` (创建)
- `Create & Create Another` (创建并创建另一个)

![create actions](images/form-builder/create-actions.png)

有时可能只需要一个简单的创建按钮，不需要 "创建并创建另一个" 这个功能。

### 全局禁用 {#global-disable}

全局禁用可以通过两种方式实现：

- 使用 `disableCreateAnother()` 方法
- 使用 `hidden()` 方法隐藏

  选择其中一种即可。

  ```php
  use Filament\Resources\Pages\CreateRecord;
  use Filament\Actions\Action;

  # 选择下面的一种方法即可
  ## 1. 使用 `disableCreateAnother()` 方法
  CreateRecord::disableCreateAnother();

  ## 2. 使用 `hidden()` 方法隐藏
  Action::configureUsing(function (Action $action) {
      $action->hidden($action->getName() === 'createAnother');
  });
  ```

使用 `createAnother()` 方法可以在弹出层中禁用。

  ```php {5}
  use Filament\Actions\CreateAction;

  # 使用 `createAnother()` 方法禁用
  CreateAction::configureUsing(function (CreateAction $action): void {
      $action->createAnother(false);
  });
  ```

### 特定页面禁用

相比全局禁用，特定页面禁用更加灵活，可以针对某个页面进行禁用。

重写 `canCreateAnother()` 方法，返回 `false` 即可禁用。

```php
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    public static function canCreateAnother(): bool
    {
        return false;
    }
}
```

在弹出层 CreateAction 中，可以通过 `createAnother(false)` 方法禁用。

```php
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;

class ListPosts extends ListRecords
{
    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->createAnother(false) // 禁用 Create Another
                ->modalWidth('lg'), // 可选：设置弹出层宽度
        ];
    }
}
```

::: info 注意

- 全局禁用会影响所有资源的创建操作
- 在特定页面禁用只会影响该页面
- 弹出层中的禁用需要在每个弹出层操作中单独设置
- 关联表单中的禁用仅影响特定的关联创建操作
:::

## 禁用表单中的字段 `disabledOn()`

如果需要在新增 `create` 或编辑 `edit` 表单中禁用某个字段时可以使用 `disabledOn()` 方法。

::: code-group

```php [编辑时禁用]
public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name'),
            Forms\Components\TextInput::make('slug')
                ->disabledOn('edit') // [!code ++] 
                ->required(),
                // ...
        ]);
}
```

```php [新增时禁用]
Forms\Components\TextInput::make('slug')
    ->disabledOn('create') // [!code ++] 
    ->required(),
```

```php [新增和编辑时禁用]
Forms\Components\TextInput::make('slug')
    ->disabledOn(['create', 'edit']) // [!code ++] 
    ->required(),
```

:::

## 枚举类

<!-- markdownlint-disable MD013 -->
Filament 支持使用枚举类作为单选或下拉选项的选项，并且可以定义对应标签 [HasLabel](https://github.com/filamentphp/filament/blob/3.x/packages/support/src/Contracts/HasLabel.php)、颜色 [HasColor](https://github.com/filamentphp/filament/blob/3.x/packages/support/src/Contracts/HasColor.php)、图标 [HasIcon](https://github.com/filamentphp/filament/blob/3.x/packages/support/src/Contracts/HasIcon.php) 和描述 [HasDescription](https://github.com/filamentphp/filament/blob/3.x/packages/support/src/Contracts/HasDescription.php)，更多详情可以查看[官方文档](https://filamentphp.com/docs/3.x/support/enums)。
<!-- markdownlint-enable MD013 -->

::: code-group

```php [定义枚举类]
<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum Status: string implements HasColor, HasLabel, HasIcon
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Published = 'published';
    case Archived = 'archived';
    case Deleted = 'deleted';

    public function getColor(): string
    {
        return match ($this) {
            self::Draft => Color::Primary->value,
            self::Pending => Color::Info->value,
            self::Published => Color::Success->value,
            self::Archived => Color::Gray->value,
            self::Deleted => Color::Danger->value,
        };
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::Draft => __('enums/status.draft'),
            self::Pending => __('enums/status.pending'),
            self::Published => __('enums/status.published'),
            self::Archived => __('enums/status.archived'),
            self::Deleted => __('enums/status.deleted'),
        };
    }

    public function getIcon(): ?string
    {
        return match ($this) {
            self::Draft => 'heroicon-o-archive-box-arrow-down',
            self::Pending => 'heroicon-o-inbox',
            self::Published => 'heroicon-o-archive-box',
            self::Archived => 'heroicon-o-archive-box-x-mark',
            self::Deleted => 'heroicon-o-trash',
        };
    }

}
```

```php [Post 模型]
use App\Enums\Status;

protected function casts(): array
{
    return [
        'status' => Status::class,
    ];
}
```

```php [PostResource 资源类]
// 表单
public static function form(Form $form): Form
{
  return $form
    ->schema([
       Select::make('status')
          ->native(false)
          ->options(Status::class)
          ->label(__('posts.status_label'))
          ->helperText(__('posts.status_help'))
          ->default(Status::Draft->value),
    ]);
}

// 表格

public static function table(Table $table): Table
{
    return $table
      ->schema([
        TextColumn::make('status')
            ->label(__('posts.status_label'))
            ->disabledClick()
            ->badge(),
    ]);
}
```

:::

![enum status label icon and color](images/form-builder/enum-status-labe-icon-and-color.png)

## 字段添加加载指示器

在处理实时更新的 Filament 表单时，特别是在网络连接较慢的情况下，添加加载指示器可以显著提升用户体验。

```php
use Illuminate\Support\HtmlString;
use Illuminate\Support\Facades\Blade;

return $form
  ->schema([
    Select::make('user_id')
      ->native(false) // [!code focus]
      ->hint(new HtmlString( // [!code focus]
        Blade::render('<x-filament::loading-indicator class="h-5 w-5" wire:loading wire:target="data.user_id" />') // [!code focus]
      )) // [!code focus]
      ->live() // [!code focus]
    // ...
  ]);
```

::: info 代码解析

1. `->native(false)`: 禁用浏览器原生日期选择器，使用 Filament 的日期选择器组件
2. `->hint()`: 使用提示区域来放置加载指示器
3. `new HtmlString()`: 将 HTML 内容转换为可渲染的字符串
4. `Blade::render()`: 渲染 Blade 组件
5. `<x-filament::loading-indicator>`: Filament 内置的加载指示器组件
6. `wire:loading`: Livewire 指令，指示何时显示加载动画
7. `wire:target="data.date"`: 指定触发加载指示器的目标字段
8. `->live()`: 启用字段的实时更新功能
:::

![adding loading indicator to filament form field](./images/form-builder/adding-loading-indicator-to-filament-form-field.gif)

通过简单几行代码就能为 Filament 表单字段添加加载指示器，提供更好的用户体验。这个解决方案既优雅又实用，特别适合需要实时反馈的场景。

## 在标签中渲染 HTML

在字段 `label()` 中需要渲染 HTML（例如链接）的话可以返回 `HtmlString` 对象以便将 HTML 添加到字段标签。

```php
use Illuminate\Support\HtmlString;
 
Forms\Components\Checkbox::make('accept')
    ->label(fn() => new HtmlString('I accept the <a class="underline" href="/terms" target="_blank">terms and conditions</a>'))
    ->required()
```

![render html in label](images/form-builder/render-html-in-label.png)

## 下拉选项中渲染 HTML `allowHtml()`

Filament 默认的 Select 组件通过 `choice.js` 支持渲染带有 HTML 的选项。

> [!TIP] 提示
> 使用 `allowHtml()` 需要保证渲染的选项数据是安全的，否则可能带来 XSS 攻击。

### 简单用法

通过给选项标签添加HTML标签，可以在下拉选项选择时看到不同的选项文字颜色不同。

```php
use Filament\Forms;

Forms\Components\Select::make('technology')
  ->options([
      'tailwind' => '<span class="text-blue-500">Tailwind</span>',
      'alpine' => '<span class="text-green-500">Alpine</span>',
      'laravel' => '<span class="text-red-500">Laravel</span>',
      'livewire' => '<span class="text-pink-500">Livewire</span>',
  ])
  ->searchable()
  ->allowHtml(),
```

### 自定义选项布局

::: code-group

```php [资源中 Select 组件]
// app\Filament\Resources\PostResource
use App\Models\User;
use Filament\Forms;

// 1. 自定义表单组件
Forms\Components\Select::make('user_id')
    ->label('User')
    ->allowHtml()
    ->searchable()
    ->getSearchResultsUsing(function (string $search) {
        return User::query()
            ->where('name', 'like', "%{$search}%")
            ->limit(50)
            ->get()
            ->mapWithKeys(fn($user) => [$user->getKey() => static::getCleanOptionString($user)]);
    })
    ->getOptionLabelUsing(function ($value): string {
        return static::getCleanOptionString(User::query()->find($value));
    })
    ->required(),


// 2. 自定义渲染逻辑，返回自定义布局的视图
protected static function getCleanOptionString(User $user): string
{
    return view('filament.components.select-user-result')
        ->with('name', $user?->name)
        ->with('email', $user?->email)
        ->with('avatar_url', $user?->avatar_url)
        ->render();
}
```

```php [自定义布局视图]
// resources/views/filament/components/select-user-result.blade.php
<div class="flex rounded-md relative">
    <div class="flex">
        <div class="px-2 py-3">
            <div class="h-10 w-10">
                <img src="{{ $avatar_url }}" alt="{{ $name }}" role="img" class="h-full w-full rounded-full overflow-hidden shadow object-cover" />
            </div>
        </div>

        <div class="flex flex-col justify-center pl-3 py-2">
            <p class="text-sm font-bold pb-1">{{ $name }}</p>
            <div class="flex flex-col items-start">
                <p class="text-xs leading-5">{{ $email }}</p>
            </div>
        </div>
    </div>
</div>
```

```php [用户模型文件]
// app/Models/User.php
<?php

namespace App\Models;

// ...
class User extends Authenticatable
{
    // ...

    public function avatarUrl(): Attribute
    {
        return Attribute::get(fn() => Storage::url($this->avatar));
    }
}
```

:::

经过上面的定义后可以看到下拉组件的选项被修改为自定义的布局。

::: details 切换查看下拉效果
![allow html in select option labels](images/form-builder/allow-html-in-select-option-labels.png)
:::

## 编辑表单中的唯一记录

在编辑表单中，如果需要确保表单中只有一个记录，可以使用 `->unique()` 方法。

如果使用 `->unique()` 进行验证，请不要忘记忽略编辑表单中的当前记录。否则将在编辑表单中收到验证错误 `The [field] has already been taken.`。

```php
TextInput::make('name')
    ->required()
    ->unique(), // [!code --] 
    ->unique(ignoreRecord: true), // [!code ++]
```

## 关联关系自定义选项显示 `getOptionLabelFromRecordUsing()`

当在选择菜单或过滤器中使用关系并且该模型是可翻译的时，以下是获取可翻译属性的方法：

```php
Forms\Components\Select::make('roles')
  ->label(__('filament-shield::filament-shield.resource.label.role'))
  ->relationship('roles', 'name')
  ->getOptionLabelFromRecordUsing(
      fn (Forms\Components\Select $component, Model $record) => Role::tryFrom($record->name)?->getLabel()
  )
  ->multiple()
  ->preload()
  ->searchable(),
```

更多详情可以[查看这个 issue](https://github.com/filamentphp/filament/issues/11872#issuecomment-2002574212)。

## 密码字段加密和更新处理

在处理密码字段时，编辑密码字段和创建时密码字段的要求是不一样的，比如更新用户数据。

::: code-group

```php [密码字段]
use Filament\Forms\Components\TextInput;
 
TextInput::make('password')
    ->password()
```

```php [对字段进行哈希处理]
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Hash;
 
TextInput::make('password')
    // 密码字段，不明文显示输入
    ->password()
    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
```

```php [如果字段为空则不覆盖现有密码]
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Hash;
 
TextInput::make('password')
    ->password()
    // 如果字段不为空则加密字符串
    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
    // 如果字段为空则不覆盖现有密码
    ->dehydrated(fn ($state) => filled($state))
```

```php [资源创建时字段必须填写]
use Filament\Forms\Components\TextInput;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Hash;
 
TextInput::make('password')
    ->password()
    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
    // 当为空时则不提交当前字段
    ->dehydrated(fn ($state) => filled($state)) // [!code ++]
    // 编辑页面当前字段非必填
    ->required(fn (string $operation): bool => $operation === 'create') // [!code ++]
```

:::

## 将表单数据存储到 JSON 列 `statePath()`

在字段名使用'点'表示法将数据存储到 json 列。下面的示例中，货币代码、名称和符号将存储在货币列中：

```php
use Filament\Forms\Components\TextInput;
 
TextInput::make('payload.currency.code'),
TextInput::make('payload.currency.name'),
TextInput::make('payload.currency.symbol'),

// 模型添加转换属性
protected function casts(): array
{
    return [
        'payload' => 'json',
    ];
}
```

如果需要将布局组件中的所有数据存储到 json 列，还可以使用组件上的 `statePath()` 方法将所有数据范围限制到 json 列

```php
use Filament\Forms;

Forms\Components\Grid::make(1)
    ->statePath('payload.currency') // [!code ++] 
    ->schema([
        Forms\Components\TextInput::make('code'),
        Forms\Components\TextInput::make('name'),
        Forms\Components\TextInput::make('symbol'),
    ])
```

## 使用假数据填充表单

filament 中可以快速的填充假数据到表单。

::: details 点击查看 gif 动画效果
![fill form using fake data](images/form-builder/fill-form-using-fake-data.gif)
:::

<!-- markdownlint-disable MD013 -->
仅需要在资源类的 `Section` 中添加 `headerActions` 操作类，并编写假数据填充规则，当然也可以在[将操作添加到自定义表单组件](https://filamentphp.com/docs/3.x/forms/actions#adding-an-action-to-a-custom-form-component)，具体可以查看官方文档。
<!-- markdownlint-enable MD013 -->

```php
<?php

use Filament\Forms\Components\Actions\Action;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Section::make()
                ->key('basic')
                ->schema([
                      TextInput::make('name')
                          ->required()
                          ->reactive()
                          ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state))),

                      TextInput::make('slug')
                          ->disabled()
                          ->dehydrated()
                          ->required()
                          ->unique(Post::class, 'slug', fn($record) => $record),

                      MarkdownEditor::make('body')
                          ->required(),

                      DatePicker::make('published_at')
                          ->native(false)
                          ->label('Published Date'),
                ])
                ->headerActions([
                    Action::make('fillForm') // [!code focus] // [!code ++]
                        ->label('Fill Form') // [!code focus] // [!code ++]
                        ->icon('heroicon-o-sparkles') // [!code focus] // [!code ++]
                        ->color('success') // [!code focus] // [!code ++]
                        ->link() // [!code focus] // [!code ++]
                        ->tooltip('Quickly fill form data') // [!code focus] // [!code ++]
                        ->action(function (Get $get, Set $set, Page $livewire) { // [!code focus] // [!code ++]
                            $set('name', fake()->sentence(3)); // [!code focus] // [!code ++]
                            $set('slug', str($get('name'))->slug()); // [!code focus] // [!code ++]
                            $set('body', fake()->paragraphs(2, 10)); // [!code focus] // [!code ++]
                            $set('published_at', fake()->dateTimeBetween('-10 days', '+3 days')); // [!code focus] // [!code ++]
                            $livewire->form->getState(); // [!code focus] // [!code ++]
                        })->visible(fn () => app()->environment('local')), // [!code focus] // [!code ++]
                ]),
        ]);
}
```

## 保存表单操作前添加确认提示

重写对应方法可以添加 `requiresConfirmation()` 方法对保存表单时添加确认提示：

::: details 点击查看 gif 动画效果
![add confirm when handle form save action](images/form-builder/add-confirm-when-handle-form-save-action.gif)
:::

```php
<?php

namespace App\Filament\Resources\PostResource\Pages;

use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    protected function getCreateFormAction(): Action
    {
        return parent::getCreateFormAction()
            ->submit(null) // [!code ++]
            ->requiresConfirmation()// [!code ++]
            ->modalHeading('保存')// [!code ++]
            ->modalDescription('您确定要这样操作吗?')// [!code ++]
            ->action(function () {// [!code ++]
                $this->closeActionModal();// [!code ++]
                $this->create();// [!code ++]
            });// [!code ++]
    }
}
```

## 全选下拉列表中选项

当有一个带有多选选项的下拉选择时，可以添加提示操作 `hintAction` 来轻松的一次选择所有选项。

![select all hit action](images/form-builder/select-all-hit-action.png)

```php
public static function form(Form $form): Form
{
    return $form
        ->schema([
            Select::make('user_id') // [!code ++]
                ->label('User') // [!code ++]
                ->multiple() // [!code ++]
                ->options(User::pluck('name', 'id')) // [!code ++]
                ->hintAction(fn(Select $component) => \Filament\Forms\Components\Actions\Action::make('Select all') // [!code ++]
                    ->action(fn(Select $component) => $component->state(array_keys($component->getOptions()))) // [!code ++]
                ) // [!code ++]
            ,
        ]);
}
```

也可以使用 `hintActions` 方法同时添加 "Remove all" 的操作。

```php
use Forms\Components\Select;
use Filament\Forms\Components\Actions\Action;

public static function form(Form $form): Form
{
    return $form
        ->schema([
                Select::make('user_id')
                    ->label('User')
                    ->multiple()
                    ->options(User::pluck('name', 'id'))
                    ->live() // [!code focus] // [!code ++]
                    ->hintActions([ // [!code focus] // [!code ++]
                        Action::make('Remove all') // [!code focus] // [!code ++]
                            ->visible(fn(Select $component) => $component->getState() !== []) // [!code focus] // [!code ++]
                            ->action(fn(Select $component) => $component->state([])), // [!code focus] // [!code ++]

                        Action::make('Select all') // [!code focus] // [!code ++]
                            ->visible(fn(Select $component) => count($component->getState()) < count($component->getOptions())) // [!code focus] // [!code ++]
                            ->action(fn(Select $component) => $component->state(array_keys($component->getOptions()))), // [!code focus] // [!code ++]
                    ]), // [!code focus]
        ]);
}
```

或者将上面的逻辑提取到 `AppServiceProvider` 的 `register` 方法中给 `Select` 组件添加 `selectAllHintActions` 宏。

:::code-group

```php [定义 selectAllHintActions 宏]
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Actions\Action;

Select::macro('selectAllHintActions', function () {
    /** @var Filament\Forms\Components\Select $this */
    return $this->hintActions([
        Action::make('select_all')
            ->label(__('Select All'))
            ->visible(fn(Select $component) => count($component->getState()) < count($component->getOptions()))
            ->action(fn (Select $component) => $component->state(
                array_keys($component->getOptions())
            )),
        Action::make('remove_all')
            ->label(__('Remove All'))
            ->visible(fn(Select $component) => $component->getState() !== [])
            ->action(
                fn (\Filament\Forms\Set $set, Select $component) => $set($component->getName(), []),
            ),
    ]);
});
```

```php [使用 selectAllHintActions 宏]
use Forms\Components\Select;
use Filament\Forms\Components\Actions\Action;

public static function form(Form $form): Form
{
    return $form
        ->schema([
                Select::make('user_id')
                    ->label('User')
                    ->multiple()
                    ->options(User::pluck('name', 'id'))
                    ->live() // [!code focus] // [!code ++]
                    ->selectAllHintActions() // [!code focus] // [!code ++]
        ]);
}
```

:::

## 修改文件上传预览文件的布局

<!-- markdownlint-disable MD013 -->
Filament 使用 [FilePond](https://pqina.nl/filepond/docs/api/instance/properties/#styles) 作为默认的文件上传插件，当需要上传多张图片/文件时，默认的布局是每张图片/每个文件单独占用一行的空间，可以通过下面的配置修改这种布局方式。
<!-- markdownlint-enable MD013 -->

```php
return $form
      ->schema([
            Forms\Components\FileUpload::make('cover')
                ->panelLayout('grid')  // [!code ++]
      ]);
```

::: details 修改前
![default file upload panel layout](images/form-builder/default-file-upload-panel-layout.png)
:::

::: details 修改后
![using grid panel layout to file uplaod](images/form-builder/using-grid-panel-layout-to-file-upload.png)
:::

## 自定义表单事件

Filament 提供了一些表单事件，表单可以分派和监听事件，从而实现前端和后端的通信，这些事件可以在组件视图中分派，然后由组件的类监听。

下面以一个常见的例子来说明自定义表单事件的用法。

![custom form event](images/form-builder/custom-form-event.gif)

::: code-group

```php [Form 组件]
use Filament\Forms\Components\Textarea;

Textarea::make('host_issue')
    ->helperText(view('filament.tables.assets.host_issue_helper_text'))
    ->registerListeners([ // [!code ++]
        'replace::host-issue' => // [!code ++]
            function (Component $component, string $statePath): void { // [!code ++]
                $component->state($statePath); // [!code ++]
            }, // [!code ++]
        ], // [!code ++]
    ]), // [!code ++]
```

```php [自定义视图]
// resources/views/filament/tables/assets/host_issue_helper_text.blade.php
<span class="flex space-x-0.5">
    <x-filament::badge 
        wire:click="dispatchFormEvent('replace::host-issue', 'Black screen')" // [!code ++]
        class="cursor-pointer">
        Black screen
    </x-filament::badge>
    <x-filament::badge 
        wire:click="dispatchFormEvent('replace::host-issue', 'Another reason')" // [!code ++]
        class="cursor-pointer">
        Another reason
    </x-filament::badge>
</span>
```
:::

1. 在表单组件中使用 `registerListeners()` 方法注册自定义事件。

2. 在视图中使用 `dispatchFormEvent()` 触发表单自定义事件。
