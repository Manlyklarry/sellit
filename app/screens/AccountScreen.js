import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOut } from "../api/auth";
import { updateProfile } from "../api/users";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";
import Icon from "../components/Icon";
import ListItem from "../components/ListItem";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import ListItemSeparator from "../components/ListItemSeparator";
import ThemeToggle from "../components/ThemeToggle";
import { useAppTheme } from "../config/theme";
import useCurrentUser from "../hooks/useCurrentUser";
import { ROOT_ROUTES, TAB_ROUTES } from "../navigation/routes";

const accountStats = [
  { label: "Active", value: "5" },
  { label: "Unread", value: "2" },
  { label: "Rating", value: "4.9" },
];

const initialMessages = [
  {
    id: 1,
    title: "Kwame Mensah",
    subTitle:
      "Is the bicycle still available? I can come by this evening if that works for you.",
    time: "2m",
    unread: true,
    image: require("../assets/profiles/larry.jpeg"),
  },
  {
    id: 2,
    title: "Ama Boateng",
    subTitle: "Can you deliver the kente cloth today?",
    time: "1h",
    unread: true,
  },
  {
    id: 3,
    title: "Kofi Addo",
    subTitle: "I can pick up the charcoal stove this evening.",
    time: "Yesterday",
  },
];

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
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");
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

  const handleDelete = (message) => {
    setMessages(messages.filter((item) => item.id !== message.id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setMessages(initialMessages);
    setTimeout(() => setRefreshing(false), 900);
  };

  const unreadMessages = messages.filter((message) => message.unread).length;

  const accountActions = [
    {
      id: "listings",
      icon: "storefront-outline",
      label: "My Listings",
      meta: `${accountStats[0].value} active`,
      color: theme.primary,
      softColor: theme.primarySoft,
      onPress: () => navigation.navigate(TAB_ROUTES.FEED),
    },
    {
      id: "messages",
      icon: "message-text-outline",
      label: "My Messages",
      meta:
        unreadMessages > 0
          ? `${unreadMessages} unread`
          : `${messages.length} conversations`,
      color: theme.secondary,
      softColor: theme.secondarySoft,
      onPress: () => console.log("My Messages"),
    },
  ];

  const chooseProfileImage = () => {
    Alert.alert("Profile photo", "Choose a profile image.", [
      { text: "Take photo", onPress: takeProfilePhoto },
      { text: "Choose from gallery", onPress: selectProfileImage },
      ...(profileImageSource
        ? [
            {
              text: "Remove photo",
              style: "destructive",
              onPress: () => {
                setDraftImageUri(null);
                setRemoveImage(true);
                setProfileSaved(false);
              },
            },
          ]
        : []),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takeProfilePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow camera access to take a profile photo.");
      return;
    }

    setSelectedProfileImage(await ImagePicker.launchCameraAsync(profileImageOptions));
  };

  const selectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to choose a profile photo.");
      return;
    }

    setSelectedProfileImage(
      await ImagePicker.launchImageLibraryAsync(profileImageOptions)
    );
  };

  const setSelectedProfileImage = (result) => {
    if (result.canceled) return;

    setDraftImageUri(result.assets[0].uri);
    setRemoveImage(false);
    setProfileSaved(false);
  };

  const handleSaveProfile = async () => {
    const trimmedName = name.replace(/\s+/g, " ").trim();
    const normalizedUsername = username.trim().toLowerCase();

    setProfileError(null);
    setProfileSaved(false);

    if (!currentUser?.id && !currentUser?.email) {
      setProfileError("Sign in again before updating your profile.");
      return;
    }

    if (trimmedName.length < 2) {
      setProfileError("Display name must be at least 2 characters.");
      return;
    }

    if (
      normalizedUsername &&
      !/^[a-z0-9_]{3,24}$/.test(normalizedUsername)
    ) {
      setProfileError(
        "Username must be 3-24 characters using letters, numbers, or underscores."
      );
      return;
    }

    setProfileSaving(true);

    try {
      const updatedUser = await updateProfile({
        imageUri: draftImageUri,
        name: trimmedName,
        removeImage,
        user: currentUser,
        username: normalizedUsername,
      });

      setName(updatedUser?.name || trimmedName);
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
    try {
      await signOut();
    } catch (error) {
      console.log("Logout failed", error.message);
    }

    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: ROOT_ROUTES.AUTH }],
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        style={styles.scroller}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={ListItemSeparator}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>Profile</Text>
                <Text style={styles.heading}>Your account</Text>
              </View>
              <ThemeToggle />
            </View>

            <View style={styles.summaryPanel}>
              <View>
                <Text style={styles.summaryTitle}>{displayName}</Text>
                <Text style={styles.summaryText}>
                  {currentUser?.email || "Local seller dashboard"}
                </Text>
              </View>
              <View style={styles.statsGrid}>
                {accountStats.map((stat) => (
                  <View key={stat.label} style={styles.statCard}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.profileContainer}>
              <ListItem
                title={displayName}
                subTitle="5 Listings"
                image={profileImageSource}
                showChevron
                onPress={chooseProfileImage}
              />
            </View>

            <View style={styles.editProfilePanel}>
              <View style={styles.editHeader}>
                <Pressable
                  accessibilityRole="button"
                  onPress={chooseProfileImage}
                  style={styles.avatarButton}
                >
                  {profileImageSource ? (
                    <Image
                      source={profileImageSource}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarInitial}>
                      {displayName.charAt(0).toUpperCase()}
                    </Text>
                  )}
                  <View style={styles.avatarEditBadge}>
                    <MaterialCommunityIcons
                      name="camera"
                      color="#ffffff"
                      size={15}
                    />
                  </View>
                </Pressable>
                <View style={styles.editHeaderText}>
                  <Text style={styles.editTitle}>Profile details</Text>
                  <Text style={styles.editMeta}>
                    Shown on your listings and messages.
                  </Text>
                </View>
              </View>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={(value) => {
                  setName(value);
                  setProfileSaved(false);
                }}
                placeholder="Display name"
                placeholderTextColor={theme.muted}
                style={styles.profileInput}
                value={name}
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => {
                  setUsername(value);
                  setProfileSaved(false);
                }}
                placeholder="username"
                placeholderTextColor={theme.muted}
                style={styles.profileInput}
                value={username}
              />
              {profileError ? (
                <Text style={styles.profileError}>{profileError}</Text>
              ) : null}
              {profileSaved ? (
                <Text style={styles.profileSuccess}>Profile updated.</Text>
              ) : null}
              <AppButton
                disabled={profileSaving}
                onPress={handleSaveProfile}
                title={profileSaving ? "Saving..." : "Save profile"}
              />
            </View>

            <View style={styles.actionsSection}>
              <View style={styles.actionsHeader}>
                <Text style={styles.actionsTitle}>Account shortcuts</Text>
                <Text style={styles.actionsMeta}>Seller tools</Text>
              </View>
              <View style={styles.actionGrid}>
                {accountActions.map((action) => (
                  <Pressable
                    accessibilityRole="button"
                    key={action.id}
                    onPress={action.onPress}
                    style={({ pressed }) => [
                      styles.actionTile,
                      pressed && styles.actionTilePressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.actionIcon,
                        { backgroundColor: action.softColor },
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={action.color}
                        name={action.icon}
                        size={22}
                      />
                    </View>
                    <View style={styles.actionTextWrap}>
                      <Text style={styles.actionLabel} numberOfLines={1}>
                        {action.label}
                      </Text>
                      <Text style={styles.actionMeta} numberOfLines={1}>
                        {action.meta}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.actionArrow,
                        { borderColor: action.softColor },
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={action.color}
                        name="chevron-right"
                        size={19}
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.logoutContainer}>
              <ListItem
                title="Logout"
                showChevron
                IconComponent={
                  <Icon name="logout" backgroundColor={theme.danger} />
                }
                onPress={handleLogout}
              />
            </View>

            <View style={styles.messagesHeader}>
              <Text style={styles.messagesTitle}>Messages</Text>
              <Text style={styles.messagesMeta}>
                {messages.length} conversations
              </Text>
            </View>
            {refreshing ? (
              <AppActivityIndicator compact message="Refreshing messages..." />
            ) : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No messages</Text>
            <Text style={styles.emptyText}>
              Buyer conversations will appear here.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.subTitle}
            image={item.image}
            rightText={item.time}
            showBadge={item.unread}
            showChevron
            subTitleNumberOfLines={2}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
            onPress={() => console.log(item.title)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const profileImageOptions = {
  allowsEditing: true,
  aspect: [1, 1],
  mediaTypes: ["images"],
  quality: 0.8,
};

function getDisplayName(user) {
  return user?.username || user?.name || "Local seller";
}

function getProfileImageSource({ currentUser, draftImageUri, removeImage }) {
  if (draftImageUri) return { uri: draftImageUri };
  if (removeImage) return null;
  if (currentUser?.image) return { uri: currentUser.image };

  return null;
}

const createStyles = (theme) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scroller: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 170,
  },
  profileContainer: {
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 14,
    marginTop: 14,
    overflow: "hidden",
  },
  avatarButton: {
    alignItems: "center",
    backgroundColor: theme.secondary,
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  avatarEditBadge: {
    alignItems: "center",
    backgroundColor: theme.primary,
    borderColor: theme.card,
    borderRadius: 13,
    borderWidth: 2,
    bottom: 0,
    height: 26,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 26,
  },
  avatarImage: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  avatarInitial: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
  },
  editHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 14,
  },
  editHeaderText: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  editMeta: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3,
  },
  editProfilePanel: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 14,
  },
  editTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
  profileError: {
    color: theme.danger,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  profileInput: {
    backgroundColor: theme.input,
    borderColor: theme.border,
    borderRadius: 12,
    borderWidth: 1,
    color: theme.foreground,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  profileSuccess: {
    color: theme.secondary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  actionsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionsMeta: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "900",
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionsTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
  actionArrow: {
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    marginLeft: 8,
    width: 28,
  },
  actionGrid: {
    gap: 10,
  },
  actionIcon: {
    alignItems: "center",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  actionLabel: {
    color: theme.foreground,
    fontSize: 15,
    fontWeight: "900",
  },
  actionMeta: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  actionTextWrap: {
    flex: 1,
    marginLeft: 11,
    minWidth: 0,
  },
  actionTile: {
    alignItems: "center",
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 72,
    padding: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.mode === "dark" ? 0.16 : 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  actionTilePressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  logoutContainer: {
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 28,
  },
  emptyText: {
    color: theme.muted,
    marginTop: 4,
    textAlign: "center",
  },
  emptyTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "700",
  },
  messagesHeader: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  messagesMeta: {
    color: theme.muted,
    marginTop: 2,
  },
  messagesTitle: {
    color: theme.foreground,
    fontSize: 22,
    fontWeight: "700",
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
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heading: {
    color: theme.foreground,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },
  statCard: {
    backgroundColor: theme.input,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  statLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statValue: {
    color: theme.foreground,
    fontSize: 20,
    fontWeight: "900",
  },
  summaryPanel: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: theme.mode === "dark" ? 0.2 : 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  summaryText: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },
  summaryTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
});

export default AccountScreen;
