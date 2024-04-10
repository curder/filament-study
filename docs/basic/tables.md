# 表格

## 自定义表格点击行URL `recordUrl()`

默认表格行点击的跳转地址是编辑页面，使用 `recordUrl()` 方法可以自定义表格点击行时跳转的 URL。

::: code-group
```php [跳转到编辑页]
use Illuminate\Database\Eloquent\Model;

public static function table(Table $table): Table
{
    return $table
        // ...
        ->recordUrl(fn (Model $record) => Pages\EditPost::getUrl([$record])),
}
```

```php [跳转到详情页]
use Illuminate\Database\Eloquent\Model;

public static function table(Table $table): Table
{
    return $table
        // ...
        ->recordUrl(fn (Model $record) => Pages\ViewPost::getUrl([$record])),
}
```

:::

也可以返回空字符串或 `null`，这样点击表格行时没有任何反应。

## 表格行操作仅显示图标

如果认为表格操作相关的编辑或删除等操作占用了表格太多空间，可以通过配置 `label('')`，仅显示图标来缩短它。

```php
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;

 public static function table(Table $table): Table
    {
        return $table
            // ...
            ->actions([
                EditAction::make()->label(''),
                DeleteAction::make()->label(''),
                // ...
            ]);
```

## 格式化输出 `formatStateUsing()`

有些需求下需要将多个数据库字段合并到一个表列中，可以通过使用 `->formatStateUsing()` 方法来完成这个操作。

```php
Tables\Columns\TextColumn::make('user.full_name')
    ->label('Customer Name')
    ->formatStateUsing(
        fn ($state, Order $order) => $order->user->first_name . ' ' . $order->user->last_name
    ),
```


## 渲染 HTML

### 标签 `label()`

在字段 `label()` 中需要渲染 HTML（例如链接）的话可以返回 `HtmlString` 对象以便将 HTML 添加到字段标签。

```php
use Filament\Tables;
use Illuminate\Support\HtmlString;
 
Tables\Components\TextColumn::make('name')
    ->label(fn() => new HtmlString('<span style="color: red;">Name</span>'))
```

### 渲染内容
#### `html()` 方法

如果列的内容是 HTML，可以使用 `html()` 方法呈现它：

```php
use Filament\Tables;
 
TextColumn::make('description')
    ->html() // [!code ++]
```

> HTML 将在呈现之前对任何潜在的不安全内容进行清理。

#### `formatStateUsing()` 方法

- 通过返回 `\Illuminate\Support\HtmlString` 实例

    ```php
    use Filament\Tables;
    use Illuminate\Support\HtmlString;

    Tables\Columns\TextColumn::make('name')
        ->formatStateUsing(fn (string $state): HtmlString => new HtmlString($state)) // [!code ++]
    ```

- 通过返回 `\Illuminate\Contracts\View\View` 实例
 
    ```php
    use Filament\Tables;
    use Illuminate\Contracts\View\View;
     
    Tables\Columns\TextColumn::make('name')
        ->formatStateUsing(fn (string $state): View => view( // [!code ++]
            'filament.tables.columns.name-content', // [!code ++]
            ['state' => $state], // [!code ++]
        )) // [!code ++]
    ```



## 删除记录时删除附件

当用户删除记录时，Filament 不会删除资源对应所上传的文件。

可以在 DeleteAction 操作的 `after()` 方法中编写对应逻辑：

```php
Actions\DeleteAction::make()
    ->after(function (YourModel $record) {
        // delete single
        if ($record->photo) {
            Storage::disk('public')->delete($record->photo);
        }
        // delete multiple
        if ($record->galery) {
            foreach ($record->galery as $ph) Storage::disk('public')->delete($ph);
        }
    })
```