import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppFormPicker from "../components/forms/AppFormPicker";
import SubmitButton from "../components/forms/SubmitButton";
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

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required.")
    .min(3, "Title must be at least 3 characters.")
    .max(80, "Title must be 80 characters or less."),
  price: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Price must be a number.")
    .required("Price is required.")
    .min(1, "Price must be at least 1."),
  category: Yup.object().nullable().required("Category is required."),
  description: Yup.string()
    .required("Description is required.")
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description must be 500 characters or less."),
});

function ListingEditScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>New Listing</Text>

        <AppForm
          initialValues={{
            title: "",
            price: "",
            category: null,
            description: "",
          }}
          onSubmit={(values) => console.log("New listing", values)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCorrect={false}
            icon="format-title"
            name="title"
            placeholder="Title"
          />
          <AppFormField
            icon="cash"
            keyboardType="numeric"
            name="price"
            placeholder="Price Ghc"
            width={140}
          />
          <AppFormPicker
            items={categories}
            name="category"
            placeholder="Category"
            title="Select category"
          />
          <View style={styles.descriptionContainer}>
            <AppFormField
              multiline
              name="description"
              numberOfLines={4}
              placeholder="Description"
              textAlignVertical="top"
            />
          </View>
          <SubmitButton title="Post" />
        </AppForm>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    marginTop: 0,
  },
  heading: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    padding: 20,
  },
});

export default ListingEditScreen;

