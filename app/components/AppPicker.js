import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../config/theme";
import PickerItem from "./PickerItem";

function AppPicker({
  items,
  onSelectItem,
  placeholder = "Select an item",
  selectedItem,
  title = "Choose an option",
}) {
  const { theme } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const styles = createStyles(theme);

  const handleSelect = (item) => {
    onSelectItem(item);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.picker, pressed && styles.pressed]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedItem && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          color={theme.muted}
          size={24}
        />
      </Pressable>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setModalVisible(false)}
        />
        <SafeAreaView style={styles.sheet} edges={["bottom"]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons
                name="close"
                color={theme.muted}
                size={22}
              />
            </Pressable>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <PickerItem
                item={item}
                isSelected={selectedItem?.value === item.value}
                onPress={() => handleSelect(item)}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.overlay,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.mutedSurface,
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.border,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 18,
  },
  picker: {
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.input,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  placeholderText: {
    color: theme.muted,
  },
  pressed: {
    opacity: 0.75,
  },
  selectedText: {
    flex: 1,
    color: theme.foreground,
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 4,
  },
  sheet: {
    maxHeight: "78%",
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  title: {
    color: theme.foreground,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default AppPicker;
