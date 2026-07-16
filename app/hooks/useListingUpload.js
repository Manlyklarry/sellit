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
  const uploadController = useRef(null);
  const mounted = useRef(true);
  const [uploadState, setUploadState] = useState(initialUploadState);

  useEffect(
    () => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        uploadController.current?.abort();
        if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);
      };
    },
    []
  );

  const resetUploadState = () => {
    setUploadState(initialUploadState);
  };

  const uploadListing = async (listing) => {
    if (closeUploadTimer.current) clearTimeout(closeUploadTimer.current);
    uploadController.current?.abort();
    const controller = new AbortController();
    uploadController.current = controller;

    setUploadState({
      done: false,
      error: null,
      progress: 0,
      visible: true,
    });

    try {
      const result = await addListing(listing, (progress) => {
        if (!mounted.current) return;
        setUploadState((currentState) => ({
          ...currentState,
          progress,
        }));
      }, { signal: controller.signal });

      if (!mounted.current) return result;

      setUploadState({
        done: true,
        error: null,
        progress: 1,
        visible: true,
      });

      closeUploadTimer.current = setTimeout(() => {
        if (!mounted.current) return;
        resetUploadState();
        closeUploadTimer.current = null;
      }, closeDelay);

      return result;
    } catch (error) {
      if (!mounted.current || error.name === "AbortError") throw error;
      resetUploadState();
      setUploadState((currentState) => ({
        ...currentState,
        error: error.message,
      }));
      throw error;
    } finally {
      if (uploadController.current === controller) uploadController.current = null;
    }
  };

  return {
    uploadListing,
    uploadState,
  };
}

export default useListingUpload;
