import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('imagemarkers.db');
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS markers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
	db.execAsync(
        `CREATE TABLE IF NOT EXISTS marker_images (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			marker_id INTEGER NOT NULL,
			uri TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
		);`
      );
	  console.log("DB is open");
    return db;
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
};

export { initDatabase };