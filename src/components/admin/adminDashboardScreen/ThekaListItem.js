
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import StatusBadge from "./StatusBadge";
import { getThekaDisplayStatus } from "./utils/adminDashboardUtils";
import { styles } from "./adminStyles";

export default function ThekaListItem({
  item,
  filter,
  busyId,
  onPress,
  onApprove,
  onReject,
  onDelete,
}) {
  const id = item.id ?? item._id;
  const status = getThekaDisplayStatus(item, filter);
  const expired = status === "EXPIRED";
  const busy = busyId === id;

  const subtitle = expired
    ? item.licenseExpiry
      ? `License expired: ${item.licenseExpiry}`
      : "License expired"
    : `${item.ownerName || item.owner?.name || "Owner"} · ${
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "Recently submitted"
      }`;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.listCard}
      onPress={() => onPress(id)}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>
            {item.name || item.thekaName || "Unnamed Theka"}
          </Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>

        <StatusBadge status={status} />
      </View>

      {expired ? (
        <TouchableOpacity
          style={styles.deleteButton}
          disabled={busy}
          onPress={() => onDelete(id)}
        >
          <Text style={styles.deleteText}>
            {busy ? "Please wait..." : "Delete listing"}
          </Text>
        </TouchableOpacity>
      ) : status === "PENDING" ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            disabled={busy}
            onPress={() => onApprove(id)}
          >
            <Text style={styles.approveText}>
              {busy ? "Please wait..." : "Approve"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            disabled={busy}
            onPress={() => onReject(id)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.cardSubtitle}>
          {item.contactPhone || item.contact_phone || ""}
        </Text>
      )}
    </TouchableOpacity>
  );
}
