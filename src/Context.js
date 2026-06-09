// context.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [value, setValue] = useState('Hello from context!');
  const [refetchEmployees, setRefetchEmployees] = useState(false)
  const [refetchBusiness, setRefetchBusiness] = useState(false)

  return (
    <MyContext.Provider value={{ value, setValue, refetchEmployees, setRefetchEmployees, refetchBusiness, setRefetchBusiness }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to consume the context
export const useMyContext = () => useContext(MyContext);
