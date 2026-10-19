
import React from "react";
import { ScrollView, View } from "react-native";

import useAdminThekaDetails from "../../hooks/useAdminThekaDetails";

import ThekaDetailsHeader from "../../components/admin/adminThekaDetailScreen/ThekaDetailsHeader";
import ThekaDocumentPlaceholder from "../../components/admin/adminThekaDetailScreen/ThekaDocumentPlaceholder";
import ThekaDetailsGrid from "../../components/admin/adminThekaDetailScreen/ThekaDetailsGrid";
import ThekaActionButtons from "../../components/admin/adminThekaDetailScreen/ThekaActionButtons";
import {
  ThekaDetailsLoading,
  ThekaDetailsError,
} from "../../components/admin/adminThekaDetailScreen/ThekaDetailsState";

import styles from "../../components/admin/adminThekaDetailScreen/ThekaDetailsStyles";

export default function AdminThekaDetailsScreen({
  route,
  navigation,
}) {
  const { thekaId } = route.params;

  const {
    theka,
    loading,
    busy,
    error,
    loadDetails,
    performAction,
  } = useAdminThekaDetails(thekaId, navigation);

  const isPending =
    String(theka?.status ?? "").toUpperCase() === "PENDING";

  return (
    <View style={styles.container}>
      <ThekaDetailsHeader
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <ThekaDetailsLoading />
      ) : error || !theka ? (
        <ThekaDetailsError
          message={error || "Theka details are unavailable."}
          onRetry={loadDetails}
          onBack={() => navigation.goBack()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThekaDocumentPlaceholder />

          <ThekaDetailsGrid theka={theka} />

          {isPending && (
            <ThekaActionButtons
              busy={busy}
              onApprove={() => performAction("approve")}
              onReject={() => performAction("reject")}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
