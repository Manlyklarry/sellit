import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  FormImagePicker,
  SubmitButton,
} from "../components/forms";
import LocationPicker from "../components/LocationPicker";
import colors from "../config/colors";
import useLocation from "../hooks/useLocation";

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
  images: Yup.array()
    .min(1, "Please add at least one photo.")
    .max(6, "You can add up to 6 photos."),
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
  const {
    address,
    error: locationError,
    geocoding,
    getLocation,
    loading: locationLoading,
    location,
  } =
    useLocation();

  const handleSubmit = async (values) => {
    const locationSnapshot = location ? null : await getLocation();
    const currentLocation = location || locationSnapshot?.location;
    const currentAddress = locationSnapshot?.address || address;
    const listing = {
      ...values,
      location: currentLocation
        ? {
            address: currentAddress,
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }
        : null,
    };

    console.log("New listing", listing);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>New Listing</Text>

        <AppForm
          initialValues={{
            images: [],
            title: "",
            price: "",
            category: null,
            description: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Photos</Text>
            <FormImagePicker name="images" />
          </View>

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
          <LocationPicker
            address={address}
            error={locationError}
            loading={locationLoading || geocoding}
            location={location}
            onRefresh={getLocation}
            refreshing={locationLoading || geocoding}
          />
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
  label: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  section: {
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
  },
});

export default ListingEditScreen;
