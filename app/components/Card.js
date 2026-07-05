import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";

function Card({ image, onPress, subTitle, title }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.subTitle} numberOfLines={1} ellipsizeMode="tail">
          {subTitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  title: {
    color: colors.black,
    marginBottom: 7,
    lineHeight: 20,
  },
});

export default Card;
