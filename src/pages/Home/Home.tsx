import { Link } from 'react-router-dom';
import './style.css';
import { api } from '../../lib/axios';
import { useEffect, useState } from 'react';

export interface CartProps {
  id: string;
  name: string;
  slug: string;
  _count: {
    laptops: number;
  }
}

export default function Home() {
  const [carts, setCarts] = useState<CartProps[]>()

  async function fetchCarts() {
    try {
      const response = await api.get('carts')
      response && setCarts(response.data)
    } catch (err) {
      alert("Não foi possível carregar os notebooks")
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  return carts ? (
    <>
      <h1 className="pageTitle">Organizador de Notebook em Carrinhos - SENAI</h1>
      <div className="dashboard">
        <h2 className="dashboardTitle">Notebooks por carrinho</h2>
        {carts.map((cart) => {
          return (
            <div className="cartCard">
              <div className="cardInfos">
                <h3>{cart.name}</h3>
                <span>{cart._count.laptops}</span>
              </div>
              <div>
                <Link to={`cart/${cart.slug}`}>
                  <button>Visualizar Notebooks</button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      <Link to="addCartForm"><button>Adicionar novo carrinho</button></Link>

    </>
  ) : (
    <div>
      <h3>Carrinhos não encontrados</h3>
    </div>
  )
}