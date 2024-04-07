# 操作

## 发送自定义事件

在 Livewire 中使用 `$dispatch()` 方法来发送自定义时间，达到不同组件通讯的目的。

在实际项目也有类似的需求，比如一个资源列表的删除操作执行后，需要向小组件发送一个事件，来更新小组件的数据。

```php
// app\Filament\Resources\UserResource\Pages\UserResource.php

->actions([
    // ...
    Tables\Actions\DeleteAction::make()
        ->after(function (Pages\ManageUsers $livewire) {
            $livewire->dispatch('refreshUserOverview');
        }),
])
```

然后在用户的小组件 `OverviewWidget` 中添加事件监听器。

```php
// app\Filament\Resources\UserResource\Widgets\UserOverview.php

protected function getListeners(): array
{
    return [
        'refreshUserOverview' => '$refresh',
    ];
}
```

项目源代码[点击这里查看](https://github.com/curder/filament-widget-refresh-demo)。