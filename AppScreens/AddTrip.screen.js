import React, { useState } from 'react';
import {  StyleSheet,  Text,  View,  Button,  TextInput,  Alert,} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { openDatabase } from 'react-native-sqlite-storage';

let database = openDatabase({ name: 'TripDiary.db' });

const InputValueItem = (props) => {
  return (
    <View
      style={{
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10,
        borderColor: 'red',
        borderWidth: 1,
      }}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor="red"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        blurOnSubmit={false}
        value={props.value}
      />
    </View>
  )
}

const AddTripScreen = ({ navigation }) => {
  const [isShowDatePicker, setShowDatePicker] = useState(false);
  const [checkedValueAssessment, setCheckedValueAssessment] = useState('');
  let [name, setNameTrip] = useState('');
  let [destination, setDestinationTrip] = useState('');
  let [date, setDateTrip] = useState('');
  let [description, setDescriptionTrip] = useState('');

  const [dateSelectTrip, setDateSelectTrip] = useState(new Date());


  const onClickShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const onClickHideDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleConfirm = (dateTrip) => {
    let convertDate = new Date(dateTrip);
    let formatConvertDate =
      convertDate.getDate() +
      '-' +
      `${convertDate.getMonth() + 1}` +
      '-' +
      convertDate.getFullYear();

    setDateTrip(formatConvertDate);
    hideDatePicker();
    setDateSelectTrip(formatConvertDate);
  };

  const andNewTrip = () => {
    if (!name) {
      alert('Please enter name');
      return;
    }
    if (!destination) {
      alert('Please enter destination');
      return;
    }
    if (!date) {
      alert('Please enter date');
      return;
    }
    if (!checkedValueAssessment) {
      alert('Please enter assessment');
      return;
    }
    if (!description) {
      alert('Please enter description');
      return;
    }

   
    database.transaction(function (tx) {
      console.log(name, destination, date, checkedValueAssessment, description);

      tx.executeSql(
        'INSERT INTO Trips (name, destination, date, risk_assesment, description) VALUES (?,?,?,?,?)',
        [name, destination, date, checkedValueAssessment, description],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Name:'+ name +"\n"+'destination:'+ destination +"\n"+'date:'+ date +"\n"+'checkedValueAssessment:'+ checkedValueAssessment +"\n"+'description:'+ description,
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('TripListScreen'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Add Failed');
        }
      );
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={{ marginVertical: 24 }}>
          <Text style={{ marginLeft: 34 }}>Name</Text>
          <InputValueItem placeholder="Enter Name" onChangeText={value => setNameTrip(value)} />
        </View>
        <View style={{ marginVertical: 24 }}>
          <Text style={{ marginLeft: 34 }}>Destination</Text>
          <InputValueItem placeholder="Enter Destination" onChangeText={value => setDestinationTrip(value)} />
        </View>
        <View>
          <View style={styles.dateTrip}>
            <View style={{ width: 128, marginLeft: 32 }}>
              <Button title="Select Date" onPress={onClickShowDatePicker} />
            </View>
            <Text style={{ marginLeft: 14, marginTop: 8, fontSize: 16 }}>{date}</Text>
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
          <InputValueItem placeholder="Enter Description" onChangeText={value => setDescriptionTrip(value)} />
        </View>
      </View>
      <View style={{ width: 222, marginLeft: 100, marginTop: 50 }}>
        <Button
          title="Add"
          onPress={() => andNewTrip()}
        />
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

export default AddTripScreen;