/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export let user = {
  data: null,
  mime_type: null,
  img_URL: null,
};

export let prevUser = {
  data: null,
  mime_type: null,
  prompt: null,
  img_URL: null,
};

export const dataContext = createContext();

function UserContext({ children }) {
  let [startRes, setStartRes] = useState(false);
  let [popUp, setPopUp] = useState(false);
  let [input, setInput] = useState("");
  let [feature, setFeature] = useState("chat");
  let [resultOutput, setResultOutput] = useState("");
  let [prevFeature, setPrevFeature] = useState("chat");
  let [genImageUrl,setGenImageUrl]=useState("");


  let value = {
    startRes,
    setStartRes,
    popUp,
    setPopUp,
    input,
    setInput,
    feature,
    setFeature,
    resultOutput,
    setResultOutput,
    prevFeature, 
    setPrevFeature,
    genImageUrl,
    setGenImageUrl
  };

  return (
    <dataContext.Provider value={value}>{children}</dataContext.Provider>
  );
}

export default UserContext;
