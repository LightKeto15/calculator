//TODO -Auto size text
//TODO -Multiple Line??
//BUG  When back from Long history mode can't delete
//BUG  When input new number from ans, history and long history not change.


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { Component } from 'react'
import TileNumber from './components/TileNumer';
import { FontAwesome, Feather } from '@expo/vector-icons';

import { Queue, Stack } from 'datastructures-js'
class MainApp extends Component {

  state = {
    ans: "",
    history: "",
    longHistory: "",
    first: false,
    isLong: false
  }
  onLongHis = () => {
    this.setState({ isLong: !this.state.isLong })
  }
  onCal = () => {
    //https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/
    //https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/
    const precedence = { '+': 1, '-': 1, '×': 2, '÷': 2 }
    const stack = new Stack();
    let postfix = new Queue();
    let tempVar = this.state.ans;
    let tempV1 = ''


    for (let index = 0; index < tempVar.length; index++) {
      const cut = tempVar[index];
      if (!isNaN(cut)) {
        tempV1 += cut
        if (index === tempVar.length - 1) {
          postfix.enqueue(tempV1)
          tempV1 = ''
        }
      } else {
        if (tempV1.length > 0) {
          postfix.enqueue(tempV1)
          tempV1 = ''
        }
        while (!stack.isEmpty() && precedence[cut] <= precedence[stack.peek()]) {
          postfix.enqueue(stack.pop())
        }
        stack.push(cut);
      }

    }
    while (!stack.isEmpty()) {
      postfix.enqueue(stack.pop())
    }

    // got postfix
    const len = postfix.size()
    stack.clear();
    for (let index = 0; index < len; index++) {
      const cut = postfix.dequeue();
      if (!isNaN(cut)) {
        stack.push(parseInt(cut));
      }
      else {
        let v1 = stack.pop()
        let v2 = stack.pop()
        switch (cut) {
          case '+':
            stack.push(v2 + v1);
            break;

          case '-':
            stack.push(v2 - v1);
            break;

          case '×':
            stack.push(v2 * v1);
            break;

          case '÷':
            stack.push(v2 / v1);
            break;
        }
      }

    }
    const newAns = stack.pop()
    
    if (!this.state.first) {
      const temp = this.state.history + this.state.ans
      this.setState({ ans: newAns, history: temp, first: true, longHistory: temp })
    }
    else {
      let newHis = this.state.ans
      newHis = newHis.replace(newHis.match(/-*\d*/i)[0], '')
      this.setState({ ans: newAns, history: this.state.ans, longHistory: this.state.longHistory + newHis })
    }

  }
  onTilePress = (str) => {
    if (!this.state.isLong) {

      if (str === 'C') {
        this.onClear()
      }
      else if (str === '=') {
        this.onCal()
      }
      else if (str !== '=' && str.length > 0) {
        this.setState({ ans: this.state.ans + str })
      }
    }
    //console.log(str)
  }
  onClear = () => {
    this.setState({
      ans: "",
      history: "",
      longHistory: "",
      first: false,
      isLong: false
    })
  }
  onDelete = () => {
    if (!this.state.isLong) {
      if (this.state.ans.length > 0)
        this.setState({ ans: this.state.ans.substring(0, this.state.ans.length - 1) })
    }
  }
  getLongText = () => {
    if (!this.state.isLong) {
      return this.state.ans
    }
    else {
      let temp = this.state.longHistory;
      if(this.state.longHistory.length>0)
      {
        temp +=" = " 
        temp += this.state.ans
      }
      return temp
    }
  }
  render() {
    const tileList = [['+', '-', '×', '÷'], ['7', '8', '9', 'C'], ['4', '5', '6', '='], ['1', '2', '3', '0']]
    return (
      <View style={styles.container}>
        <View style={{ flex: 3, width: '100%', backgroundColor: '#fafafa', flexDirection: "column" }}>
          <View style={{ flex: 5, marginLeft: '85%', marginRight: 12 }}>
            <TouchableOpacity onPress={() => this.onLongHis()}
              style={styles.button}>
              <FontAwesome name={!this.state.isLong ? "history" : "arrow-left"} size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 5, }}><Text style={styles.history}>{!this.state.isLong ? this.state.history : ''}</Text></View>
          <View style={{ flex: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ flex: 9, justifyContent: 'center', alignItems: "center", alignContent: 'center' }}>
              <Text style={styles.ans}>{this.getLongText()}</Text>
            </View>
            {!this.state.isLong ?
              <View style={{ marginRight: 12, flex: 2, justifyContent: 'center', alignItems: ' "center"', }}>

                <TouchableOpacity onPress={() => this.onDelete()}
                  style={styles.button}>
                  {<Feather name="delete" size={32} color="#fff" />}
                </TouchableOpacity>
              </View> : null
            }
          </View>
          <View style={{ flex: 5 }}></View>
        </View>
        <View style={{ flex: 7, width: '100%', flexDirection: 'column' }}>
          {
            tileList.map(str =>
              <View key={Math.random()} style={{ flex: 1, flexDirection: "row" }}>
                {str.map(item => <TileNumber key={Math.random()} text={item} onPress={this.onTilePress} />)}
              </View>)
          }


        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default MainApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'flex-start',
  }, button: {
    alignItems: 'center',
    backgroundColor: '#242424',//'#32a856',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    marginVertical: 5,
    width: '100%',
    height: '100%'

  },
  history: {
    fontSize: 30,
    marginLeft: 30
  },
  ans: {
    fontSize: 40,
    margin: 20
  }
});
