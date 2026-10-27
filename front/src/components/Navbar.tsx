import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div>
        <Link to="/">Home</Link>
        <br/>
        <Link to="/product">Product</Link>
    </div>
  )
}

export default Navbar