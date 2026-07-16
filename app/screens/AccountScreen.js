import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOut } from "../api/auth";
import { updateProfile } from "../api/users";
import AppButton from "../components/AppButton";
import ThemeToggle from "../components/ThemeToggle";
import { useAppTheme } from "../config/theme";
import useCurrentUser from "../hooks/useCurrentUser";
import { ROOT_ROUTES, TAB_ROUTES } from "../navigation/routes";
import {
  normalizeDisplayName,
  normalizeUsername,
  validateDisplayName,
  validateUsername,
} from "../../shared/profileValidation";
import {
  hasRegisteredPushToken,
  registerForPushNotifications,
  unregisterCurrentPushToken,
} from "../notifications/pushNotifications";

const profileImageOptions = {
  allowsEditing: true,
  aspect: [1, 1],
  mediaTypes: ["images"],
  quality: 0.8,
};

function AccountScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { currentUser, refreshCurrentUser } = useCurrentUser();
  const [draftImageUri, setDraftImageUri] = useState(null);
  const [name, setName] = useState("");
  const [profileError, setProfileError] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [username, setUsername] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  const displayName = getDisplayName(currentUser);
  const profileImageSource = getProfileImageSource({
    currentUser,
    draftImageUri,
    removeImage,
  });

  useEffect(() => {
    setName(currentUser?.name || "");
    setUsername(currentUser?.username || "");
    setDraftImageUri(null);
    setRemoveImage(false);
  }, [currentUser?.id, currentUser?.name, currentUser?.username]);

  useEffect(() => {
    let active = true;
    hasRegisteredPushToken()
      .then((enabled) => {
        if (active) setNotificationsEnabled(enabled);
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, []);

  const chooseProfileImage = () => {
    Alert.alert("Profile photo", "Choose a profile image.", [
      { text: "Take photo", onPress: takeProfilePhoto },
      { text: "Choose from gallery", onPress: selectProfileImage },
      ...(profileImageSource
        ? [{ text: "Remove photo", style: "destructive", onPress: removeProfileImage }]
        : []),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takeProfilePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Allow camera access to take a profile photo.");
      return;
    }
    applySelectedImage(await ImagePicker.launchCameraAsync(profileImageOptions));
  };

  const selectProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to choose a profile photo.");
      return;
    }
    applySelectedImage(
      await ImagePicker.launchImageLibraryAsync(profileImageOptions)
    );
  };

  const applySelectedImage = (result) => {
    if (result.canceled) return;
    setDraftImageUri(result.assets[0]);
    setRemoveImage(false);
    setProfileSaved(false);
  };

  const removeProfileImage = () => {
    setDraftImageUri(null);
    setRemoveImage(true);
    setProfileSaved(false);
  };

  const handleSaveProfile = async () => {
    const normalizedName = normalizeDisplayName(name);
    const normalizedUser = normalizeUsername(username);
    const validationError =
      validateDisplayName(normalizedName) || validateUsername(normalizedUser);

    setProfileError(null);
    setProfileSaved(false);

    if (!currentUser?.id && !currentUser?.email) {
      setProfileError("Sign in again before updating your profile.");
      return;
    }
    if (validationError) {
      setProfileError(validationError);
      return;
    }

    setProfileSaving(true);
    try {
      const updatedUser = await updateProfile({
        imageUri: draftImageUri,
        name: normalizedName,
        removeImage,
        username: normalizedUser,
      });
      setName(updatedUser?.name || normalizedName);
      setUsername(updatedUser?.username || "");
      setDraftImageUri(null);
      setRemoveImage(false);
      setProfileSaved(true);
      await refreshCurrentUser();
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut().catch(() => null);
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: ROOT_ROUTES.AUTH }],
    });
  };

  const handleNotifications = async () => {
    setNotificationsSaving(true);
    try {
      if (notificationsEnabled) {
        await unregisterCurrentPushToken();
        setNotificationsEnabled(false);
      } else {
        const token = await registerForPushNotifications();
        if (!token) {
          Alert.alert("Notifications disabled", "Permission was not granted in system settings.");
          return;
        }
        setNotificationsEnabled(true);
      }
    } catch (error) {
      Alert.alert("Notification settings", error.message);
    } finally {
      setNotificationsSaving(false);
    }
  };

  const shortcuts = [
    {
      color: theme.primary,
      icon: "storefront-outline",
      id: "browse",
      label: "Browse listings",
      onPress: () => navigation.navigate(TAB_ROUTES.FEED),
    },
    {
      color: theme.secondary,
      icon: "plus-box-outline",
      id: "sell",
      label: "Create a listing",
      onPress: () => navigation.navigate(TAB_ROUTES.SELL),
    },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Profile</Text>
            <Text style={styles.heading}>Your account</Text>
          </View>
          <ThemeToggle />
        </View>

        <View style={styles.identityPanel}>
          <Pressable
            accessibilityLabel="Change profile photo"
            accessibilityRole="button"
            onPress={chooseProfileImage}
            style={styles.avatarButton}
          >
            {profileImageSource ? (
              <Image source={profileImageSource} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
            <View style={styles.avatarEditBadge}>
              <MaterialCommunityIcons name="camera" color="#ffffff" size={15} />
            </View>
          </Pressable>
          <View style={styles.identityCopy}>
            <Text style={styles.identityName}>{displayName}</Text>
            <Text style={styles.identityEmail} numberOfLines={1}>
              {currentUser?.email || "Seller account"}
            </Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Profile details</Text>
          <Text style={styles.panelDescription}>
            These details appear with your marketplace listings.
          </Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={(value) => { setName(value); setProfileSaved(false); }}
            placeholder="Display name"
            placeholderTextColor={theme.muted}
            style={styles.input}
            value={name}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(value) => { setUsername(value); setProfileSaved(false); }}
            placeholder="username"
            placeholderTextColor={theme.muted}
            style={styles.input}
            value={username}
          />
          {profileError ? <Text style={styles.error}>{profileError}</Text> : null}
          {profileSaved ? <Text style={styles.success}>Profile updated.</Text> : null}
          <AppButton
            disabled={profileSaving}
            onPress={handleSaveProfile}
            title={profileSaving ? "Saving..." : "Save profile"}
          />
        </View>

        <Text style={styles.sectionTitle}>Seller tools</Text>
        <View style={styles.shortcuts}>
          {shortcuts.map((shortcut) => (
            <Pressable
              accessibilityRole="button"
              key={shortcut.id}
              onPress={shortcut.onPress}
              style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons
                color={shortcut.color}
                name={shortcut.icon}
                size={24}
              />
              <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
              <MaterialCommunityIcons
                color={theme.muted}
                name="chevron-right"
                size={22}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Notifications</Text>
          <Text style={styles.panelDescription}>
            Choose whether this device receives marketplace and inquiry alerts.
          </Text>
          <AppButton
            disabled={notificationsSaving}
            onPress={handleNotifications}
            title={
              notificationsSaving
                ? "Saving..."
                : notificationsEnabled
                  ? "Disable notifications"
                  : "Enable notifications"
            }
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={theme.danger} name="logout" size={22} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function getDisplayName(user) {
  return user?.username || user?.name || "Local seller";
}

function getProfileImageSource({ currentUser, draftImageUri, removeImage }) {
  if (draftImageUri) {
    return {
      uri:
        typeof draftImageUri === "string" ? draftImageUri : draftImageUri.uri,
    };
  }
  if (removeImage) return null;
  return currentUser?.image ? { uri: currentUser.image } : null;
}

const createStyles = (theme) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 140 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: theme.secondary, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  heading: { color: theme.foreground, fontSize: 30, fontWeight: "900", marginTop: 2 },
  identityPanel: { flexDirection: "row", alignItems: "center", backgroundColor: theme.card, borderColor: theme.border, borderRadius: 16, borderWidth: 1, marginTop: 20, padding: 16 },
  avatarButton: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", backgroundColor: theme.secondary },
  avatarImage: { width: 76, height: 76, borderRadius: 38 },
  avatarInitial: { color: "#ffffff", fontSize: 29, fontWeight: "900" },
  avatarEditBadge: { position: "absolute", right: 0, bottom: 0, width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: theme.card, backgroundColor: theme.primary, alignItems: "center", justifyContent: "center" },
  identityCopy: { flex: 1, minWidth: 0, marginLeft: 14 },
  identityName: { color: theme.foreground, fontSize: 19, fontWeight: "900" },
  identityEmail: { color: theme.muted, fontSize: 13, fontWeight: "600", marginTop: 4 },
  panel: { backgroundColor: theme.card, borderColor: theme.border, borderRadius: 16, borderWidth: 1, marginTop: 16, padding: 16 },
  panelTitle: { color: theme.foreground, fontSize: 18, fontWeight: "900" },
  panelDescription: { color: theme.muted, fontSize: 13, lineHeight: 19, marginTop: 4, marginBottom: 14 },
  input: { minHeight: 50, borderRadius: 10, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.input, color: theme.foreground, fontSize: 15, fontWeight: "600", marginBottom: 10, paddingHorizontal: 12 },
  error: { color: theme.danger, fontSize: 13, fontWeight: "700" },
  success: { color: theme.secondary, fontSize: 13, fontWeight: "800" },
  sectionTitle: { color: theme.foreground, fontSize: 18, fontWeight: "900", marginTop: 22, marginBottom: 10 },
  shortcuts: { gap: 10 },
  shortcut: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, paddingHorizontal: 14 },
  shortcutLabel: { flex: 1, color: theme.foreground, fontSize: 15, fontWeight: "800" },
  logout: { minHeight: 58, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.danger, marginTop: 24 },
  logoutText: { color: theme.danger, fontSize: 15, fontWeight: "900" },
  pressed: { opacity: 0.75 },
});

export default AccountScreen;
