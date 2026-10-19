
import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const admin = colors.admin;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: admin.background,
  },

  header: {
    backgroundColor: admin.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  adminLabel: {
    color: admin.accent,
    backgroundColor: admin.headerLabel,
    overflow: "hidden",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontWeight: "800",
    fontSize: 11,
    marginBottom: 8,
  },
  headerTitle: {
    color: admin.background,
    fontSize: 26,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: admin.headerSubtitle,
    fontSize: 12,
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: admin.logoutBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  logoutText: {
    color: admin.background,
    fontWeight: "600",
    fontSize: 12,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  sectionTabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  sectionTab: {
    backgroundColor: admin.tabBackground,
    borderRadius: 24,
    paddingHorizontal: 19,
    paddingVertical: 10,
  },
  activeSectionTab: {
    backgroundColor: admin.activeTab,
  },
  sectionTabText: {
    color: admin.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  activeSectionTabText: {
    color: admin.background,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    height: 76,
    borderWidth: 1,
    borderColor: admin.border,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: admin.background,
  },
  statNumber: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: admin.muted,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: admin.tabBackground,
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  activeFilter: {
    backgroundColor: admin.activeTab,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: admin.muted,
  },
  activeFilterText: {
    color: admin.background,
  },

  list: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 16,
    flexGrow: 1,
  },
  listCard: {
    borderWidth: 1,
    borderColor: admin.border,
    borderRadius: 17,
    padding: 15,
    marginBottom: 10,
    backgroundColor: admin.background,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    color: admin.text,
    fontWeight: "700",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: admin.muted,
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: admin.green,
  },
  approveText: {
    color: admin.background,
    fontSize: 13,
    fontWeight: "700",
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: admin.red,
    backgroundColor: admin.background,
  },
  rejectText: {
    color: admin.red,
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: admin.red,
    borderRadius: 12,
    height: 42,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: admin.red,
    fontSize: 13,
    fontWeight: "700",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 25,
  },
  emptyTitle: {
    color: admin.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  emptyText: {
    color: admin.muted,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  errorText: {
    color: admin.red,
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: admin.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },
  retryText: {
    color: admin.background,
    fontWeight: "700",
  },
});
