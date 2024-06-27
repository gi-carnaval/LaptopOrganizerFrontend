import { SubmitHandler, useForm } from "react-hook-form"
import "./AddCartForm.css"
import { api } from "../../../lib/axios"
import { axiosErrorHandler } from "../../../utils/axiosErrorHandler"
import { useNavigate } from "react-router-dom"

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
    try {
      await api.post('/cart/', {
        name: data.cartName
      })
      alert(`Carrinho ${data.cartName} adicionado`)
      navigate("/")
    } catch (err) {
      const axiosError = axiosErrorHandler(err)
      alert(`${axiosError}`)
    }
  }
  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="inputLabel" htmlFor="cartName">Nome do Carrinho</label>
          <input className="cartNameInput" id="cartName" defaultValue="" placeholder="Ex. Carrinho 1" {...register("cartName", { required: "O nome do carrinho é obrigatório", pattern: {
            value: /^Carrinho \d+$/,
            message: 'O nome do carrinho deve estar no formato "Carrinho X" onde X é o número do carrinho'
          } })} />
          {errors.cartName && <span>{errors.cartName.message}</span>}
          <input className="inputButton" type="submit" value="Adicionar Carrinho" />
        </form>
      </div>
    </>
  )
}

export default AddCartForm