import { useEffect, useState } from "react"
import { api } from "../../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import './Cart.css'
import { MdDelete } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";

export interface Laptop {
  id: string;
  cartId: string;
  laptopCode: number;
  cart: {
    name: string
  }
}

export default function Cart() {
  const { slug } = useParams<{ slug: string }>();
  const [laptops, setLaptops] = useState<Laptop[]>()
  const cartName = laptops ? laptops[0].cart.name : ''

  async function fetchCarts() {
    try {
      const response = await api.get(`/cart/${slug}/laptops`)
      response && setLaptops(response.data)
    } catch (err) {
      alert("Não foi possível carregar os notebooks")
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  const navigate = useNavigate()

  return laptops ? (
    <div className="cartContainer">
      <h1>{cartName}</h1>
        <button className="addLaptopButton" onClick={() => navigate(`./addLaptop`)}>
          <CiCirclePlus style={{ fontSize: "2rem" }} />
          Adicionar Notebooks
        </button>
      <h2>Notebooks no carrinho</h2>
      <table className="laptops">
        {
          laptops.map((laptop) => {
            return (
              <tr>
                <td className="laptopCode">{laptop.laptopCode}</td>
                <td className="editLaptop"><MdDelete /></td>
              </tr>
            )
          })
        }
      </table>
    </div>

  ) : (
    <h1>Laptops não encontrados</h1>
  )
}