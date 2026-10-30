
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { placesAPI } from "../api/client";
import colors from "../constants/colors";

export default function SearchHistoryScreen({ navigation }) {
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingLocation, setEditingLocation] = useState(null);
  const [labelInput, setLabelInput] = useState("");
  const [savingLabel, setSavingLabel] = useState(false);

  const fetchSavedLocations = useCallback(async () => {
    try {
      const response = await placesAPI.getSavedLocations();
      const result = response?.data?.data ?? [];

      setSavedLocations(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(
        "Fetch saved locations error:",
        error?.response?.data || error.message
      );

      Alert.alert("Error", "Unable to load saved locations.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSavedLocations();
    }, [fetchSavedLocations])
  );

  const openLocation = (item) => {
    const latitude = Number(item.latitude);
    const longitude = Number(item.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      Alert.alert("Invalid Location", "This location has invalid coordinates.");
      return;
    }

    navigation.navigate("HomeTab", {
      screen: "Home",
      params: {
        savedLocation: {
          id: item.id,
          label: item.label || "Saved location",
          latitude,
          longitude,
        },
      },
    });
  };

  const openRenameModal = (item) => {
    setEditingLocation(item);
    setLabelInput(item.label || "");
  };

  const closeRenameModal = () => {
    if (savingLabel) return;

    setEditingLocation(null);
    setLabelInput("");
  };

  const saveRenamedLocation = async () => {
    const label = labelInput.trim();

    if (!label) {
      Alert.alert("Label Required", "Please enter a label.");
      return;
    }

    if (label.length > 100) {
      Alert.alert("Label Too Long", "Labels can contain at most 100 characters.");
      return;
    }

    if (!editingLocation || savingLabel) return;

    try {
      setSavingLabel(true);

      const response = await placesAPI.renameSavedLocation(
        editingLocation.id,
        { label }
      );

      const updatedLocation = response?.data?.data;

      setSavedLocations((previous) =>
        previous.map((item) =>
          item.id === editingLocation.id
            ? { ...item, ...(updatedLocation || {}), label }
            : item
        )
      );

      setEditingLocation(null);
      setLabelInput("");

      Alert.alert("Success", "Saved location renamed successfully.");
    } catch (error) {
      console.error(
        "Rename saved location error:",
        error?.response?.data || error.message
      );

      Alert.alert(
        "Unable to Rename",
        error?.response?.data?.message ||
          "Could not update the label. Please try again."
      );
    } finally {
      setSavingLabel(false);
    }
  };

  const deleteLocation = (item) => {
    Alert.alert(
      "Delete Saved Location",
      `Delete "${item.label || "Saved location"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(item.id);

              await placesAPI.deleteSavedLocation(item.id);

              setSavedLocations((previous) =>
                previous.filter((location) => location.id !== item.id)
              );
            } catch (error) {
              console.error(
                "Delete saved location error:",
                error?.response?.data || error.message
              );

              Alert.alert(
                "Error",
                error?.response?.data?.message ||
                  "Unable to delete this location."
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.locationInfo}
        onPress={() => openLocation(item)}
        activeOpacity={0.75}
      >
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={22} color={colors.primary} />
        </View>

        <View style={styles.locationText}>
          <Text style={styles.locationLabel} numberOfLines={2}>
            {item.label || "Saved location"}
          </Text>

          <Text style={styles.coordinates}>
            {Number(item.latitude).toFixed(5)},{" "}
            {Number(item.longitude).toFixed(5)}
          </Text>

          {item.searchedAt ? (
            <Text style={styles.dateText}>{item.searchedAt}</Text>
          ) : null}

          <Text style={styles.openHint}>Tap to view on map</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openRenameModal(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil-outline" size={16} color="#1B4332" />
          <Text style={styles.editButtonText}>Edit label</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteLocation(item)}
          disabled={deletingId === item.id}
          activeOpacity={0.8}
        >
          {deletingId === item.id ? (
            <ActivityIndicator size="small" color="#B91C1C" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={16} color="#B91C1C" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1B4332" />
        <Text style={styles.loadingText}>Loading saved locations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Saved Locations</Text>
        <Text style={styles.subtitle}>
          {savedLocations.length}{" "}
          {savedLocations.length === 1 ? "location" : "locations"} saved
        </Text>
      </View>

      <FlatList
        data={savedLocations}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={
          savedLocations.length === 0 ? styles.emptyList : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchSavedLocations();
            }}
            colors={["#1B4332"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={54} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No saved locations</Text>
            <Text style={styles.emptyDescription}>
              Save a location from the Home map to find it here later.
            </Text>
          </View>
        }
      />

      <Modal
        visible={Boolean(editingLocation)}
        transparent
        animationType="fade"
        onRequestClose={closeRenameModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="create-outline" size={26} color="#1B4332" />
            </View>

            <Text style={styles.modalTitle}>Rename Location</Text>
            <Text style={styles.modalDescription}>
              Give this saved location a name you'll recognize.
            </Text>

            <TextInput
              style={styles.labelInput}
              value={labelInput}
              onChangeText={setLabelInput}
              placeholder="e.g. Home, Office, Favourite Shop"
              placeholderTextColor="#9CA3AF"
              maxLength={100}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveRenamedLocation}
              editable={!savingLabel}
              selectTextOnFocus
            />

            <Text style={styles.characterCount}>
              {labelInput.length}/100
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeRenameModal}
                disabled={savingLabel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  savingLabel && styles.disabledButton,
                ]}
                onPress={saveRenamedLocation}
                disabled={savingLabel}
              >
                {savingLabel ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 23,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 110,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 7,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    flex: 1,
    marginHorizontal: 12,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  coordinates: {
    marginTop: 5,
    fontSize: 12,
    color: "#6B7280",
  },
  dateText: {
    marginTop: 4,
    fontSize: 11,
    color: "#9CA3AF",
  },
  openHint: {
    marginTop: 5,
    fontSize: 12,
    color: "#1B4332",
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 13,
    paddingTop: 11,
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "#E8F3EC",
  },
  editButtonText: {
    fontWeight: "600",
    color: "#1B4332",
    fontSize: 13,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    fontWeight: "600",
    color: "#B91C1C",
    fontSize: 13,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 35,
    paddingVertical: 30,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  emptyDescription: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
    backgroundColor: "rgba(0,0,0,0.48)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    padding: 22,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F3EC",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2937",
  },
  modalDescription: {
    marginTop: 7,
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 20,
    color: "#6B7280",
    fontSize: 13,
  },
  labelInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 15,
  },
  characterCount: {
    marginTop: 5,
    textAlign: "right",
    fontSize: 11,
    color: "#9CA3AF",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontWeight: "600",
    color: "#374151",
  },
  saveButton: {
    flex: 1.4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1B4332",
  },
  saveButtonText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.65,
  },
});
