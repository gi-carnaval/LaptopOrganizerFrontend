import Modal from 'react-modal';
import './UpdateLaptopCodeInCartModal.css'
import closeImg from '../../../assets/close.svg';
import { api } from '../../../lib/axios';

interface UpdateLaptopCodeInCartModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    laptopAndCart?: {
        laptopCode?: number,
        cartSlug?: string
    }
}

export function UpdateLaptopCodeInCartModal({ isOpen, onRequestClose, laptopAndCart }: UpdateLaptopCodeInCartModalProps) {

    const updateLaptopCart = async (laptopCode?: number, cartSlug?: string) => {
        try {
            await api.put("/laptop", {
                laptopCode: laptopCode,
                newCartSlug: cartSlug
            })
            alert(`Notebook ${laptopCode} adicionado ao ${cartSlug}`)
        } catch (error) {
            console.log(error)
            alert("Erro ao atualizar notebook em carrinho")
        } finally {
            onRequestClose()
        }


    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button
                type="button"
                onClick={onRequestClose}
                className="react-modal-close"
            >
                <img src={closeImg} alt="Fechar modal" />
            </button>

            <div className='container'>
                <p>{laptopAndCart && `Deseja mover o Notebook ${laptopAndCart.laptopCode} para o carrinho Atual?`}</p>

                <div className='buttons'>
                    <button onClick={() => updateLaptopCart(laptopAndCart?.laptopCode, laptopAndCart?.cartSlug)}>Mover</button>
                    <button>Cancelar</button>
                </div>
            </div>
        </Modal>
    );
}