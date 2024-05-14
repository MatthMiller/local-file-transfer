import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderStatus from '../Components/HeaderStatus';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <HeaderStatus />
      <View style={styles.innerContainer}>
        <View style={styles.top}>
          <Text style={styles.text}>
            Provide the address of your LFT server to connect and initiate file
            transfers
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholderTextColor='#797979'
              placeholder='Ex: 192.168.15.50'
            />
            <TouchableOpacity
              style={styles.connectIconContainer}
              activeOpacity={0.7}
            >
              <Image
                style={styles.connectIcon}
                source={require('../assets/icons/connect.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.separator}>
          <View style={styles.separatorLine}></View>
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine}></View>
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
          <Image
            source={require('../assets/icons/qr-code.png')}
            style={styles.scanIcon}
          />
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 32,
  },
  top: {
    gap: 24,
  },
  text: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'IBMPlexSansRegular',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: '#101010',
    borderColor: '#282828',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    lineHeight: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'IBMPlexSansRegular',
    color: '#F5F5F5',
  },
  connectIconContainer: {
    backgroundColor: '#1D1D1D',
    borderRadius: 5,
    padding: 12.5,
  },
  connectIcon: {
    height: 24,
    width: 24,
  },
  separator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  separatorText: {
    color: '#A9A9A9',
    fontSize: 14,
    lineHeight: 15,
    fontFamily: 'IBMPlexSansSemiBold',
  },
  separatorLine: {
    backgroundColor: '#282828',
    flex: 1,
    height: 1,
  },
  scanIcon: {
    height: 22,
    width: 22,
  },
  button: {
    backgroundColor: '#1D1D1D',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#9B9B9B',
    fontSize: 14,
    // lineHeight: 14,
    // alignSelf: 'center',
    // justifySelf: 'center',
    fontFamily: 'IBMPlexSansRegular',
  },
});

export default HomeScreen;
