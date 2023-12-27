import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import ShowHistory from '../components/history/ShowHistory';
// import ShowActiveAlerts from '../components/alerts/ShowActiveAlerts';
import { useSelector } from 'react-redux';
import ShowAlerts from '../components/history/ShowAlerts';
import { SERVER_BASE_URL } from '@env';
import axios from 'axios';

const HistoryPage = ({ navigation }) => {
  const [showHistory, setShowHistory] = useState(true);
  const user = useSelector((state) => state.userReducer.user);
  const [data, setData] = useState([]);

  const onShowHistory = async () => {
    try {
      const patientId = user._id;
      const response = await axios.post(`${SERVER_BASE_URL}/api/alerts/get-by-patient-id/`, {
        patientId: patientId,
      });
      setData(response.data);
      setShowHistory(true)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(()=>{
    onShowActiveAlerts();
  },[])

  const onShowActiveAlerts = async () => {
    try {
      const patientId = user._id;
      const response = await axios.get(`${SERVER_BASE_URL}/api/alerts/get-active-alerts-by-patient-id/${patientId}`);
      setData(response.data);
      setShowHistory(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: showHistory ? 'lightblue' : 'white' }]}
        onPress={() => onShowHistory()}
      >
        <Text style={styles.buttonText}>Show History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: !showHistory ? 'lightblue' : 'white' }]}
        onPress={() => onShowActiveAlerts()}
      >
        <Text style={styles.buttonText}>Show Active Alerts</Text>
      </TouchableOpacity>
      <ShowAlerts data={data} showHistory={showHistory} />
      {/* {showHistory ? (
        <ShowHistory />
      ) : (
        <ShowActiveAlerts user={user} />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default HistoryPage;
