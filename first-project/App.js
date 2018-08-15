import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.parent}>
        <View style={styles.topBlock}>
          <View style={styles.leftCol}>
            <View style={[styles.cellOne, styles.base]}><Text>1</Text></View>
            <View style={[styles.base,styles.cellTwo]}><Text>2</Text></View>
          </View>
          <View style={[styles.cellThree, styles.base]}><Text>3</Text></View>
        </View>
        <View style={styles.bottomBlock}>
          <View style={[styles.cellFour, styles.base]}><Text>4</Text></View>
          <View style={[styles.cellFive, styles.base]}><Text>5</Text></View>
          <View style={[styles.bottomRight]}>
            <View style={[styles.cellSix, styles.base]}><Text>6</Text></View>
            <View style={[styles.cellSeven, styles.base]}><Text>7</Text></View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'column',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0
  },
  base: {
    borderColor: '#000000',
    borderWidth: 5
  },
  topBlock: {
    flexDirection: 'row',
    flex: 5
  },
  leftCol: {
    flex: 2,
  },
  cellOne: {
    flex: 1,
    borderBottomWidth: 15
  },
  cellTwo: {
    flex: 3
  },
  cellThree: {
    flex: 5,
    backgroundColor: '#FF0000'
  },
  bottomBlock: {
    flexDirection: 'row',
    flex: 2
  },
  cellFour: {
    flex: 2,
    backgroundColor: '#0000FF'
  },
  cellFive: {
    flex: 3
  },
  bottomRight: {
    flex: 2
  },
  cellSix: {
    flex: 1
  },
  cellSeven: {
    flex: 1,
    backgroundColor: '#FFFF00'
  }
});