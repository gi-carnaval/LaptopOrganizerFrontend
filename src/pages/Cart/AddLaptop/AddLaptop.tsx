import { useEffect, useState } from 'react';
import './AddLaptop.css';

import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { api } from '../../../lib/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UpdateLaptopCodeInCartModal } from '../UpdateLaptopCodeInCart/UpdateLaptopCodeInCart';
import { axiosErrorHandler } from '../../../utils/axiosErrorHandler';
import { substringAndParseInt } from '../../../utils/substringAndParseIntLaptopCode';
import { Bounce, toast } from 'react-toastify';
import { RiArrowGoBackFill } from 'react-icons/ri';

const styles = {
  container: {
    margin: 'auto',
  },
};

function AddLaptop() {
  const { slug } = useParams<{ slug: string }>();

  const [qrCodeResult, setQrCodeResult] = useState<string>()
  const [isUpdateLaptopCodeInCartModalOpen, setIsUpdateLaptopCodeInCartModalOpen] = useState(false);
  const navigate = useNavigate()

  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const devices = useDevices();

  const laptopAddedToast = (laptopCode: number) => toast.success(`${laptopCode}`, {
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

  const laptopAlreadyRegistredAtSameCartToast = (erro: string) => toast.info(`${erro}`, {
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

  const laptopAlreadyRegistredInAnotherCartToast = (erro: string) => toast.info(`${erro}`, {
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

  const passwordIncorrect = (erro: string) => toast.error(`${erro}`, {
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

  const passwordRequire = async () => {
    const sessionPassword = sessionStorage.getItem('adminPassword');

    if (sessionPassword) {
      return
    }
    const password = prompt("Digite a senha de admin para poder incluir notebooks")

    if (!password) {
      return
    }

    try {
      const response = await api.put('/auth', { password });
      if (response.status === 200) {
        sessionStorage.setItem('adminPassword', password);
      }
    } catch (err) {
      const errorMessage = axiosErrorHandler(err)
      passwordIncorrect(errorMessage)
    }
  }

  useEffect(() => {

    passwordRequire()

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
    const sessionPassword = sessionStorage.getItem('adminPassword');

    try {
      await api.post('/laptop', {
        laptopCode: laptopCodeStringToNumber,
        cartSlug: cartSlug,
        password: sessionPassword
      })

      laptopAddedToast(laptopCodeStringToNumber)
    } catch (e) {
      const errorMessage = axiosErrorHandler(e)
      handleLaptopError(errorMessage);
    }
  }

  const handleLaptopError = (error: string) => {

    const regex = /Carrinho \d+/
    const cartName = error.match(regex)

    if (cartName) {
      const cartNameString = cartName[0];

      if (!slug || !cartNameString) {
        return
      }
      const formattedSlug = formatSlug(slug)
      if (cartNameString === formattedSlug) {
        laptopAlreadyRegistredAtSameCartToast(error)
        console.error("Mesmo Carrinho")
      } else {
        laptopAlreadyRegistredInAnotherCartToast(error)
        handleOpenUpdateLaptopCodeInCartModal()
      }


    }
  }

  const formatSlug = (slug: string) => {
    return slug.replace(/^./, slug[0].toUpperCase()).replace("_", " ");
  };

  useEffect(() => {
    const password = sessionStorage.getItem('adminPassword');
    if (!password) {
      navigate("..", { relative: "path" })
    }
  }, [navigate]);

  return (
    <>
      <header className="headerBackButton">
        <button onClick={() => navigate("..", { relative: "path" })}><RiArrowGoBackFill /> Voltar</button>
      </header>
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
        constraints={{
          deviceId: deviceId
        }}
        styles={styles} />
      {
        devices ? (
          <select className="selectADevice" onChange={(e) => setDeviceId(e.target.value)}>
            <option value={undefined}>Select a device</option>
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        ) : null
      }
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
