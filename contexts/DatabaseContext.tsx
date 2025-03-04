import * as SQLite from 'expo-sqlite';
import { DatabaseContextType } from '../types';
import React, { createContext, useContext, useEffect, useState } from 'react';

const db_link = 'imagemarkers.db';

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === null) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};


export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<Error | null>();
  const [db, setDb] = useState<any>(null);
  
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync(db_link);
        setDb(database);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeDatabase();
  }, []);
  
  
  const dropdbs = async () : Promise<void> => {
		console.log("delete it!");
		res = await SQLite.deleteDatabaseAsync(db_link);
		console.log(res);
  }
  
 const addMarker = async (latitude: number, longitude: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.runAsync('INSERT INTO markers (latitude, longitude) VALUES (?, ?)', latitude, longitude)
            .then(async (result) => {
                console.log('Маркер успешно добавлен');
                const fetchIdQuery = 'SELECT id FROM markers WHERE latitude = ? AND longitude = ?';
                try {
                    const fetchedId = await db.getAllAsync(fetchIdQuery, latitude, longitude);
                    resolve(fetchedId);
                } catch (error) {
                    console.error('Ошибка выборки ID:', error);
                    reject(error);
                }
            })
            .catch(error => {
                console.error('Ошибка вставки маркера:', error);
                reject(error);
            });
    });
};
 

  const getMarkers = (): Promise<Marker[]> => {
    return new Promise((resolve, reject) => {
      db.getAllAsync('SELECT id, latitude, longitude FROM markers')
        .then(allMarkers => {
          console.log(allMarkers);
          resolve(allMarkers);
        })
        .catch(error => {
          console.error('Error getting markers:', error);
          reject(error);
        });
    });
  };

const deleteMarker = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        Promise.all([
            db.runAsync('DELETE FROM marker_images WHERE marker_id = ?', id),
            db.runAsync('DELETE FROM markers WHERE id = ?', id)
        ]).then(([im_mark_del_result, mark_del_result]) => {
            if (mark_del_result.changes > 0) {
                console.log(`Маркер с id ${id} был успешно удален.`);
            } else {
                console.log(`Маркер с id ${id} не найден. Ничего не удалено.`);
            }
			
			if (im_mark_del_result > 0) {
				console.log(`Картинка с маркером ${id} была успешно удалена.`);
            } else {
                console.log(`Картинка с маркером ${id} не найдена`);
            }
            resolve();
        }).catch(error => {
            console.error('Ошибка при удалении маркера:', error);
            reject(error);
        });
    });
};
  
  const addImage = (markerId: number, uri: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.runAsync('INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)', markerId, uri)
      .then(result => {
        console.log(result);
        resolve();
      })
      .catch(error => {
        console.error('Error adding image:', error);
        reject(error); 
      });
    });
  };

  
  const getMarkerImages = (markerId: number): Promise<MarkerImage[]> => {
  return new Promise((resolve, reject) => {
    db.getAllAsync('SELECT marker_id, id, uri FROM marker_images where marker_id = ?', markerId)
      .then(allImages => {
        console.log("getMarkerImage", allImages);
        resolve(allImages);
      })
      .catch(error => {
        console.error('Error getting marker images:', error);
        reject(error);
      });
  });
};

	const deleteImage = (id: number): Promise<void> => {
	  return new Promise((resolve, reject) => {
		db.runAsync('DELETE FROM marker_images WHERE id = ?', id)
		  .then(im_del_result => {
			console.log(im_del_result);
			resolve();
		  })
		  .catch(error => {
			console.error('Error deleting image:', error);
			reject(error);
		  });
	  });
	};

  const contextValue: DatabaseContextType = {
    // Common
	isLoading,
    error,
    // Marker
    addMarker,
    getMarkers,
    deleteMarker,
    // Image
    addImage,
    getMarkerImages,
    deleteImage,
	dropdbs
  };
  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};