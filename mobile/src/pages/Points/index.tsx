import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { SvgUri } from 'react-native-svg';
import { Feather as Icon } from '@expo/vector-icons';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface PointsList {
  id: number;
  name: string;
  img: string;
  latitude: number;
  longitude: number;
}

interface Param {
  uf: string;
  city: string;
}

const Points = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const routParam = route.params as Param;

  const [points, setPoints] = useState<PointsList[]>([])
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  useEffect(() =>{
    async function loadPosition() {

      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        setInitialPosition([-23.5421559, -46.6204115])
        Alert.alert('Ooooops...', 'Precisamos de sua permissão para obter a sua localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('points', {
      params: {
        city: routParam.city,
        uf: routParam.uf,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data)
    })
  }, [selectedItems]);

  function handleNavigationToHome() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectItem(id: number) {
    const alrearySelected = selectedItems.findIndex(item => item === id);

    if (alrearySelected >= 0) {
        const filteredItems = selectedItems.filter(item => item !== id);

        setSelectedItems(filteredItems);
    } else {
        setSelectedItems([ ...selectedItems, id]);
    }
}

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigationToHome}>
        <Icon name='arrow-left' size={20} color='#34CB79' />
      </TouchableOpacity>

      <Text style={styles.title}>Bem vindos!</Text>
      <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>


      <View style={styles.mapContainer}>
        { initialPosition[0] !== 0 && (
          <MapView
          style={styles.map}
          //loadingEnabled={initialPosition[0] === 0}
          initialRegion={{
            latitude: initialPosition[0],
            longitude: initialPosition[1],
            latitudeDelta: 0.014,
            longitudeDelta: 0.014,
          }}
        >

          {points.map(point => (
            <Marker
            key={point.id}
            style={styles.mapMarker}
            onPress={() =>{handleNavigateToDetail(point.id)}}
            coordinate={{
              latitude:  point.latitude,
              longitude: point.longitude
            }}
          >
            <View style={styles.mapMarkerContainer}>
              <Image style={styles.mapMarkerImage} source={{ uri: point.img}} />

              <Text style={styles.mapMarkerTitle}>{point.name}</Text>
            </View>
          </Marker>
          ))}
        </MapView>
        ) }
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        //contentContainerStyle={{ paddingHorizontal: 20 }}
        >

          {items.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]} 
              activeOpacity={0.6}
              onPress={() => handleSelectItem(item.id)}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
          <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;