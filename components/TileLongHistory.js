import { Text, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import styles from "../styles/MainStyle";
class TileLongHistory extends Component {
  onTilePress = () => {
    this.props.onPress(this.props.data);
  };

  render() {
    return (
      <View style={{ marginBottom: 0 }}>
        <TouchableOpacity
          onPress={() => this.onTilePress()}
          style={styles.listContainer}
        >
          <Text style={[styles.textColor, { fontSize: 20 }]}>
            {this.props.data[0] + " = " + this.props.data[1]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default TileLongHistory;
