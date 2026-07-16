import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
import { LISTING_CATEGORIES } from "../config/listings";
import { useAppTheme } from "../config/theme";
import useListingUpload from "../hooks/useListingUpload";
import useLocation from "../hooks/useLocation";
import { listingValidationSchema } from "../validation/listingSchema";

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
          validationSchema={listingValidationSchema}
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
              items={LISTING_CATEGORIES}
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
