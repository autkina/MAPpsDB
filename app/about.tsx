import { Text, View, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Button from '@/components/Button';
import {PhotoData} from '@/types'
import { useDatabase } from '@/contexts/DatabaseContext';
import { initDatabase } from '@/database/schema';
const mphotos: PhotoData[] = [];


export default function AboutScreen() {
  const route = useRoute();
  const { marker } = route.params;
  const navigation = useNavigation();
  const [photoGroups, setPhotoGroups] = React.useState<PhotoData[]>(mphotos);
  const { isLoading, error, addImage, getMarkerImages, deleteImage, deleteMarker, dropdbs } = useDatabase();

  console.log("Enter the photos");
  useFocusEffect(
	  React.useCallback(() => {
		console.log("Search for the error");
		setPhotoGroups([]);
		const fetchMPhotos = async () => {
		 try {
		   const db_photos = await getMarkerImages(marker.id);
		   const formattedPhotos: PhotoData[] = db_photos.map(photo => ({
			 id: photo.id,
			 uri: photo.uri,
		   }));
		   console.log("formattedPhotos", formattedPhotos);
		   setPhotoGroups(formattedPhotos);
		 } catch (error) {
		   console.error('Error fetching photos:', error);
		 }
	   };
	   fetchMPhotos();
	  }, [getMarkerImages])
	); 
	
	
	const deleteDB = () => {
		console.log("удаляем базу");
		dropdbs();
		initDatabase();
	}
	
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
		await addImage(marker.id, result.assets[0].uri);
        const newPhoto = {
		  id: photoGroup.length + 1,
		  uri: result.assets[0].uri,
		};
		setPhotoGroups((prevImages) => [...prevImages, newPhoto]);
    } else {
      alert('Изображение не было выбрано.');
    }
  };

    const deletePhoto = (id: string, uri: string) => {
      setPhotoGroups((prevGroups) => {
      return prevGroups.map(group => {
        if (group.id === id) {
		  deleteImage(id);
          return { ...group, uri: null, };
        }
        return group;
        });
      });
    };
	
		
	const deleteMarkerImage = (marker_id: number) => {
		deleteMarker(marker_id);
		navigation.navigate('index');
	}
	
	const renderGroupItem = ({ item }: { item: PhotoData }) => (
	  <View style={styles.groupContainer}>
		<Pressable onLongPress={() => deletePhoto(item.id, item.uri)}>
		  <Image source={{ uri: item.uri }} style={styles.image} />
		</Pressable>
	  </View>
	);

  return (
    <View style={styles.container}>
	  <Text style={styles.text}>вы здесь: lat {Number(marker.latitude.toFixed(3))}, long {Number(marker.longitude.toFixed(3))} </Text>
      <Button label="Выбрать фото" onPress={pickImageAsync} />
	  <FlatList
		  data={photoGroups}
		  renderItem={renderGroupItem}
		  keyExtractor={(item) => item.id}
		  style={styles.groupList}
	  />
      <Button label="Вернуться к картам" onPress={() => navigation.navigate('index')} />
	  <Button label="Удалить маркер" onPress={() => deleteMarkerImage(marker.id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#544e68',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
	marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    margin: 2,
  },
  groupList: {
    marginTop: 20,
	flexGrow: 1,
    width: '100%',
  },
  groupContainer: {
    alignItems: 'center',
  },
});