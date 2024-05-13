import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavegationBar from "./components/NavegationBar"; 
function App() {
  return (
    <BrowserRouter>
    <NavegationBar />
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
