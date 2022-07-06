import React, { useContext, useReducer, useState } from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
const UtilityContext = React.createContext();
export const useUtility = () => {
  return useContext(UtilityContext);
};
const initialState = {
  error: {
    status: false,
    message: "This is an Error !",
  },

  loader: {
    status: false,
    message: null,
  },
};

const utilityReducer = (state, action) => {
  if (action.type === "error") {
    return { ...state, error: action.payload };
  }
  if (action.type === "loader") {
    return { ...state, loader: action.payload };
  }
};

export const UtilityHandler = ({ children }) => {
  const [state, dispatcher] = useReducer(utilityReducer, initialState);

  ////////////////////////////////////////////////////
  const errorHandler = (error) => {
    dispatcher({ type: "error", payload: error });
  };

  ////////////////////////////////////////////////////
  const loadingHandler = (loader) => {
    dispatcher({ type: "loader", payload: loader });
  };

  const value = {
    loading: state.loader,
    error: state.error,
    loadingHandler,
    errorHandler,
  };
  return <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>;
};
