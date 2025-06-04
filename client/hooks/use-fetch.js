import { useState, useEffect, useCallback } from "react";

export default (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: customOptions.method || options.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(customOptions.headers || {}),
          },
          body: customOptions.body
            ? JSON.stringify(customOptions.body)
            : options.body
            ? JSON.stringify(options.body)
            : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    if (options.method === "GET") {
      fetchData();
    }
  }, [fetchData, options.method]);

  return { data, loading, error, fetchData };
};
