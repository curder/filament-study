# Infolists

## 渲染 HTML

### 标签 `label()`

在字段 `label()` 中需要渲染 HTML（例如链接）的话可以返回 `HtmlString` 对象以便将 HTML 添加到字段标签。

```php
use Filament\Infolists;
use Illuminate\Support\HtmlString;
 
Infolists\Components\TextEntry::make('name')
    ->label(fn() => new HtmlString('<span style="color: red;">Name</span>'))
```

### 渲染内容

#### `html()` 方法

如果列的内容是 HTML，可以使用 `html()` 方法呈现它：

```php
use Filament\Infolists;
use Illuminate\Support\HtmlString;
 
Infolists\Components\TextEntry::make('name')
    ->html()
```

> HTML 将在呈现之前对任何潜在的不安全内容进行清理。

#### `formatStateUsing()` 方法

- 通过返回 `\Illuminate\Support\HtmlString` 实例

    ```php
    use Filament\Infolists;
    use Illuminate\Support\HtmlString;

    Infolists\Columns\TextEntry::make('name')
        ->formatStateUsing(fn (string $state): HtmlString => new HtmlString($state)) 
    ```
  
- 通过返回 `\Illuminate\Contracts\View\View` 实例

```php
use Filament\Infolists;
use Illuminate\Contracts\View\View;
 
Infolists\Columns\TextEntry::make('name')
    ->formatStateUsing(fn (string $state): View => view( 
        'filament.infolists.columns.name-content', 
        ['state' => $state], 
    )) 
```
