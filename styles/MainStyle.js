import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: 'center',
    //justifyContent: 'flex-start',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#242424", //'#32a856',
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    marginVertical: 5,
    width: "100%",
    height: "100%",
  },
  history: {
    fontSize: 30,
    marginLeft: 30,
  },
  ans: {
    fontSize: 40,
    margin: 20,
    flexShrink: 1,
  },
  listContainer: {
    borderColor: "#b9babd",
    borderWidth: 2,
    padding: 5,
  },
});

export default styles;
