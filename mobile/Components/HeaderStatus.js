import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalContext } from '../Contexts/GlobalContext';

const HeaderStatus = () => {
  const { headerStatus } = React.useContext(GlobalContext);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.text}>
          {headerStatus.isConnected ? 'Conectado em ip' : 'DISCONNECTED'}
        </Text>
      </View>
      <View style={styles.border}></View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#101010',
    paddingVertical: 6,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 12,
    fontFamily: 'IBMPlexSansSemiBold',
    color: '#A9A9A9',
    // letter-spacing de 2% no figma
    letterSpacing: 0.02,
  },
  border: {
    height: 1,
    backgroundColor: '#282828',
  },
});

export default HeaderStatus;
