export default function FindLaptopCart() {
  return (
    <>
      <h1>Organizador de Notebook em Carrinhos - SENAI</h1>
      <div id="video-container">
        <video id="qr-video"></video>
      </div>
      <div className="cameraSelect">
        <h3>Selecione a camera:</h3>
        <select id="cam-list">
          <option value="environment" selected>Environment Facing (default)</option>
          <option value="user">User Facing</option>
        </select>
      </div>
      <div className="resultContainer">
        <span id="resultSpan"></span>
        <span id="cartNumberResult"></span>
      </div>
      <div className="buttonContainer">
        <button id="start-button">Iniciar</button>
        <button id="stop-button">Parar</button>
      </div>
      <div className="inputCode">
        <button
          className="accordionButton"
          id="accordionButton"
        >
          Ou insira o código manualmente clicando aqui
          <span id="accordionArrow">▼</span>
        </button>
        <form id="laptopCodeInput">
          <div className="labelInput">
            <label className="laptopCode" htmlFor="laptopCode">Código do notebook:</label>
            <input id="laptopCode" name="laptopCode" type="number" />
          </div>
          <div className="buttons">
            <button type="submit">Verificar</button>
            <button id="limparInput" type="reset">Limpar</button>
          </div>
        </form>
      </div>
    </>
  )
}