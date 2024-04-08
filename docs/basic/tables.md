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