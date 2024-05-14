import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HeaderStatus from '../Components/HeaderStatus';

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      <HeaderStatus />
      <Text>ActivityScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
});

export default ActivityScreen;
