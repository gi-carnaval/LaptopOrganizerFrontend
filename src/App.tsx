import './App.css';
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import AddLaptop from './pages/Cart/AddLaptop';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/notebooks" element={<h1>Notebook</h1>}></Route>
          <Route path="/cart/:slug" element={<Cart />}></Route>
          <Route path="/cart/:slug/addLaptop" element={<AddLaptop />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;