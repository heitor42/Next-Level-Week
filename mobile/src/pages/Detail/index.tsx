import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, DatePickerAndroid, Linking } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icons, FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import ipa from '../../services/api';
import api from '../../services/api';

interface RouteParams {
  point_id: number;
};

interface PointData {
  point: {
    id: number;
    img: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };

  items: {
    title: string
  }[];
};

const Detail = () => {
  const navigate = useNavigation();
  const route = useRoute();

  const [data, setData] = useState<PointData>({} as PointData)

  const routeParams = route.params as RouteParams;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data)
    });
  }, []);

  function handleNavigateToPoints() {
    navigate.goBack()
  };

  function handleComposeMail(){
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [data.point.email],

    });
  };

  function handleWhatapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coleta de residuos do seu estabelecemento`)
  };

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateToPoints}>
          <Icons name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.point.img }} />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatapp}>
            <FontAwesome name="whatsapp" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={handleComposeMail}>
            <Icons name="mail" size={20} color="#FFF" />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;