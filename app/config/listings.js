import colors from "./colors";

export const DEFAULT_LISTING_IMAGE = require("../assets/listings/chair-laundry-basket.png");

export const LISTING_CATEGORIES = Object.freeze([
  {
    backgroundColor: colors.primary,
    browseColor: "primary",
    browseIcon: "sofa-single-outline",
    description: "Chairs, tables, sofas, and home pieces",
    icon: "sofa-single",
    label: "Furniture",
    value: 1,
  },
  {
    backgroundColor: colors.secondary,
    browseColor: "info",
    browseIcon: "cellphone",
    description: "Phones, laptops, audio, and accessories",
    icon: "cellphone",
    label: "Electronics",
    value: 2,
  },
  {
    backgroundColor: "#8e7dff",
    browseColor: "secondary",
    browseIcon: "hanger",
    description: "Shoes, fabric, shirts, and personal style",
    icon: "tshirt-crew",
    label: "Clothing",
    value: 3,
  },
  {
    backgroundColor: "#f7b731",
    browseColor: "accent",
    browseIcon: "food-apple-outline",
    description: "Fresh produce, pantry goods, and local staples",
    icon: "food-apple",
    label: "Food",
    value: 4,
  },
  {
    backgroundColor: "#45aaf2",
    browseColor: "info",
    browseIcon: "bike",
    description: "Bikes, fitness gear, balls, and outdoor items",
    icon: "basketball",
    label: "Sports",
    value: 5,
  },
  {
    backgroundColor: colors.medium,
    browseColor: "muted",
    browseIcon: "dots-horizontal-circle-outline",
    description: "Anything that does not fit the other categories",
    icon: "dots-horizontal-circle",
    label: "Other",
    value: 6,
  },
]);

export const BROWSE_CATEGORIES = Object.freeze([
  { color: "primary", icon: "view-grid-outline", label: "All" },
  ...LISTING_CATEGORIES.map(({ browseColor, browseIcon, label }) => ({
    color: browseColor,
    icon: browseIcon,
    label,
  })),
]);
