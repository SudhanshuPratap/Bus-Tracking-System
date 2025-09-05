import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock bus data
const generateBusData = (routeId) => [
  {
    id: 'BUS001',
    number: `${routeId}-A`,
    currentLocation: 'Main Street',
    arrivalTime: '3 min',
    delay: null,
    capacity: '75%',
    driver: 'John Smith',
    nextStops: ['Central Plaza', 'Park Avenue', 'Mall Entrance'],
  },
  {
    id: 'BUS002',
    number: `${routeId}-B`,
    currentLocation: 'Oak Avenue',
    arrivalTime: '8 min',
    delay: '2 min',
    capacity: '45%',
    driver: 'Sarah Johnson',
    nextStops: ['Library', 'School District', 'Shopping Center'],
  },
  {
    id: 'BUS003',
    number: `${routeId}-C`,
    currentLocation: 'Pine Street',
    arrivalTime: '15 min',
    delay: null,
    capacity: '60%',
    driver: 'Mike Wilson',
    nextStops: ['Hospital', 'University', 'Downtown'],
  },
];

export default function BusTrackingScreen({ navigation, route }) {
  const { route: selectedRoute } = route.params;
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBusData();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadBusData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadBusData = () => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setBuses(generateBusData(selectedRoute.id));
      setRefreshing(false);
    }, 1000);
  };

  const showBusDetails = (bus) => {
    setSelectedBus(bus);
    setModalVisible(true);
  };

  const getStatusColor = (delay) => {
    if (!delay) return '#4CAF50'; // Green for on time
    return '#FF9800'; // Orange for delayed
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{selectedRoute.name}</Text>
        <Text style={styles.headerSubtitle}>{selectedRoute.description}</Text>
        
        {/* Arrival Info Box */}
        <View style={styles.arrivalInfoBox}>
          <Text style={styles.arrivalTitle}>Next Bus</Text>
          <Text style={styles.arrivalTime}>
            {buses.length > 0 ? buses[0].arrivalTime : '--'}
          </Text>
          {buses.length > 0 && buses[0].delay && (
            <Text style={styles.delayText}>
              Delayed: {buses[0].delay}
            </Text>
          )}
          <Text style={styles.busNumber}>
            Bus: {buses.length > 0 ? buses[0].number : '--'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.refreshContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadBusData}
            disabled={refreshing}
          >
            <Text style={styles.refreshText}>
              {refreshing ? '🔄 Updating...' : '🔄 Refresh'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.busList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Buses on Route</Text>
          
          {buses.map((bus, index) => (
            <View key={bus.id} style={styles.busCard}>
              <View style={styles.busMainInfo}>
                <View style={styles.busHeader}>
                  <View style={styles.busNumberContainer}>
                    <Text style={styles.busNumber}>{bus.number}</Text>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => showBusDetails(bus)}
                    >
                      <Text style={styles.infoButtonText}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(bus.delay) }]} />
                </View>
                
                <Text style={styles.currentLocation}>📍 {bus.currentLocation}</Text>
                
                <View style={styles.timeContainer}>
                  <Text style={styles.arrivalLabel}>Arrival Time:</Text>
                  <Text style={styles.arrivalValue}>{bus.arrivalTime}</Text>
                </View>
                
                {bus.delay && (
                  <View style={styles.delayContainer}>
                    <Text style={styles.delayLabel}>⚠️ Delayed:</Text>
                    <Text style={styles.delayValue}>{bus.delay}</Text>
                  </View>
                )}
                
                <View style={styles.capacityContainer}>
                  <Text style={styles.capacityLabel}>Capacity:</Text>
                  <View style={styles.capacityBar}>
                    <View style={[styles.capacityFill, { width: bus.capacity }]} />
                  </View>
                  <Text style={styles.capacityText}>{bus.capacity}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bus Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bus Details</Text>
            
            {selectedBus && (
              <>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Bus Number:</Text>
                  <Text style={styles.modalValue}>{selectedBus.number}</Text>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Driver:</Text>
                  <Text style={styles.modalValue}>{selectedBus.driver}</Text>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Current Location:</Text>
                  <Text style={styles.modalValue}>{selectedBus.currentLocation}</Text>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Capacity:</Text>
                  <Text style={styles.modalValue}>{selectedBus.capacity}</Text>
                </View>
                
                <Text style={styles.nextStopsTitle}>Next Stops:</Text>
                {selectedBus.nextStops.map((stop, index) => (
                  <Text key={index} style={styles.nextStop}>
                    {index + 1}. {stop}
                  </Text>
                ))}
              </>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  arrivalInfoBox: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  arrivalTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  arrivalTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  delayText: {
    fontSize: 10,
    color: '#FF9800',
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  refreshContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  refreshText: {
    color: '#667eea',
    fontWeight: '500',
  },
  busList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  busCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busMainInfo: {
    flex: 1,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  busNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    marginLeft: 8,
    padding: 4,
  },
  infoButtonText: {
    fontSize: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  currentLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  arrivalLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  arrivalValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  delayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  delayLabel: {
    fontSize: 14,
    color: '#FF9800',
  },
  delayValue: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  capacityLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  capacityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 8,
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  capacityText: {
    fontSize: 12,
    color: '#666',
    minWidth: 30,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxWidth: 350,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  nextStopsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  nextStop: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 10,
  },
  closeButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});