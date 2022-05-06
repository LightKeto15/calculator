import { Text, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import styles from "../styles/MainStyle";
function TileLongHistory(props) {
  const onTilePress = () => {
    props.onPress(props.data);
  };

  return (
    <View style={{ marginBottom: 0 }}>
      <TouchableOpacity
        onPress={() => onTilePress()}
        style={styles.listContainer}
      >
        <Text style={[styles.textColor, { fontSize: 20 }]}>
          {props.data[0] + " = " + props.data[1]}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TileLongHistory;
