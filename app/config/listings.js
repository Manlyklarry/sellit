import colors from "./colors";
import {
  ALL_LISTINGS_CATEGORY,
  LISTING_CATEGORY_DEFINITIONS,
} from "../../shared/listingCategories";

export const DEFAULT_LISTING_IMAGE = require("../assets/listings/chair-laundry-basket.png");

const categoryPresentation = [
  {
    backgroundColor: colors.primary,
    browseColor: "primary",
    browseIcon: "sofa-single-outline",
    description: "Chairs, tables, sofas, and home pieces",
    icon: "sofa-single",
  },
  {
    backgroundColor: colors.secondary,
    browseColor: "info",
    browseIcon: "cellphone",
    description: "Phones, laptops, audio, and accessories",
    icon: "cellphone",
  },
  {
    backgroundColor: "#8e7dff",
    browseColor: "secondary",
    browseIcon: "hanger",
    description: "Shoes, fabric, shirts, and personal style",
    icon: "tshirt-crew",
  },
  {
    backgroundColor: "#f7b731",
    browseColor: "accent",
    browseIcon: "food-apple-outline",
    description: "Fresh produce, pantry goods, and local staples",
    icon: "food-apple",
  },
  {
    backgroundColor: "#45aaf2",
    browseColor: "info",
    browseIcon: "bike",
    description: "Bikes, fitness gear, balls, and outdoor items",
    icon: "basketball",
  },
  {
    backgroundColor: colors.medium,
    browseColor: "muted",
    browseIcon: "dots-horizontal-circle-outline",
    description: "Anything that does not fit the other categories",
    icon: "dots-horizontal-circle",
  },
];

export const LISTING_CATEGORIES = Object.freeze(
  LISTING_CATEGORY_DEFINITIONS.map((category, index) =>
    Object.freeze({
      ...categoryPresentation[index],
      label: category.label,
      value: category.id,
    })
  )
);

export const BROWSE_CATEGORIES = Object.freeze([
  {
    color: "primary",
    icon: "view-grid-outline",
    label: ALL_LISTINGS_CATEGORY,
  },
  ...LISTING_CATEGORIES.map(({ browseColor, browseIcon, label }) => ({
    color: browseColor,
    icon: browseIcon,
    label,
  })),
]);
