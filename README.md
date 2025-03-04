# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```
## Документация схемы базы данных

Проект использует SQLite для хранения данных. Схема базы данных включает две таблицы:

### Таблица markers:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT): Уникальный идентификатор метки.
- latitude (REAL, NOT NULL): Широта метки на карте.
- longitude (REAL, NOT NULL): Долгота метки на карте.
- created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP): Дата и время создания метки.

### Таблица marker_images:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT): Уникальный идентификатор изображения метки.
- marker_id (INTEGER, NOT NULL): Идентификатор метки, к которой относится изображение (внешний ключ на markers).
- uri (TEXT, NOT NULL): URI изображения метки.
- created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP): Дата и время создания записи о изображении.

## Описание подхода к обработке ошибок

В данном проекте используется стандартный подход к обработке ошибок в TypeScript. Операции с базой данных обёрнуты в блоки try...catch, что позволяет ловить и логировать ошибки, возникающие во время инициализации базы данных или выполнения запросов. Например, если инициализация базы данных не удалась, ошибка выводится в консоль, а затем выбрасывается дальше для обработки на более высоком уровне.

try {
  const db = await SQLite.openDatabaseAsync('imagemarkers.db');
  // операции с базой данных
} catch (error) {
  console.error('Ошибка инициализации базы данных:', error);
}