import { useCallback, useEffect, useState } from "react";

import { getCurrentUser } from "../auth/session";

function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCurrentUser = useCallback(async () => {
    setLoading(true);

    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (active) setCurrentUser(user);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    currentUser,
    loading,
    refreshCurrentUser,
  };
}

export default useCurrentUser;
