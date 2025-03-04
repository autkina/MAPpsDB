//данные маркера
interface MarkerData {
	latitude: number;
	longitude: number;
	id: number;
}


//данные изображений
interface PhotoData {
	id: string;
	uri: string;
}

//параметры навигации
interface RegionNavigation {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

//параметры базы данных
export interface DatabaseContextType {
	addMarker: (latitude: number, longitude: number) => Promise<number>;
	dropdbs: () => Promise<void>;
	deleteMarker: (id: number) => Promise<void>;
	getMarkers: () => Promise<Marker[]>;
	addImage: (markerId: number, uri: string) => Promise<void>;
	deleteImage: (id: number) => Promise<void>;
	getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
	isLoading: boolean;
	error: Error | null;
}

export { MarkerData, PhotoData, RegionNavigation, DatabaseContextType };