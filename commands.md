# Filament 相关命令

## 基础

```php
# 创建模型资源
php artisan make:filament-resource UserResource -G -S
```

## 自定义

```shell
# 创建自定义表单字段
php artisan make:form-field ColorPicker

# 创建自定义表单布局
php artisan make:form-layout Section

# 创建自定义信息列表条目
php artisan make:infolist-entry ColorEntry

# 创建自定义信息布局
php artisan make:infolist-layout Section

# 创建自定义表格列
php artisan make:table-column ColorColumn
```
