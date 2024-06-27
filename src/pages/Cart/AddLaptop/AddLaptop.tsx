import { useEffect, useState } from 'react';
import './AddLaptop.css';

import { Scanner } from '@yudiel/react-qr-scanner';
import { api } from '../../../lib/axios';
import { useParams } from 'react-router-dom';
import { UpdateLaptopCodeInCartModal } from '../UpdateLaptopCodeInCart/UpdateLaptopCodeInCart';
import { axiosErrorHandler } from '../../../utils/axiosErrorHandler';
import { substringAndParseInt } from '../../../utils/substringAndParseIntLaptopCode';
import { Bounce, toast } from 'react-toastify';

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
  const [isUpdateLaptopCodeInCartModalOpen, setIsUpdateLaptopCodeInCartModalOpen] = useState(false);

  const notify = (laptopCode: number) => toast.success(`${laptopCode}`, {
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

      notify(laptopCodeStringToNumber)
    } catch (e) {
      const errorMessage = axiosErrorHandler(e)
      handleLaptopError(errorMessage);
    }
  }

  const handleLaptopError = (error: string) => {
    const updateLaptopCart = confirm(error)

    const regex = /Carrinho \d+/
    const cartName = error.match(regex)

    if (cartName) {
      const cartNameString = cartName[0];

      if (updateLaptopCart) {
        if (!slug || !cartNameString) {
          return
        }
        const formattedSlug = formatSlug(slug)
        if (cartNameString === formattedSlug) {
          console.error("Mesmo Carrinho")
        } else {
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
