import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

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
      <h2
        className='showResultQrCode'>
        {qrCodeResult?.substring(0, 7)}
      </h2>
    </>
  )
}

export default FindLaptopCart;