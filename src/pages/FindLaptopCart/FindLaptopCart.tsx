import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { substringAndParseInt } from "../../utils/substringAndParseIntLaptopCode";
import { api } from "../../lib/axios";
import { axiosErrorHandler } from "../../utils/axiosErrorHandler";
import './FindLaptopCart.css'
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";

const styles = {
  container: {
    margin: 'auto',
  },
};

const FindLaptopCart = () => {
  const [qrCodeResult, setQrCodeResult] = useState<string>()
  const [cartName, setCartName] = useState<string>()
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [isRotated, setIsRotated] = useState(false);

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  const devices = useDevices();

  const navigate = useNavigate()

  const laptopNotFound = (erro: string) => toast.error(`${erro}`, {
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

  useEffect(() => {
    if (qrCodeResult === undefined) {
      return;
    }

    findLaptopCart(qrCodeResult);
  }, [qrCodeResult]);

  const findLaptopCart = async (laptopCode: string) => {
    const laptopCodeStringToNumber = substringAndParseInt(laptopCode)

    try {
      const response = await api.get(`/laptop/${laptopCodeStringToNumber}`)
      const cartName = response.data.cart.name
      setCartName(cartName)
    } catch (e) {
      const errorMessage = axiosErrorHandler(e)
      laptopNotFound(errorMessage)
      setCartName("")
    }
  }

  return (
    <div className={`container ${isRotated ? 'rotated' : ''}`}>
      <header className="headerBackButton">
        <button onClick={() => navigate("..", { relative: "path" })}><RiArrowGoBackFill /> Voltar</button>
      </header>
      <h1 className='cartPageTitle'>Encontrar Carrinho do Notebook</h1>
      <p className="infoText">
        Escaneie o Código QR do Notebook para encontrar o carrinho a que ele pertence
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
      {
        cartName ? (
          <>
            <span
              className='showResultQrCode'>
              {`O Notebook 
        ${qrCodeResult?.substring(0, 7)} pertence ao`}

            </span>

            <h2
              className='showResultCartName'>
              {cartName}
            </h2>

          </>

        ) : null
      }
      <button onClick={() => toggleRotation()}>Virar tela</button>
    </div >
  )
}

export default FindLaptopCart;