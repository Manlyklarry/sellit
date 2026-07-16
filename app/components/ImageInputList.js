import { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import ImageInput from "./ImageInput";

function ImageInputList({
  imageLimit = 6,
  imageUris = [],
  onAddImage,
  onRemoveImage,
}) {
  const scrollView = useRef(null);

  return (
    <ScrollView
      horizontal
      ref={scrollView}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      onContentSizeChange={() => scrollView.current?.scrollToEnd()}
    >
      {imageUris.map((image) => (
        <View key={typeof image === "string" ? image : image.uri} style={styles.image}>
          <ImageInput imageUri={image} onChangeImage={() => onRemoveImage(image)} />
        </View>
      ))}
      {imageUris.length < imageLimit ? (
        <ImageInput onChangeImage={(uri) => uri && onAddImage(uri)} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  image: {
    marginRight: 10,
  },
});

export default ImageInputList;
