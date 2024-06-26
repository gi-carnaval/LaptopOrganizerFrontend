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
  const [currentCartOfLaptop, setCurrentCartOfLaptop] = useState<string>()
  const [isUpdateLaptopCodeInCartModalOpen, setIsUpdateLaptopCodeInCartModalOpen] = useState(false);

  function handleOpenUpdateLaptopCodeInCartModal() {
    setIsUpdateLaptopCodeInCartModalOpen(true);
  }
  function handleCloseUpdateLaptopCodeInCartModal() {
    setIsUpdateLaptopCodeInCartModalOpen(false);
  }

  useEffect(() => {
    if (qrCodeResult === undefined) {
      return;
    }

    if (!slug) {
      return
    }

    addLaptopCart(qrCodeResult, slug);
  }, [qrCodeResult, slug]);

  const addLaptopCart = async (laptopCode: string, cartSlug: string) => {
    const laptopCodeStringToNumber = substringAndParseInt(laptopCode)

    try {
      await api.post('/laptop', {
        laptopCode: laptopCodeStringToNumber,
        cartSlug: cartSlug
      })
      alert(`Notebook ${laptopCodeStringToNumber} adicionado com sucesso!`)
    } catch (e) {
      handleLaptopError(e as AxiosError<AxiosErrorProps>);
    }
  }

  const substringAndParseInt = (laptopCodeString: string = "") => {
    return parseInt(laptopCodeString.substring(0, 7))
  }

  const handleLaptopError = (error: AxiosError<AxiosErrorProps>) => {
    const updateLaptopCart = confirm(error.response?.data.message)

    const regex = /Carrinho \d+/
    const cartName = error.response?.data.message.match(regex)

    if (cartName) {
      const cartNameString = cartName[0];
      setCurrentCartOfLaptop(cartName[0])

      if (updateLaptopCart) {
        // console.log("currentCartOfLaptop linha 69: ",currentCartOfLaptop)

        if (!slug || !cartNameString) {
          return
        }
        const formattedSlug = formatSlug(slug)
        if (cartNameString === formattedSlug) {
          console.log("Mesmo Carrinho")
        } else {
          // console.log("Carrinho Diferente")
          // console.log("currentCartOfLaptop: ",currentCartOfLaptop)
          // console.log("formattedSlug: ", formattedSlug)
          handleOpenUpdateLaptopCodeInCartModal()
        }
      }
    }
  }

  const formatSlug = (slug: string) => {
    return slug.replace(/^./, slug[0].toUpperCase()).replace("_", " ");
  };



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
      {
        (qrCodeResult !== undefined || slug !== undefined) ? (
          <UpdateLaptopCodeInCartModal
            isOpen={isUpdateLaptopCodeInCartModalOpen}
            onRequestClose={handleCloseUpdateLaptopCodeInCartModal}
            laptopAndCart={{ laptopCode: substringAndParseInt(qrCodeResult), cartSlug: slug }}
          />
        ) : null
      }
    </>
  )
}

export default AddLaptop;
