import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";

function TileNumber(props) {
  const onTilePress = () => {
    props.onPress(props.text);
  };
  const getBGColor = () => {
    if (props.text === "C" || props.text === "=") {
      return "#07a316";
    } else if (!isNaN(props.text)) {
      return "#242424";
    } else {
      return "#006a94";
    }
  };
  return (
    <TouchableOpacity
      onPress={() => onTilePress()}
      style={[styles.button, { backgroundColor: getBGColor() }]}
    >
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    alignItems: "center",
    //backgroundColor:'#12e338' ,
    borderColor: "#a4a5a6",
    borderWidth: 1,
    //borderRadius: 5,
    //padding: 30,
    justifyContent: "center",
    //marginVertical: 5,
    //marginHorizontal: 5,
    width: "25%",
    // height: '25%'
  },
  text: {
    color: "#ffff",
    fontSize: 28,
  },
});
export default TileNumber;
