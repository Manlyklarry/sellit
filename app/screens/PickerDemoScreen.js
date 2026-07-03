import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppPicker from "../components/AppPicker";
import colors from "../config/colors";

const categories = [
  {
    label: "Furniture",
    value: 1,
    description: "Chairs, tables, sofas, and home pieces",
    icon: "sofa-single",
    backgroundColor: colors.primary,
  },
  {
    label: "Electronics",
    value: 2,
    description: "Phones, laptops, audio, and accessories",
    icon: "cellphone",
    backgroundColor: colors.secondary,
  },
  {
    label: "Clothing",
    value: 3,
    description: "Shoes, fabric, shirts, and personal style",
    icon: "tshirt-crew",
    backgroundColor: "#8e7dff",
  },
  {
    label: "Food",
    value: 4,
    description: "Fresh produce, pantry goods, and local staples",
    icon: "food-apple",
    backgroundColor: "#f7b731",
  },
  {
    label: "Sports",
    value: 5,
    description: "Bikes, fitness gear, balls, and outdoor items",
    icon: "basketball",
    backgroundColor: "#45aaf2",
  },
];

function PickerDemoScreen() {
  const [category, setCategory] = useState();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.label}>Category</Text>
        <AppPicker
          items={categories}
          selectedItem={category}
          onSelectItem={setCategory}
          placeholder="Choose a category"
          title="Select category"
        />

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Selected</Text>
          <Text style={styles.previewText}>
            {category ? category.label : "No category selected"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    color: colors.medium,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  preview: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  previewLabel: {
    color: colors.medium,
    fontSize: 13,
    marginBottom: 4,
  },
  previewText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "700",
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default PickerDemoScreen;
