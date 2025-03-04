import React, { useContext, useEffect, useState } from 'react';
import {  } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { StyleSheet, View, Alert, Text } from 'react-native';
import {Marker} from 'react-native-maps'
import {
  createStaticNavigation,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { readFileSync, writeFileSync } from 'fs';
import {MarkerData, RegionNavigation } from '../types'
import { useDatabase } from '@/contexts/DatabaseContext';
import { DatabaseContext } from "@/contexts/DatabaseContext";

const initialRegion: RegionNavigation = {
	latitude: 58,
	longitude: 56,
	latitudeDelta: 0.422,
	longitudeDelta: 0.421,
}

const coords: MarkerData = []

export default function Index() {
  const { isLoading, error, addMarker, getMarkers, deleteMarker } = useDatabase();
  const navigation = useNavigation();
  const [myMarkerCoords, setMyMarkerCoords] = React.useState(coords);

	useFocusEffect(
	  React.useCallback(() => {
		setMyMarkerCoords([]);
		const fetchMarkers = async () => {
		  const db_markers = await getMarkers();		  
		  if (db_markers.length > 0) {
			setMyMarkerCoords(db_markers);
		  }
		};
		fetchMarkers();
	  }, [getMarkers])
	);
 
  
  const onMapPress = async (e) => {
    e.persist();	
	if (!e || !e.nativeEvent || !e.nativeEvent.coordinate) {
        console.error('Событие или координаты не определены');
        return;
    }
	
	try {
      const coord_id = await addMarker(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
      const coordinate = {
        latitude: Number(e.nativeEvent.coordinate.latitude.toFixed(3)),
        longitude: Number(e.nativeEvent.coordinate.longitude.toFixed(3)),
        id: coord_id[0].id
      };
      setMyMarkerCoords(prevMarkerCoords => [...prevMarkerCoords, coordinate]);

    } catch (error) {
      console.error('Ошибка добавления маркера:', error);
    }
}  
  
  const onMarkerPress = (e) => {
		const {coordinate} = e.nativeEvent;
		const marker = myMarkerCoords.find(marker => 
			marker.latitude === coordinate.latitude && 
			marker.longitude === coordinate.longitude
		  );
	    if (marker) {
	  	  navigation.navigate('about', { marker });
	    } else {
		  alert("Проблемы с поиском маркера");
	    }
  }; 
  
  
  const handleMapError = (errorMsg) => {
    Alert.alert("Ошибка", errorMsg);
  };
  
  const markers = myMarkerCoords.map((coord, index) => (
	<Marker
		key={index}
		coordinate={coord}
		onPress={onMarkerPress}
	/>
	));
  
  return (
    <View style={styles.container}>
	  <MapView
		onPress = {onMapPress}
		initialRegion={initialRegion}
		style={styles.map}
		onError={(e) => handleMapError("Ошибка при загрузке карты")}>
			{markers}		
	  </MapView>	  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});