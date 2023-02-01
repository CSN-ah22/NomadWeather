import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, Dimensions, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width:SCREEN_WIDTH } = Dimensions.get("window"); //기기마다 스크린 사이즈 가져오기
console.log(SCREEN_WIDTH);

const API_KEY = "8eefda7ede21a0cbed5e1ef847109e43";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};



export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps: false}
    );
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(JSON.stringify(json , null, 2));
    setDays(json.daily)
  }
  useEffect(() => {
    getWeather();
    }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
      pagingEnabled 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
        { days.length === 0 ? (        
        <View style={{...styles.day, alignItems: "center"}}>
          <ActivityIndicator color={"white"} style={{marginTop: 10}} size="large"></ActivityIndicator>
        </View>
        ) : (
        days.map((day, index) =>
          <View key={index} style={styles.day}>
            <View style={{ 
              flexDirection: "row", 
              alignItems: 'center', 
              width: "100%",
              justifyContent:"space-between"
              }}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
        )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6f61',
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "700",
    color: "white",
  }, 
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
  },
  temp: {
    marginTop: 50,
    marginBottom: 20,
    fontSize: 120,
    color: "white",
  },
  description: {
    marginTop: -30,
    fontSize: 36,
    color: "white",
  },
  tinyText: {
    fontSize: 30,
    color: "white",
  }

});
