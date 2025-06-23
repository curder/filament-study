# 其他

## 线上优化

为了[优化 Filament](https://filamentphp.com/docs/panels/installation#optimizing-filament-for-production) 以用于生产环境，应该在部署脚本中运行以下命令开启图标缓存：

::: code-group

```shell [优化命令]
php artisan filament:optimize
```

```yaml [deployer/deployer - deploy.yaml]
# ...

tasks:
  deploy:rsync:
    - deploy:release
    - rsync
    - deploy:shared
    - deploy:vendors
    - deploy:writable
    - artisan:storage:link
    - artisan:view:cache
    - artisan:config:cache
    - artisan:optimize
    - artisan:filament:optimize // [!code ++]
    - artisan:migrate
    - deploy:publish
    - php-fpm:reload
  artisan:filament:optimize: // [!code ++]
    - desc: 'Optimizing Filament for production to improving performance' // [!code ++]
    - cd: '{{release_path}}' // [!code ++]
    - run: '{{bin/php}} artisan filament:optimize' // [!code ++]
  yarn:run:prod:
    - desc: 'Running yarn run prod to build assets'
    - cd: '{{release_path}}'
    - run: '{{bin/yarn}} build'
  php-fpm:reload:
    - desc: 'Reloading php-fpm'
    - run: 'sudo /sbin/service {{php_fpm_service}} reload'

after:
  deploy:failed: deploy:unlock
```

:::
