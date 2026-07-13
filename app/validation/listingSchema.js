import * as Yup from "yup";

import { LISTING_LIMITS } from "../../shared/listingValidation";

export const listingValidationSchema = Yup.object({
  category: Yup.object().nullable().required("Category is required."),
  description: Yup.string()
    .required("Description is required.")
    .min(LISTING_LIMITS.descriptionMin, `Description must be at least ${LISTING_LIMITS.descriptionMin} characters.`)
    .max(LISTING_LIMITS.descriptionMax, `Description must be ${LISTING_LIMITS.descriptionMax} characters or less.`),
  images: Yup.array()
    .min(1, "Please add at least one photo.")
    .max(LISTING_LIMITS.imageMax, `You can add up to ${LISTING_LIMITS.imageMax} photos.`)
    .required("Please add at least one photo."),
  price: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? undefined : value)
    .typeError("Price must be a number.")
    .required("Price is required.")
    .min(LISTING_LIMITS.priceMin, `Price must be at least ${LISTING_LIMITS.priceMin}.`),
  title: Yup.string()
    .required("Name of item is required.")
    .min(LISTING_LIMITS.titleMin, `Name of item must be at least ${LISTING_LIMITS.titleMin} characters.`)
    .max(LISTING_LIMITS.titleMax, `Name of item must be ${LISTING_LIMITS.titleMax} characters or less.`),
});
