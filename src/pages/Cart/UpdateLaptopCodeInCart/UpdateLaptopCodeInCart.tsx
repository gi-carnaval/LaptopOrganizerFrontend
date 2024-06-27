import Modal from 'react-modal';
import './UpdateLaptopCodeInCartModal.css'
import closeImg from '../../../assets/close.svg';
import { api } from '../../../lib/axios';
import { Bounce, toast } from 'react-toastify';

interface UpdateLaptopCodeInCartModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    laptopAndCart?: {
        laptopCode?: number,
        cartSlug?: string
    }
}

export function UpdateLaptopCodeInCartModal({ isOpen, onRequestClose, laptopAndCart }: UpdateLaptopCodeInCartModalProps) {

    const successToast = (laptopCode: number, cartSlug: string) => toast.success(`Notebook ${laptopCode} adicionado ao ${cartSlug}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    const errorToast = () => toast.success("Erro ao atualizar notebook em carrinho", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    const updateLaptopCart = async (laptopCode?: number, cartSlug?: string) => {
        try {
            await api.put("/laptop", {
                laptopCode: laptopCode,
                newCartSlug: cartSlug
            })
            cartSlug && laptopCode && successToast(laptopCode, cartSlug)
        } catch (error) {
            errorToast()
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
                    <button onClick={() => updateLaptopCart(laptopAndCart?.laptopCode, laptopAndCart?.cartSlug)} className="moveButton">Mover</button>
                    <button onClick={() => onRequestClose()} className="cancelButton">Cancelar</button>
                </div>
            </div>
        </Modal>
    );
}