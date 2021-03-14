# Стартовая конфигурация Webpack

Webpack Starter - Простой инструментарий веб-разработки с использованием Webpack. Подходит для создания статических HTML-шаблонов, разработки тем `Wordpress`, `Laravel` и frontend проекта.

### Возможности

- Современный и продвинутый `JavaScript`;
- Поддержка фреймворков `Vue` и `React`;
- Расширенная типизация с `TypeScript`;
- Поддержка шаблонизатора `Pug`;
- Делает код красивее с `Stylelint`, `Prettier`, `Eslint`;
- Оптимизация всех ресурсов для более быстрой загрузки страницы.

### Старт

Клонируйте репозиторий

```bash
git clone https://github.com/TakNePoidet/webpack-starter.git <имя проекта>
```

перейдите в папку с проктом

```bash
cd <имя проекта>
```

удалите папку в `.git`

```bash
rm -R ./git
```

установите пакеты для разработки

```bash
yarn # или npm i
```

Разработывайте

```javascript
await new Coding().go();
```

### Команды

запуск сервера в режиме разработки

```bash
yarn start
```

запуск сервера в продакшен режиме

```bash
yarn build
```

форматирование и проверка кода

```bash
yarn lint # поверка JavaScript, TypeScript и Vue
yarn stylelint # форматирование стилей
yarn htmlhint # форматирование html
yarn prettier # форматирование кода
yarn beautifier # запуск всех команд для форматирования
```

генерация svg спрайта

```bash
yarn svg-sprite
```

анализ размера сборки

```bash
yarn analyzer
```

публикация на Github Pages

```bash
yarn deploy
```

альтернативный синтаксис

```bash
npm run <script>
```
