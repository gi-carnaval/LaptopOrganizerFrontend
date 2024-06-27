import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { substringAndParseInt } from "../../utils/substringAndParseIntLaptopCode";
import { api } from "../../lib/axios";
import { axiosErrorHandler } from "../../utils/axiosErrorHandler";
import './FindLaptopCart.css'

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

const FindLaptopCart = () => {
  const [qrCodeResult, setQrCodeResult] = useState<string>()
  const [cartName, setCartName] = useState<string>()

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
      alert(`${errorMessage}`)
    }
  }

  return (
    <>
      <h1 className='cartPageTitle'>Encontrar Carrinho do Notebook</h1>
      <p className="infoText">
        Escaneie o Código QR do Notebook para encontrar o carrinho a que ele pertence
      </p>
      <Scanner
        onScan={(result) => setQrCodeResult(result[0].rawValue)}
        scanDelay={300}
        constraints={defaultConstraints}
        styles={styles} />
      {cartName ? (
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
    </>
  )
}

export default FindLaptopCart;