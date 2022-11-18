import React, { useState } from 'react';
import {  StyleSheet,  Text,  View,  Button,  TextInput,  Alert,} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import InputValueItem from './InputValue';

let database = openDatabase({ name: 'TripDiary.db' });

const UpdateTripScreen = ({ route, navigation }) => {
  const {
    id,
    tripName,
    tripDestination,
    tripDate,
    tripAssessment,
    tripDescription,
  } = route.params;

  const [isShowDatePicker, setShowDatePicker] = useState(false);
  const [checkedValueAssessment, setCheckedValueAssessment] = useState(tripAssessment);
  let [nameUpdate, setNameTripUpdate] = useState(tripName);
  let [distinationUpdate, setDistinationTripUpdate] = useState(tripDestination);
  let [dateUpdate, setDateTripUpdate] = useState(tripDate);
  let [descriptionUpdate, setDescriptionTripUpdate] = useState(tripDescription);

  const [dateSelectTrip, setDateSelectTrip] = useState(new Date());


  const onClickShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const onClickHideDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleConfirm = (dateTrip) => {
    console.log("A date has been picked: ", dateTrip);

    let convertDate = new Date(dateTrip);
    let formatConvertDate =
      convertDate.getDate() +
      '-' +
      `${convertDate.getMonth() + 1}` +
      '-' +
      convertDate.getFullYear();

    console.log("A date has been picked: ", formatConvertDate);
    setDateTripUpdate(formatConvertDate);

    hideDatePicker();
    setDateSelectTrip(formatConvertDate);
  };

  const updateTrip = async () => {
    console.log(
      'data from main screen',
      id,
      tripName,
      tripDestination,
      tripDate,
      tripAssessment,
      tripDescription,
    );

    await database.transaction(function (tx) {
      tx.executeSql(

        'UPDATE Trips set name=?, destination=? , date=?, risk_assesment=?, description=? where id=?',
        [nameUpdate, distinationUpdate, dateUpdate, checkedValueAssessment, descriptionUpdate, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Update Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('TripListScreen'),
                },
              ],
              { cancelable: false },
            );
          } else alert('Update Failed');
        },
      );
    });
  }

  const deleteTripById = async () => {
    await database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  Trips where id=?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Trip deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('TripListScreen'),
                },
              ],
              { cancelable: false },
            );
          } else {
            alert('Please insert a trip');
          }
        },
      );
    });
  };


  return (
    <View style={styles.container}>
      <View>
        <View style={{ marginVertical: 24 }}>
          <Text style={{ marginLeft: 34 }}>Name</Text>
          <InputValueItem placeholder="Enter Name" onChangeText={valueName => setNameTripUpdate(valueName)} value={nameUpdate} />
        </View>
        <View style={{ marginVertical: 24 }}>
          <Text style={{ marginLeft: 34 }}>Destination</Text>
          <InputValueItem placeholder="Enter Destination" onChangeText={valueDestination => setDistinationTripUpdate(valueDestination)} value={distinationUpdate} />
        </View>
        <View>
          <View style={styles.dateTrip}>
            <View style={{ width: 128, marginLeft: 32 }}>
              <Button title="Select Date" onPress={onClickShowDatePicker} />
            </View>
            <Text style={{ marginLeft: 14, marginTop: 8, fontSize: 16 }}>{dateUpdate}</Text>
          </View>
          <DateTimePickerModal
            isVisible={isShowDatePicker}
            mode="date"
            onDateChange={setDateSelectTrip}
            date={dateSelectTrip}
            onConfirm={handleConfirm}
            onCancel={onClickHideDatePicker}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 36 }}>
          <Text style={{ marginLeft: 34, marginTop: 8, }}>Risk Assessment: </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginLeft: 26, marginTop: 6 }}>Yes</Text>
            <RadioButton
              value="Yes"
              status={checkedValueAssessment === 'Yes' ? 'checked' : 'unchecked'}
              onPress={() => setCheckedValueAssessment('Yes')}
            />
            <Text style={{ marginLeft: 26, marginTop: 6 }}>No</Text>
            <RadioButton
              value="No"
              status={checkedValueAssessment === 'No' ? 'checked' : 'unchecked'}
              onPress={() => setCheckedValueAssessment('No')}
            />
          </View>
        </View>
        <View style={{ marginVertical: 24 }}>
          <Text style={{ marginLeft: 34 }}>Description</Text>
          <InputValueItem placeholder="Enter Description" onChangeText={valueDescripton => setDescriptionTripUpdate(valueDescripton)} value={descriptionUpdate} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', }}>
        <View style={{ width: 122, marginLeft: 38, marginTop: 63 }}>
          <Button
            title="Delete"
            onPress={() => deleteTripById()}
            color="blue"
          />
        </View>
        <View style={{ width: 222, marginTop: 63, marginLeft: 10 }}>
          <Button
            title="Update"
            onPress={() => updateTrip()}
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
  },
  dateTrip: {
    flexDirection: 'row',
  }
});

export default UpdateTripScreen;