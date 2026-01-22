import { NavLink, Route, Routes } from "react-router-dom";
import "./app.css";
import Main from "./components/pages/mainPage.tsx";
import Bin from "./components/pages/binPage.tsx";

export default function App() {
  return <>
      <Routes>
        <Route path="/main/:id" element={<Main/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/bin" element={<Bin/>} />
      </Routes>
  </>
  ;
};