import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

import { useAppTheme } from "../config/theme";

const imagePickerOptions = {
  allowsEditing: true,
  aspect: [4, 3],
  mediaTypes: ["images"],
  quality: 0.8,
};

function ImageInput({ imageUri, onChangeImage }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    if (!imageUri) {
      chooseImageSource();
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

  const chooseImageSource = () => {
    Alert.alert("Add photo", "Choose how to add this item photo.", [
      { text: "Take photo", onPress: takePhoto },
      { text: "Choose from gallery", onPress: selectImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow camera access to take pictures of your item."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync(imagePickerOptions);

    setSelectedImage(result);
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

    const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

    setSelectedImage(result);
  };

  const setSelectedImage = (result) => {
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
              color="#ffffff"
            />
          </View>
        </>
      ) : (
        <MaterialCommunityIcons
          color={theme.muted}
          name="camera-plus"
          size={38}
        />
      )}
    </Pressable>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: theme.input,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.border,
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
