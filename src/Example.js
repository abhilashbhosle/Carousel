import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {API_KEY} from '../config';

export default function Example() {
  const {width, height} = Dimensions.get('screen');
  const [activeIndx, setActiveIdx] = useState(0);
  const API_URL =
    'https://api.pexels.com/v1/search?query=furniture&per_page=5&page=5';
  const [images, setImages] = useState(null);
  const ref = useRef();

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(API_URL, {
          headers: {
            Authorization: API_KEY,
          },
        });
        let data = await response.json();
        setImages(data.photos);
      } catch (error) {
        throw error;
      }
    })();
  }, []);
  const renderItem = ({item}) => {
    return (
      <View style={{width: width, padding: 10,position:'relative'}}>
        <Image
          source={{uri: item.src.portrait}}
          style={{
            height: height / 2,
            marginTop: 10,
            resizeMode: 'cover',
            borderRadius: 10,
          }}
        />
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btntxt}>Buy now</Text>
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    let timer = setInterval(() => {
      activeIndx < images?.length - 1
        ? setActiveIdx(prev => prev + 1)
        : setActiveIdx(0);
    }, 2000);
    return () => clearInterval(timer);
  });
  useEffect(() => {
    // ====SETTING IMAGES WITH RESPECT TO ACTIVE INDEX=========//
    ref.current.scrollToOffset({
      offset: activeIndx * width,
      animated: true,
    });
  }, [activeIndx]);
  const setActiveValues = activeVal => setActiveIdx(activeVal);
  return (
    <SafeAreaView style={styles.container}>
      {/* =====TOP FLATLIST TO DISPLAY IMAGES =====*/}
      <FlatList
        ref={ref}
        keyExtractor={item => item.id.toString()}
        data={images}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={ev => {
          setActiveValues(ev.nativeEvent.contentOffset.x / width);
        }}
      />
      {/* =====BOTTOM FLATLIST TO DISPLAY INDICATORS =====*/}
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={images}
        renderItem={({item, index}) => (
          <View
            style={{
              height: 12,
              width: activeIndx === index ? 20 : 12,
              borderRadius: 50,
              backgroundColor: '#f5f5f5',
              marginHorizontal: 8,
            }}></View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  btn:{
    top:0,
    position:'absolute',
    right:10,
    height:40,
    width:150,
    backgroundColor:'#f5f5f5',
    justifyContent:'center',
    alignItems:'center'
  },
  btntxt:{
    fontSize:16,
    color:'#000',
    fontWeight:'600',
  }
});
