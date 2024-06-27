import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Cart.css';
import { MdDelete } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { axiosErrorHandler } from "../../utils/axiosErrorHandler";
import laptopRepository from "../../repositories/laptopRepository";
import { AxiosResponse } from "axios";
import { IGetLaptops } from "../../types/laptop";
import { RiArrowGoBackFill } from "react-icons/ri";
import { api } from "../../lib/axios";

export interface Laptop {
  id: string;
  cartId: string;
  laptopCode: number;
  cart: {
    name: string;
  };
}

export default function Cart() {
  const { slug } = useParams<{ slug: string }>();
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [cartName, setCartName] = useState<string | undefined>();
  const [axiosError, setAxiosError] = useState<string | undefined>();

  const navigate = useNavigate();

  async function fetchCarts(slug: string) {
    try {
      const response = await laptopRepository.getLaptops(slug)
      handleLaptopResponse(response)
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const handleLaptopResponse = (response: AxiosResponse<IGetLaptops>) => {
    if (response && Array.isArray(response.data.value)) {
      const laptops = response.data.value
      setLaptops(laptops)

      const cartName = laptops.length > 0 ? laptops[0].cart.name : 'Carrinho'
      setCartName(cartName)
    }
  }

  const handleAxiosError = (err: unknown) => {
    const axiosError = axiosErrorHandler(err)
    alert(axiosError)
    setAxiosError(axiosError)
  }

  const handleDelete = async (laptop: number) => {
    const password = prompt("Insira a senha de admin")
    if (password == "#Senai794*") {
      const confirmDelete = confirm(`Confirmar a exclusão do notebook ${laptop}`)

      if(confirmDelete){
        try {
          await api.delete("/laptop", {
            data: {
              laptopCode: laptop
            }
          })
        } catch (error) {
          handleAxiosError(error)
        }
      }
    } else {
      alert("Senha incorreta")
    }
  }


  useEffect(() => {
    if (slug) {
      fetchCarts(slug);
    }
  }, [slug]);

  return (
    <div className="cartContainer">
      <header className="headerBackButton">
        <button onClick={() => navigate("/")}><RiArrowGoBackFill /> Voltar</button>
      </header>
      <h1>{cartName}</h1>
      <button className="addLaptopButton" onClick={() => navigate(`./adicionar-notebook`)}>
        <CiCirclePlus style={{ fontSize: "2rem" }} />
        Adicionar Notebooks
      </button>
      <h2>Notebooks no carrinho</h2>
      {axiosError && <h1>{axiosError}</h1>}
      {laptops.length === 0 ? (
        <p>Nenhum notebook encontrado no carrinho.</p>
      ) : (
        <table className="laptops">
          <tbody>
            {laptops.map((laptop) => (
              <tr key={laptop.id}>
                <td className="laptopCode">{laptop.laptopCode}</td>
                <td className="deleteLaptop" onClick={() => handleDelete(laptop.laptopCode)}><MdDelete /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
