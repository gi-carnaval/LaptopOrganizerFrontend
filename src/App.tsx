import './App.css';
import {
  Route,
  BrowserRouter,
  Routes,
  Link,
} from "react-router-dom";
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import AddLaptop from './pages/Cart/AddLaptop';
import AddCartForm from './pages/Cart/AddCartForm';
import { IoHome } from 'react-icons/io5';
import FindLaptopCart from './pages/FindLaptopCart';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/notebooks" element={<FindLaptopCart />}></Route>
          <Route path="/carrinho/:slug/adicionar-notebook" element={<AddLaptop />}></Route>
          <Route path="/carrinho/:slug" element={<Cart />}></Route>
          <Route path="/carrinho/adicionar-carrinho" element={<AddCartForm />}></Route>
        </Routes>
        <nav>
          <Link to="/"><IoHome /> Home</Link>
        </nav>
      </BrowserRouter>
    </div>
  );
}

export default App;