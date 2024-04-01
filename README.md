# Итоговая работа "Банк"

## Установка и настройка проекта
1. Для запуска данного проекта вам понадобится nodejs и npm.  
2. Склонируйте данный репозиторий к себе на диск.

3. Для начала установите все зависимости для бэкенд. Перейдите в папку `js-advanced-diploma\js-advanced-diploma`. и выполните команду `npm install`.

`cd js-advanced-diploma\js-advanced-diploma\ npm install`.

4. Затем установите все зависимости для сборки приложения. Из корня приложения перейдите в папку `js-advanced-diploma\client` и выполните команду `npm install`.

`cd js-advanced-diploma\client\ npm install`

5. Откройте файл `webpack.config.js`. Найдите строчку:

```js
externals: {
      ymaps3: ['https://api-maps.yandex.ru/v3/?apikey=YOUR_ARI_KEY&lang=ru_RU', 'ymaps3']
  },
```

Вместо `YOUR_API_KEY` вставьте свой API ключ яндекс карт.

## Запуск приложения

1. Для запуска сервера откройте терминал, перейдите в папку `js-advanced-diploma\js-advanced-diploma` и введите команду `npm start`.

`cd js-advanced-diploma\js-advanced-diploma\ npm start`

2. Для запуска приложения в режиме разработки, перейдите в папку `js-advanced-diploma\client` из корня приложения и запустите комнаду `npm run dev`.

`cd js-advanced-diploma\client\ npm run dev`

Приложение автоматически запуститься в вашем браузере по умолчанию.

## Команды npm

1. `npm run dev` - Запускает приложение  врежиме разработки.
2. `npm run build` - Запускает сборку приложения.
3. `npm run cypress:open` - Запускает e2e тесты.

