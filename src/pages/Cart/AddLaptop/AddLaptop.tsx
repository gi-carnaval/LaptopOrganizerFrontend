import { useEffect, useState } from 'react';
import './AddLaptop.css';

import { Scanner } from '@yudiel/react-qr-scanner';
import { api } from '../../../lib/axios';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { UpdateLaptopCodeInCartModal } from '../UpdateLaptopCodeInCart/UpdateLaptopCodeInCart';

interface AxiosErrorProps {
  message: string
}

const defaultConstraints = {
  facingMode: 'false',
  width: { min: 640, ideal: 720, max: 1920 },
  height: { min: 640, ideal: 720, max: 1080 },
};

const styles = {
  container: {
    margin: 'auto',
  },
};



function AddLaptop() {
  const { slug } = useParams<{ slug: string }>();

  const [qrCodeResult, setQrCodeResult] = useState<string>()
  const [currentCartOfLaptop, setCurrentCartOfLaptop] = useState<string | undefined>()
  const [isUpdateLaptopCodeInCartModalOpen, setIsUpdateLaptopCodeInCartModalOpen] = useState(false);

  function handleOpenUpdateLaptopCodeInCartModal() {
    setIsUpdateLaptopCodeInCartModalOpen(true);
  }
  function handleCloseUpdateLaptopCodeInCartModal() {
    setIsUpdateLaptopCodeInCartModalOpen(false);
  }

  const addLaptopCart = async (laptopCode: string, cartSlug: string) => {
    const laptopCodeStringToNumber = parseInt(laptopCode.substring(0, 7))

    try {
      const addLaptop = await api.post('/laptop', {
        laptopCode: laptopCodeStringToNumber,
        cartSlug: cartSlug
      })
      console.log("Sucesso ao cadastrar laptop!", addLaptop)
    } catch (e) {
      handleLaptopError(e as AxiosError<AxiosErrorProps>);
    }
  }

   const handleLaptopError = (error: AxiosError<AxiosErrorProps>) => {
    const updateLaptopCart = confirm(error.response?.data.message)

    const regex = /Carrinho \d+/
    const cartName = error.response?.data.message.match(regex)
    console.log("cartName: ", cartName)

    if(cartName) {
      setCurrentCartOfLaptop(cartName[0])
      console.log("SETOU 65: ", currentCartOfLaptop)
    }

    if(updateLaptopCart) {
      console.log("currentCartOfLaptop linha 69: ",currentCartOfLaptop)

      if(!slug || !currentCartOfLaptop) {
        return
      }
      const formattedSlug = formatSlug(slug)
      if( currentCartOfLaptop === formattedSlug) {
        console.log("Mesmo Carrinho")
      } else {
        console.log("Carrinho Diferente")
        console.log("currentCartOfLaptop: ",currentCartOfLaptop)
        console.log("formattedSlug: ", formattedSlug)
        handleOpenUpdateLaptopCodeInCartModal()
      }
    }
   }

   const formatSlug = (slug: string) => {
    return slug.replace(/^./, slug[0].toUpperCase()).replace("_", " ");
  };

  useEffect(() => {
    if (qrCodeResult === undefined) {
      return;
    }

    if(!slug){
      return
    }

    addLaptopCart(qrCodeResult, slug);
  }, [qrCodeResult, slug]);


  return (
    <>
      <h1 className='cartPageTitle'>{slug?.replace(/^./, slug[0].toUpperCase()).replace("_", " ")}</h1>
      <p className="infoText">
        Escaneie o Código QR do Notebook para adicioná-lo ao
        <span className='cartName'>
          {` ${slug?.replace(/^./, slug[0].toUpperCase()).replace("_", " ")}`}
        </span>
      </p>
      <Scanner
        onScan={(result) => setQrCodeResult(result[0].rawValue)}
        scanDelay={300}
        constraints={defaultConstraints}
        styles={styles} />
      <h2
        className='showResultQrCode'>
        {qrCodeResult?.substring(0, 7)}
      </h2>
      <UpdateLaptopCodeInCartModal
        isOpen={isUpdateLaptopCodeInCartModalOpen}
        onRequestClose={handleCloseUpdateLaptopCodeInCartModal}
        laptopAndCart={{ laptopCode: qrCodeResult, cartSlug: slug }}
      />
    </>
  )
}

export default AddLaptop;
