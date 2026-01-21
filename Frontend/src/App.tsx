import { NavLink, Route, Routes } from "react-router-dom";
import { SpookyContext, SpookyProvider, useSpooky } from './contexts/SpookyContext';
import "./app.css";
//import NotFoundComponent from "./core/components/NotFoundComponent";
import Main from "./components/pages/mainPage.tsx";
import Tmp from "./components/tmps.tsx";
import Bin from "./components/pages/binPage.tsx";

export default function App() {
  return <>
      <Routes>
        <Route path="/main" element={<Main/>} />
        <Route path="/bin" element={<Bin/>} />
        <Route path="*" element={<Tmp/>} />
      </Routes>
  </>
  ;
};