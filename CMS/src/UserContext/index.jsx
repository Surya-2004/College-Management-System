import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('Admin');
  const [username, setUsername] = useState('admin');

  return (
    <UserContext.Provider value={{ role, setRole, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using context
export const useUser = () => useContext(UserContext);
