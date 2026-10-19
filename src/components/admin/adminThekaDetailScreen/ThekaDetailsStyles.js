import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const adminColors = colors.admin;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },

  header: {
    backgroundColor: adminColors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: adminColors.logoutBorder ?? adminColors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 27,
    lineHeight: 30,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: adminColors.headerSubtitle ?? "#E8D9DF",
    fontSize: 12,
    marginTop: 5,
  },

  content: {
    padding: 20,
    paddingBottom: 36,
  },

  documentPlaceholder: {
    height: 105,
    backgroundColor: adminColors.tabBackground ?? adminColors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  documentIcon: {
    color: adminColors.muted,
    fontSize: 27,
    marginBottom: 4,
  },

  documentText: {
    color: adminColors.muted,
    fontSize: 12,
    fontWeight: "500",
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  detailCard: {
    width: "48%",
    flexGrow: 1,
    minHeight: 76,
    backgroundColor: adminColors.surface,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: 13,
    padding: 13,
  },

  detailLabel: {
    color: adminColors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 8,
  },

  detailValue: {
    color: adminColors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  approveButton: {
    backgroundColor: adminColors.green,
  },

  rejectButton: {
    backgroundColor: adminColors.surface,
    borderWidth: 1,
    borderColor: adminColors.red,
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  rejectText: {
    color: adminColors.red,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: adminColors.background,
    gap: 12,
  },

  stateText: {
    color: adminColors.text,
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: adminColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  backText: {
    color: adminColors.accent,
    fontSize: 13,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },
});
