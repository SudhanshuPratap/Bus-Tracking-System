import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const busRoutes = [
  { id: '101', name: 'Route 101', description: 'Downtown - Airport' },
  { id: '102', name: 'Route 102', description: 'University - Mall' },
  { id: '103', name: 'Route 103', description: 'Hospital - Station' },
  { id: '104', name: 'Route 104', description: 'Beach - City Center' },
  { id: '105', name: 'Route 105', description: 'Suburbs - Downtown' },
  { id: '201', name: 'Express 201', description: 'Airport Express' },
  { id: '202', name: 'Express 202', description: 'Mall Express' },
];

export default function RouteSelectionScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const filteredRoutes = busRoutes.filter(route =>
    route.name.toLowerCase().includes(searchText.toLowerCase()) ||
    route.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = () => {
    if (!selectedRoute) {
      Alert.alert('Please select a route', 'Choose a bus route to track');
      return;
    }
    
    navigation.navigate('BusTracking', { route: selectedRoute });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Select Route</Text>
        <Text style={styles.headerSubtitle}>Choose your bus route</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search routes..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>

        <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Available Routes</Text>
          {filteredRoutes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                selectedRoute?.id === route.id && styles.selectedRouteCard
              ]}
              onPress={() => setSelectedRoute(route)}
            >
              <View style={styles.routeInfo}>
                <Text style={[
                  styles.routeName,
                  selectedRoute?.id === route.id && styles.selectedRouteText
                ]}>
                  {route.name}
                </Text>
                <Text style={[
                  styles.routeDescription,
                  selectedRoute?.id === route.id && styles.selectedRouteDescription
                ]}>
                  {route.description}
                </Text>
              </View>
              <View style={[
                styles.routeIndicator,
                selectedRoute?.id === route.id && styles.selectedIndicator
              ]}>
                <Text style={styles.routeId}>{route.id}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.searchButton,
            selectedRoute && styles.searchButtonActive
          ]}
          onPress={handleSearch}
          disabled={!selectedRoute}
        >
          <LinearGradient
            colors={selectedRoute ? ['#667eea', '#764ba2'] : ['#ccc', '#999']}
            style={styles.searchButtonGradient}
          >
            <Text style={styles.searchButtonText}>
              🔍 Track Bus
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routesList: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedRouteCard: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedRouteText: {
    color: '#667eea',
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedRouteDescription: {
    color: '#5a6fd8',
  },
  routeIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#667eea',
  },
  routeId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchButtonActive: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});