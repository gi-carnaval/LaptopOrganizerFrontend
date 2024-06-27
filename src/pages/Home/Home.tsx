import { Link } from 'react-router-dom';
import './Home.css';
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

  return carts && carts?.length !== 0 ? (
    <>
      <h1 className="pageTitle">Organizador de Notebook em Carrinhos - SENAI</h1>
      <div className="dashboard">
        <h2 className="dashboardTitle">Notebooks por carrinho</h2>
        {carts.map((cart) => {
          return (
            <div className="cartCard" key={cart.id}>
              <div className="cardInfos">
                <h3>{cart.name}</h3>
                <span>{cart._count.laptops}</span>
              </div>
              <div>
                <Link to={`carrinho/${cart.slug}`}>
                  <button>Visualizar Notebooks</button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      <div className="footerButtons">
        <Link to="/carrinho/adicionar-carrinho"><button className="addCart" >Adicionar novo carrinho</button></Link>
        <Link to="notebooks"><button className="" >Verificar carrinho do notebook</button></Link>
      </div>
    </>
  ) : (
    <div>
      <h3>Carrinhos não encontrados</h3>
      <Link to="/carrinho/adicionar-carrinho"><button className="addCart">Adicionar novo carrinho</button></Link>
    </div>
  )
}