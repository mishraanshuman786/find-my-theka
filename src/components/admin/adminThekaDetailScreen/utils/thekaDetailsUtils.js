
export const getThekaDetails = (theka) => [
  ["Theka Name", theka.name ?? theka.thekaName],
  ["Owner", theka.ownerName ?? theka.owner?.name],
  ["Phone", theka.contactPhone ?? theka.contact_phone],
  ["GST", theka.gstNumber ?? theka.gst_number],
  ["License", theka.licenseNumber ?? theka.license_number],
  [
    "License Expiry",
    theka.licenseExpiryDate ?? theka.license_expiry_date,
  ],
  ["Address", theka.address],
  ["City", theka.city],
  ["State", theka.state],
  ["Pincode", theka.pincode],
  ["Status", theka.status],
];

export const formatDetailValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Not provided";
  }

  return String(value);
};
