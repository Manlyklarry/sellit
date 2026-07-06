import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { addListing } from "../api/listings";
import {
  AppForm,
  AppFormField,
  AppFormPicker,
  FormImagePicker,
  SubmitButton,
} from "../components/forms";
import LocationPicker from "../components/LocationPicker";
import UploadScreen from "../components/UploadScreen";
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
  {
    label: "Others",
    value: 6,
    description: "Anything that does not fit the other categories",
    icon: "dots-horizontal-circle",
    backgroundColor: colors.medium,
  },
];

const validationSchema = Yup.object().shape({
  images: Yup.array()
    .min(1, "Please add at least one photo.")
    .max(6, "You can add up to 6 photos.")
    .required("Please add at least one photo."),
  title: Yup.string()
    .required("Name of item is required.")
    .min(3, "Name of item must be at least 3 characters.")
    .max(80, "Name of item must be 80 characters or less."),
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

const initialValues = {
  images: [],
  title: "",
  price: "",
  category: null,
  description: "",
};

function ListingEditScreen() {
  const closeUploadTimer = useRef(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const {
    address,
    error: locationError,
    geocoding,
    getLocation,
    loading: locationLoading,
    location,
  } =
    useLocation();

  useEffect(
    () => () => {
      if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);
    },
    []
  );

  const handleSubmit = async (values, { resetForm }) => {
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

    try {
      setUploadError(null);
      setUploadDone(false);
      setUploadProgress(0);
      setUploadVisible(true);

      await addListing(listing, (progress) => {
        setUploadProgress(progress);
      });

      setUploadProgress(1);
      setUploadDone(true);
      resetForm({ values: initialValues });

      if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);
      closeUploadTimer.current = setTimeout(() => {
        setUploadVisible(false);
        setUploadDone(false);
        setUploadProgress(0);
        closeUploadTimer.current = null;
      }, 2400);
    } catch (error) {
      if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);
      setUploadVisible(false);
      setUploadDone(false);
      setUploadProgress(0);
      setUploadError(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <UploadScreen
        done={uploadDone}
        progress={uploadProgress}
        visible={uploadVisible}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>New Listing</Text>

        <AppForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {uploadError ? <Text style={styles.error}>{uploadError}</Text> : null}
          <View style={styles.section}>
            <Text style={styles.label}>Photos</Text>
            <FormImagePicker imageLimit={6} name="images" />
          </View>

          <AppFormField
            autoCorrect={false}
            icon="format-title"
            name="title"
            placeholder="Name of item"
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
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
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
    paddingBottom: 120,
  },
});

export default ListingEditScreen;
