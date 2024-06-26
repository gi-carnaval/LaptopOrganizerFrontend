import Modal from 'react-modal';
import './UpdateLaptopCodeInCartModal.css'
import closeImg from '../../../assets/close.svg';

interface UpdateLaptopCodeInCartModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    laptopAndCart?: {
      laptopCode?: string,
      cartSlug?: string
    }
}

export function UpdateLaptopCodeInCartModal({ isOpen, onRequestClose, laptopAndCart }: UpdateLaptopCodeInCartModalProps) {
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
              <p>{laptopAndCart && `Deseja mover o Notebook ${laptopAndCart.laptopCode?.substring(0, 7)} para o carrinho Atual?`}</p>

              <div className='buttons'>
                <button>Mover</button>
                <button>Cancelar</button>
              </div>
            </div>
        </Modal>
    );
}