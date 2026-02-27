import { useState } from "react";

export function useTextFilter(initial = "") {
  const [query, setQuery] = useState(initial);

  function includes(value) {
    return String(value || "").toLowerCase().includes(query.toLowerCase());
  }

  return {
    query,
    setQuery,
    includes,
  };
}