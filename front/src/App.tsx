import { Route, Routes } from "react-router-dom"
import Home from "./page/Home.js"
import Product from "./page/Product.js"
import Navbar from "./components/Navbar.js"
const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/product" element={<Product/>} />
    </Routes>
    
  
    
    </>
  )
}

export default App