import { useEffect, useRef, useState } from "react";

import { addListing } from "../api/listings";
import { UI_TIMINGS } from "../config/constants";

const initialUploadState = {
  done: false,
  error: null,
  progress: 0,
  visible: false,
};

function useListingUpload({ closeDelay = UI_TIMINGS.uploadSuccessMs } = {}) {
  const closeUploadTimer = useRef(null);
  const [uploadState, setUploadState] = useState(initialUploadState);

  useEffect(
    () => () => {
      if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);
    },
    []
  );

  const resetUploadState = () => {
    setUploadState(initialUploadState);
  };

  const uploadListing = async (listing) => {
    if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);

    setUploadState({
      done: false,
      error: null,
      progress: 0,
      visible: true,
    });

    try {
      const result = await addListing(listing, (progress) => {
        setUploadState((currentState) => ({
          ...currentState,
          progress,
        }));
      });

      setUploadState({
        done: true,
        error: null,
        progress: 1,
        visible: true,
      });

      closeUploadTimer.current = setTimeout(() => {
        resetUploadState();
        closeUploadTimer.current = null;
      }, closeDelay);

      return result;
    } catch (error) {
      resetUploadState();
      setUploadState((currentState) => ({
        ...currentState,
        error: error.message,
      }));
      throw error;
    }
  };

  return {
    uploadListing,
    uploadState,
  };
}

export default useListingUpload;
