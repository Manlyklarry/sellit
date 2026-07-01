import { Image, StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";

function ListItem({ image, subTitle, title }) {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {title ? title.charAt(0).toUpperCase() : ""}
          </Text>
        </View>
      )}

      <View>
        <Text style={styles.title}>{title}</Text>
        {subTitle ? <Text style={styles.subTitle}>{subTitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#6e6969",
  },
  title: {
    fontWeight: "500",
  },
});

export default ListItem;
