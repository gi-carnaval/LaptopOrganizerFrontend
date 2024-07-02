import { SubmitHandler, useForm } from "react-hook-form"
import "./AddCartForm.css"
import { api } from "../../../lib/axios"
import { axiosErrorHandler } from "../../../utils/axiosErrorHandler"
import { useNavigate } from "react-router-dom"
import { RiArrowGoBackFill } from "react-icons/ri"

type Inputs = {
  cartName: string
}

function AddCartForm() {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const password = prompt("Insira a senha de admin")

    if(!password) return

    try {
      await api.post('/cart/', {
        name: data.cartName,
        password: password
      })
      alert(`${data.cartName} adicionado`)
      navigate("/")
    } catch (err) {
      const axiosError = axiosErrorHandler(err)
      alert(`${axiosError}`)
    }
  }
  return (
    <>
      <header className="headerBackButton">
        <button onClick={() => navigate("/")}><RiArrowGoBackFill /> Voltar</button>
      </header>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="inputLabel" htmlFor="cartName">Nome do Carrinho</label>
          <input className="cartNameInput" id="cartName" defaultValue="" placeholder="Ex. Carrinho 1" {...register("cartName", {
            required: "O nome do carrinho é obrigatório", pattern: {
              value: /^Carrinho \d+$/,
              message: 'O nome do carrinho deve estar no formato "Carrinho X" onde X é o número do carrinho'
            }
          })} />
          {errors.cartName && <span>{errors.cartName.message}</span>}
          <input className="inputButton" type="submit" value="Adicionar Carrinho" />
        </form>
      </div>
    </>
  )
}

export default AddCartForm