import React from 'react'
import { WebView } from 'react-native-webview';
import UrlBase from '../middleware/UrlBase';
import { StyleSheet,ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { View } from '../components/Themed';
export default function Grafica() {
    return (
        <View style={{ height:500 }}>
        <WebView 
             originWhitelist={['*']}
             style={styles.container}
              source={{ uri:UrlBase }}
              
            />
            </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
  });