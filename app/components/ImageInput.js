import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

import colors from "../config/colors";

function ImageInput({ imageUri, onChangeImage }) {
  const handlePress = () => {
    if (!imageUri) {
      selectImage();
      return;
    }

    Alert.alert("Delete", "Remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onChangeImage(null),
      },
    ]);
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow photo access to add pictures to your listing."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) return;

    onChangeImage(result.assets[0].uri);
  };

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        imageUri && styles.imageContainer,
      ]}
      onPress={handlePress}
    >
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.deleteBadge}>
            <MaterialCommunityIcons
              name="close"
              size={16}
              color={colors.white}
            />
          </View>
        </>
      ) : (
        <MaterialCommunityIcons
          color={colors.medium}
          name="camera-plus"
          size={38}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee8e8",
  },
  deleteBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    borderWidth: 0,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ImageInput;
