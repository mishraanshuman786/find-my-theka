
import colors from "../../../../constants/colors";

export const FILTERS = ["PENDING", "APPROVED", "EXPIRED"];

export const unwrap = (response) =>
  response?.data?.data ?? response?.data ?? {};

export const getList = (response, keys = []) => {
  const result = unwrap(response);

  if (Array.isArray(result)) return result;

  for (const key of keys) {
    if (Array.isArray(result?.[key])) {
      return result[key];
    }
  }

  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.rows)) return result.rows;

  return [];
};

export const getStatusColor = (status) => {
  const admin = colors.admin;

  switch (String(status || "").toUpperCase()) {
    case "APPROVED":
    case "VERIFIED":
      return {
        bg: admin.approvedBackground,
        text: admin.green,
      };

    case "EXPIRED":
    case "REJECTED":
      return {
        bg: admin.expiredBackground,
        text: admin.red,
      };

    case "ADMIN":
      return {
        bg: admin.roleBackground,
        text: admin.roleText,
      };

    default:
      return {
        bg: admin.pendingBackground,
        text: admin.orange,
      };
  }
};

export const getThekaDisplayStatus = (item, filter) => {
  const actualStatus = String(item.status || "").toUpperCase();

  if (filter === "EXPIRED" || actualStatus === "EXPIRED") {
    return "EXPIRED";
  }

  if (
    filter === "APPROVED" ||
    actualStatus === "VERIFIED" ||
    actualStatus === "APPROVED"
  ) {
    return "APPROVED";
  }

  return actualStatus || filter;
};
