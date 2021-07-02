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

Перейдите в папку с проектом

```bash
cd <имя проекта>
```

Удалите папку в `.git`

```bash
rm -R ./git
```

Установите пакеты для разработки

```bash
yarn # или npm i
```

По желанию исправьте данные в package.json

```json
{
	"name": "<имя проекта>",
	"version": "<версия>"
}
```

разрабатывайте

```javascript
await new Coding().go();
```

### Команды

Запуск сервера в режиме разработки

```bash
yarn start
```

Запуск сервера в продакшн режиме

```bash
yarn build
```

Форматирование и проверка кода

```bash
yarn lint # поверка JavaScript, TypeScript и Vue
yarn stylelint # форматирование стилей
yarn htmlhint # форматирование html
yarn prettier # форматирование кода
yarn beautifier # запуск всех команд для форматирования
```

Генерация svg спрайта

```bash
yarn svg-sprite
```

Анализ размера сборки

```bash
yarn analyzer
```

Публикация на Github Pages

```bash
yarn deploy
```

Альтернативный синтаксис

```bash
npm run <script>
```
