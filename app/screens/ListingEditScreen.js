import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { getCurrentUser } from "../auth/session";
import {
  AppForm,
  AppFormField,
  AppFormPicker,
  FormImagePicker,
  SubmitButton,
} from "../components/forms";
import LocationPicker from "../components/LocationPicker";
import ThemeToggle from "../components/ThemeToggle";
import UploadScreen from "../components/UploadScreen";
import colors from "../config/colors";
import { useAppTheme } from "../config/theme";
import useListingUpload from "../hooks/useListingUpload";
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
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { uploadListing, uploadState } = useListingUpload();
  const {
    address,
    error: locationError,
    geocoding,
    getLocation,
    loading: locationLoading,
    location,
  } =
    useLocation();

  const handleSubmit = async (values, { resetForm }) => {
    const currentUser = await getCurrentUser();
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
      seller: currentUser,
    };

    try {
      await uploadListing(listing);
      resetForm({ values: initialValues });
    } catch {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <UploadScreen
        done={uploadState.done}
        progress={uploadState.progress}
        visible={uploadState.visible}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Create</Text>
            <Text style={styles.heading}>New listing</Text>
          </View>
          <ThemeToggle compact />
        </View>
        <View style={styles.tipPanel}>
          <View style={styles.tipIcon}>
            <MaterialCommunityIcons
              color={theme.accent}
              name="creation"
              size={20}
            />
          </View>
          <View style={styles.tipTextWrap}>
            <Text style={styles.tipTitle}>Listings with clear photos sell faster</Text>
            <Text style={styles.tipText}>
              Add a direct title, fair price, category, and pickup location.
            </Text>
          </View>
        </View>

        <AppForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {uploadState.error ? (
            <Text style={styles.error}>{uploadState.error}</Text>
          ) : null}
          <View style={styles.panel}>
            <Text style={styles.label}>Photos</Text>
            <FormImagePicker imageLimit={6} name="images" />
          </View>

          <View style={styles.panel}>
            <Text style={styles.label}>Details</Text>
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
            <AppFormField
              multiline
              name="description"
              numberOfLines={4}
              placeholder="Description"
              textAlignVertical="top"
            />
          </View>
          <View style={styles.panel}>
            <Text style={styles.label}>Pickup</Text>
            <LocationPicker
              address={address}
              error={locationError}
              loading={locationLoading || geocoding}
              location={location}
              onRefresh={getLocation}
              refreshing={locationLoading || geocoding}
            />
          </View>
          <SubmitButton title="Post" />
        </AppForm>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  error: {
    color: theme.danger,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  heading: {
    color: theme.foreground,
    fontSize: 30,
    fontWeight: "900",
  },
  label: {
    color: theme.foreground,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  eyebrow: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  panel: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
  },
  tipIcon: {
    alignItems: "center",
    backgroundColor: theme.accentSoft,
    borderRadius: 14,
    height: 42,
    justifyContent: "center",
    marginRight: 12,
    width: 42,
  },
  tipPanel: {
    alignItems: "center",
    backgroundColor: theme.cardMuted,
    borderColor: theme.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 16,
    padding: 14,
  },
  tipText: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3,
  },
  tipTextWrap: {
    flex: 1,
  },
  tipTitle: {
    color: theme.foreground,
    fontSize: 14,
    fontWeight: "900",
  },
});

export default ListingEditScreen;
