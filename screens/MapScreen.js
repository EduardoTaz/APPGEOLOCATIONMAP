import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão de localização negada');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setLoading(false);
  };

  const searchLocation = async () => {
    if (!searchQuery) return;
    setLoading(true);
  
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MeuAppGeolocalizacao/1.0 (contato@meuemail.com)',
          'Accept-Language': 'pt-BR'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar local: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.length === 0) {
        setErrorMsg('Nenhuma cidade encontrada. Tente outro nome.');
        return;
      }
  
      const place = data[0];
      setLocation({
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
  
      setErrorMsg(null); // Limpar mensagens de erro anteriores, se houver.
  
    } catch (error) {
      console.error('Erro ao buscar local:', error);
      setErrorMsg('Erro ao buscar cidade. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleMapPress = (event) => {
    const newPoint = event.nativeEvent.coordinate;
    if (route.length < 2) {
      setRoute([...route, newPoint]);
      if (route.length === 1) {
        calculateDistance(route[0], newPoint);
      }
    }
  };

  const calculateDistance = (pointA, pointB) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(pointB.latitude - pointA.latitude);
    const dLon = toRad(pointB.longitude - pointA.longitude);
    const lat1 = toRad(pointA.latitude);
    const lat2 = toRad(pointB.latitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    setDistance(distance.toFixed(2));
  };

  const clearRoute = () => {
    setRoute([]);
    setDistance(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar local..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={searchLocation}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={getLocation}>
        <Text style={styles.buttonText}>Atualizar Localização</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        location && (
          <MapView style={styles.map} region={location} onPress={handleMapPress}>
            <Marker coordinate={location} title="Local Atual" />
            {route.map((point, index) => (
              <Marker key={index} coordinate={point} title={`Ponto ${index + 1}`} />
            ))}
            {route.length === 2 && (
              <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
            )}
          </MapView>
        )
      )}

      {distance && <Text style={styles.distanceText}>Distância: {distance} km</Text>}
      {route.length === 2 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearRoute}>
          <Text style={styles.buttonText}>Limpar Rota</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, width: '100%', maxWidth: 400, marginBottom: 10 },
  input: { flex: 1, height: 40, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  updateButton: { marginBottom: 10, backgroundColor: '#27ae60', padding: 10, borderRadius: 8 },
  clearButton: { marginTop: 10, backgroundColor: '#e74c3c', padding: 10, borderRadius: 8 },
  map: { width: '100%', height: '60%', borderRadius: 15 },
  loader: { marginTop: 20 },
  distanceText: { fontSize: 16, marginTop: 10, color: '#2c3e50' },
});

export default MapScreen;
