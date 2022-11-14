import React, { useEffect, useState } from 'react';
import {  StyleSheet,  Text,  View,  FlatList,  Alert,  TouchableOpacity,  Button,} from 'react-native';
import { red100 } from 'react-native-paper/lib/typescript/styles/colors';
import { openDatabase } from 'react-native-sqlite-storage';

let database = openDatabase({ name: 'TripAppData.db' });

const TripListScreen = ({ navigation }) => {
  let [dataTrip, setDataTrip] = useState([]);


  const displayDataOfTrip = (item) => {
    return (
      <View>
        <TouchableOpacity onPress={() => {
          navigation.navigate('UpdateTripScreen', {
            id: item.id,
            tripName: item.name,
            tripDestination: item.destination,
            tripDate: item.date,
            tripAssessment: item.risk_assesment,
            tripDescription: item.description,
          })
        }}>
          <View style={styles.itemTrip}>
            <View>
              <Text style={styles.idTitleTrip}>{item.id}</Text>
            </View>
            <View style={styles.nameDestinationTitleTrip}>
              <Text style={{ fontSize: 18 }}>Name: {item.name}</Text>
              <Text style={styles.destinationTitle}>Destination: {item.destination}</Text>
            </View>
            <View style={styles.nameDestinationTitleTrip}>
              <Text style={{fontSize: 15, marginRight: 20 }}>Date: {item.date}</Text>
              <Text style={styles.destinationTitle}>Risk: {item.risk_assesment}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    database.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Trips'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            // txn.executeSql('DROP TABLE IF EXISTS Trips', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Trips(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, destination TEXT, date TEXT, risk_assesment TEXT, description TEXT)',
              []
            );
          }
        }
      );
    });
    //Alert.alert('xong...');

    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Trips',
        [],
        (tx, results) => {
          let data = [];
          for (let i = 0; i < results.rows.length; ++i) {
            data.push(results.rows.item(i));
          }
          setDataTrip(data);
        }
      );
    });

    const focusHandler = navigation.addListener('focus', () => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Trips',
          [],
          (tx, results) => {
            let data = [];
            for (let i = 0; i < results.rows.length; ++i) {
              data.push(results.rows.item(i));
            }
            setDataTrip(data);
          }
        );
      });
    });
    return focusHandler;
  }, [navigation]);


  const deleteAll = async () => {
    await database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Trips',
        [],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Trip deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => setDataTrip([]),
                },
              ],
              { cancelable: false },
            );
          } else {
            alert('Please create a trpi');
          }
        },
      );
    });
  };

  console.log(dataTrip);

  return (
    <View style={styles.container}>
      {/* FlatList same with cyc view in android */}
      <FlatList
        data={dataTrip}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => displayDataOfTrip(item)}
      />

      <View style={styles.fixToText}>
        <View style={{ marginRight: 100, width: 120}}>
          <Button
            title="Delete All"
            onPress={deleteAll}
            color="blue"
          />
        </View>
        <View style={{ width: 155 }}>
          <Button
            title="Add Trip"
            onPress={() => navigation.navigate('AddTripScreen')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 800,
    //   backgroundColor: 'white',
  },
  itemTrip: {
    marginTop: 4,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: "thistle",
  },
  idTitleTrip: {
    width: 60,
    fontSize: 40,
    marginLeft: 18,
    marginTop: 10,
  },
  nameDestinationTitleTrip: {
    marginRight: 70,
    marginTop: 10,
  },
  destinationTitle: {
    marginTop: 8,
    fontSize: 18,
  },
  fixToText: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    marginBottom: 14,
    marginLeft: 22,
  },
});

export default TripListScreen;