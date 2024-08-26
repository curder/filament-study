# 小组件 Widgets

## 添加过滤参数 `tableFilters`

生成URL时添加过滤条件。

::: code-group

```php [StatsOverview.php]
Stat::make('Open Issues', $openIssuesCount)
    ->url(ListUsers::getUrl([
        'tableFilters' => [ // [!code ++]
            'status' => [ // [!code ++]
                'value' => 'open', // [!code ++]
            ] // [!code ++]
        ] // [!code ++]
    ]))->description("There are {$openIssuesCount} open issues"),
```

```php [AdminPanelProvider.php]
use App\Filament\Widgets\StatsOverview;

return $panel->widgets([
    StatsOverview::class, // [!code ++]
    Widgets\AccountWidget::class,
    Widgets\FilamentInfoWidget::class,
])
```

```php [ListIssues.php]
use App\Filament\Widgets\StatsOverview;

protected function getHeaderWidgets(): array
{
    return [
        StatsOverview::class, // [!code ++]
    ];
}
```

:::

此时，在对应的资源类上添加对应的过滤器。

```php
// IssueResource.php

$table
    // ...
    ->filters([
        SelectFilter::make('status') // [!code ++]
            ->options(IssueStatus::class), // [!code ++]
    ])
```