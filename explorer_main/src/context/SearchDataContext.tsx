"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchDataContextType {
  data: any;
  setData: (data: any) => void;
}

const SearchDataContext = createContext<SearchDataContextType | undefined>(
  undefined
);

export function SearchDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>(null);
  return (
    <SearchDataContext.Provider value={{ data, setData }}>
      {children}
    </SearchDataContext.Provider>
  );
}

export function useSearchData() {
  const context = useContext(SearchDataContext);
  if (!context) {
    throw new Error("useSearchData must be used within a SearchDataProvider");
  }
  return context;
}
