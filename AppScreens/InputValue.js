import React, { useState } from 'react';
import {  StyleSheet,  Text,  View,  Button,  TextInput,  Alert,} from 'react-native';

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
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  )
}

export default InputValueItem;