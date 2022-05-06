import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Alert, FlatList } from "react-native";
import React, { Component, useState } from "react";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Queue, Stack } from "datastructures-js";
import { ScrollView } from "react-native-web";

import TileNumber from "../components/TileNumber";
import TileLongHistory from "../components/TileLongHistory";
import styles from "../styles/MainStyle";

function MainApp(props) {
  const [ans, setAns] = useState("");
  const [history, setHistory] = useState("");
  const [tempAns, setTempAns] = useState("");
  const [isLong, setIsLong] = useState(false);
  const [longHistory, setLongHistory] = useState(new Stack());

  const onLongHis = () => {
    setIsLong(!isLong);
  };

  const onCal = () => {
    //https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/
    //https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/
    const precedence = { "+": 1, "-": 1, "×": 2, "÷": 2 };
    const stack = new Stack();
    let postfix = new Queue();
    let tempVar = ans;
    let tempV1 = "";
    let testNegative = false;
    let cut = "";
    for (let index = 0; index < tempVar.length; index++) {
      cut += tempVar[index];
      if (cut === "-" && (index === 0 || isNaN(tempVar[index - 1]))) {
        continue;
      }
      if (!isNaN(cut) || cut === ".") {
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
      cut = "";
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
        stack.push(parseFloat(cut));
      } else {
        let v1 = parseFloat(stack.pop());
        let v2 = parseFloat(stack.pop());
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

    let cloneTemp = longHistory.clone();

    let peek = cloneTemp.peek();
    let peekLongHis = peek === null ? "" : peek[0];
    let peekAns = peek === null ? "" : peek[1];

    let tempAns = ans;
    if (
      !cloneTemp.isEmpty() &&
      peekLongHis.length > 0 &&
      tempAns.match(/-*\d*/i)[0] === tempAns
    ) {
      cloneTemp.pop();
      peekLongHis += tempAns.replace(tempAns, "");
    } else {
      if (peekLongHis === "c") {
        cloneTemp.pop();
      }

      peekLongHis = tempAns;
    }
    cloneTemp.push([peekLongHis, newAns]);

    setAns(newAns);
    setHistory(ans);
    setTempAns(newAns);
    setLongHistory(cloneTemp);
  };
  const onTilePress = (str) => {
    if (!isLong) {
      if (str === "C") {
        onClear();
      } else if (str === "=") {
        onCal();
      } else if (str.length > 0) {
        setAns(ans + str);
      }
    }
  };
  const onClear = () => {
    let cloneTempV2 = longHistory.clone();
    cloneTempV2.push(["c", ""]);

    setAns("");
    setHistory("");
    setTempAns("");
    setLongHistory(cloneTempV2);
    setIsLong(false);
  };
  const onLongPress = (item) => {
    setAns(item[0]);
    setHistory("");
    setTempAns("");
    setIsLong(false);
  };

  const onDelete = () => {
    if (!isLong) {
      if (ans.length > 0) {
        setAns(ans.substring(0, ans.length - 1));
      }
    }
  };
  const getLongPanel = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexGrow: 3, backgroundColor: "#07a316" }}>
          <View
            style={{
              flex: 1,
              flexGrow: 5,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity
              onPress={() => onLongHis()}
              style={[styles.button, { width: 48, height: 48 }]}
            >
              <FontAwesome name="history" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexGrow: 15,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <Text style={[styles.ans, { color: "#fff" }]}>History</Text>
          </View>
          <View style={{ flex: 1, flexGrow: 3 }}></View>
        </View>
        <View style={{ flex: 1, flexGrow: 7 }}>
          <ScrollView>
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              data={longHistory.toArray().reverse()}
              renderItem={({ item }) => {
                return item[0] !== "c" ? (
                  <TileLongHistory data={item} onPress={onLongPress} />
                ) : null;
              }}
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  const getMainCal = () => {
    const tileList = [
      ["+", "-", "×", "÷"],
      ["7", "8", "9", "C"],
      ["4", "5", "6", "="],
      ["1", "2", "3", "0"],
    ];
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexGrow: 3 }}>
          <View
            style={{
              flex: 1,
              flexGrow: 5,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.history}>
                <Text style={styles.history}>{history}</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onLongHis()}
              style={[styles.button, { width: 48, height: 48 }]}
            >
              <FontAwesome name="history" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexGrow: 15,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.ans, { flexWrap: "wrap", flexShrink: 1 }]}>
                {ans}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onDelete()}
              style={[styles.button, { width: 48, height: 48 }]}
            >
              {<Feather name="delete" size={32} color="#fff" />}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexGrow: 3 }}></View>
        </View>
        <View style={{ flex: 1, flexGrow: 7 }}>
          {tileList.map((str) => (
            <View key={Math.random()} style={{ flex: 1, flexDirection: "row" }}>
              {str.map((item) => (
                <TileNumber
                  key={Math.random()}
                  text={item}
                  onPress={onTilePress}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };
  if (isLong) {
    return getLongPanel();
  } else {
    return getMainCal();
  }
}

export default MainApp;
