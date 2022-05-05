//TODO -Auto size text
//TODO -Multiple Line??

import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Alert, FlatList } from "react-native";
import React, { Component } from "react";
import TileNumber from "./components/TileNumber";
import { FontAwesome, Feather } from "@expo/vector-icons";
import styles from "./styles/MainStyle";
import { Queue, Stack } from "datastructures-js";
import TileLongHistory from "./components/TileLongHistory";
class MainApp extends Component {
  state = {
    ans: "",
    history: "",
    longHistory: new Stack(),
    isLong: false,
    tempAns: "",
  };

  onLongHis = () => {
    this.setState({ isLong: !this.state.isLong });
  };

  onCal = () => {
    //https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/
    //https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/
    const precedence = { "+": 1, "-": 1, "×": 2, "÷": 2 };
    const stack = new Stack();
    let postfix = new Queue();
    let tempVar = this.state.ans;
    let tempV1 = "";

    for (let index = 0; index < tempVar.length; index++) {
      const cut = tempVar[index];
      if (!isNaN(cut)) {
        tempV1 += cut;
        if (index === tempVar.length - 1) {
          postfix.enqueue(tempV1);
          tempV1 = "";
        }
      } else {
        if (tempV1.length > 0) {
          postfix.enqueue(tempV1);
          tempV1 = "";
        }
        while (
          !stack.isEmpty() &&
          precedence[cut] <= precedence[stack.peek()]
        ) {
          postfix.enqueue(stack.pop());
        }
        stack.push(cut);
      }
    }
    while (!stack.isEmpty()) {
      postfix.enqueue(stack.pop());
    }
    // got postfix
    const len = postfix.size();
    stack.clear();
    for (let index = 0; index < len; index++) {
      const cut = postfix.dequeue();
      if (!isNaN(cut)) {
        stack.push(parseInt(cut));
      } else {
        let v1 = stack.pop();
        let v2 = stack.pop();
        switch (cut) {
          case "+":
            stack.push(String(v2 + v1));
            break;

          case "-":
            stack.push(String(v2 - v1));
            break;

          case "×":
            stack.push(String(v2 * v1));
            break;

          case "÷":
            stack.push(String(v2 / v1));
            break;
        }
      }
    }
    const newAns = stack.pop();

    let cloneTemp = this.state.longHistory.clone();

    let peek = cloneTemp.peek();
    let peekLongHis = peek === null ? "" : peek[0];
    let peekAns = peek === null ? "" : peek[1];

    let tempAns = this.state.ans;
    if (
      !cloneTemp.isEmpty() &&
      peekLongHis.length > 0 &&
      tempAns.match(/-*\d*/i)[0] === this.state.tempAns
    ) {
      cloneTemp.pop();
      peekLongHis += tempAns.replace(this.state.tempAns, "");
    } else {
      if (peekLongHis === "c") {
        cloneTemp.pop();
      }

      peekLongHis = tempAns;
    }
    cloneTemp.push([peekLongHis, newAns]);

    this.setState({
      ans: newAns,
      history: this.state.ans,
      tempAns: newAns,
      longHistory: cloneTemp,
    });
  };
  onTilePress = (str) => {
    if (!this.state.isLong) {
      if (str === "C") {
        this.onClear();
      } else if (str === "=") {
        this.onCal();
      } else if (str !== "=" && str.length > 0) {
        this.setState({ ans: this.state.ans + str });
      }
    }
  };
  onClear = () => {
    let cloneTempV2 = this.state.longHistory.clone();
    cloneTempV2.push(["c", ""]);
    this.setState({
      ans: "",
      history: "",
      longHistory: cloneTempV2,
      isLong: false,
      tempAns: "",
    });
  };
  onLongPress = (item) => {
    this.setState(
      {
        ans: item[0],
        history: "",
        tempAns: "",
      },
      () => this.setState({ isLong: false })
    );
  };

  onDelete = () => {
    if (!this.state.isLong) {
      if (this.state.ans.length > 0)
        this.setState({
          ans: this.state.ans.substring(0, this.state.ans.length - 1),
        });
    }
  };

  getOPPanel = () => {
    return (
      <View
        style={{
          flex: 15,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 9,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text style={styles.ans}>{this.state.ans}</Text>
        </View>
        <View
          style={{
            marginRight: 12,
            flex: 2,
            justifyContent: "center",
            alignItems: ' "center"',
          }}
        >
          <TouchableOpacity
            onPress={() => this.onDelete()}
            style={styles.button}
          >
            {<Feather name="delete" size={32} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  getLongPanel = () => {
    return (
      <View
        style={{
          flex: 15,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <FlatList
          data={this.state.longHistory.toArray().reverse()}
          renderItem={({ item }) => {
            return item[0] !== "c" ? (
              <TileLongHistory data={item} onPress={this.onLongPress} />
            ) : null;
          }}
        />
      </View>
    );
  };
  render() {
    const tileList = [
      ["+", "-", "×", "÷"],
      ["7", "8", "9", "C"],
      ["4", "5", "6", "="],
      ["1", "2", "3", "0"],
    ];
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 3,
            width: "100%",
            backgroundColor: "#fafafa",
            flexDirection: "column",
          }}
        >
          <View style={{ flex: 5, marginLeft: "85%", marginRight: 12 }}>
            <TouchableOpacity
              onPress={() => this.onLongHis()}
              style={styles.button}
            >
              <FontAwesome
                name={!this.state.isLong ? "history" : "arrow-left"}
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={styles.history}>
              {!this.state.isLong ? this.state.history : "History"}
            </Text>
          </View>
          {!this.state.isLong ? this.getOPPanel() : this.getLongPanel()}
          <View style={{ flex: 5 }}></View>
        </View>
        <View style={{ flex: 7, width: "100%", flexDirection: "column" }}>
          {tileList.map((str) => (
            <View key={Math.random()} style={{ flex: 1, flexDirection: "row" }}>
              {str.map((item) => (
                <TileNumber
                  key={Math.random()}
                  text={item}
                  onPress={this.onTilePress}
                />
              ))}
            </View>
          ))}
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default MainApp;
