import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "../src/components/Navbar";
import Items from "../src/components/Items";
import Lists from "../src/components/Lists";

export interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Lists />} />
          <Route path="list">
            <Route index element={<Items />} />
            <Route path=":listid" element={<Items />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
