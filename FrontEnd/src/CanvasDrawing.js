import { faRssSquare, faSortNumericDownAlt } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Frame from "./Frame";
import _, { forEach } from 'lodash';
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import axios from 'axios';


const CanvasDrawing = ({ newCurrentColor , pixelSize , setRenderFrameArray, fileToLoadName}) => {

  //questa variabile è quella che devo cambiare per la grandezza dei pixel
  // quindi quando gli passo la dimensione del file, in realtà il canvas rimane della stessa dimensione e cambio questo

  //    --> questo funziona solo se il file ad esempio è un 32x32 o un  15x15 
  //        --> se ho altezza e larghezza differenti non funziona
  const CELL_SIDE_COUNT = pixelSize;

  // console.log("Frame: " + frameIndex + " Colori: "); //debug
  // console.log(currentColorHistory); //debug

  const [colorHistory, setColorHistory] = useState({});
  const [cellHistory, setCellHistory] = useState([]);
  // const [showGuide, setShowGuide] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false); // Flag per tracciare lo stato del mouse
  const canvasRef = useRef(null);
  const [currentCell, setCurrentCell] = useState(null); // Memorizza la cella corrente quando il mouse si muove
  const [indexToLoad, setIndexToLoad] = useState(null);

  //variabili frame
  const [frameArray, setFrameArray] = useState([]);

  //bottoni
  const [isPlayHovered, setIsPlayHovered] = useState (false);

  //variabili loadFile
  const [isLoading, setIsLoading] = useState(true);
  const [fileData, setFileData] = useState([]);
  const [appoggioColoriFrame, setAppoggioColoriFrame] = useState([]);

  //---------------FUNZIONI BOTTONI--------------------------
  const handleMouseEnterPlay = () => {
    setIsPlayHovered(true);
  };
  const handleMouseLeavePlay = () => {
    setIsPlayHovered(false);
  };

  //-------------------------------------------------------------


  //-----------------------FUNZIONI LOAD FILE----------------------

  useEffect(() => {
    // if(fileData.length <= 0){
    if(fileToLoadName !== null){
      getAllFrames();
    }else{
      setIsLoading(false);
    }
    // }
   
  },[isLoading])


  const getAllFrames = () =>{
    
    const frameData = {
      email : localStorage.getItem("userEmail"),
      file_name: fileToLoadName
    }

    axios.post('http://localhost/api_crud_php/file/getFramesByFileName.php', frameData)
    .then(response =>{
      //TODO - prendere i frame e i colori e caricarli in frame
      const newFrame = response.data.records.map(record => ({
        nome: record.nome,
        nFrame: record.nFrame,
        file_colori: record.file_colori
      }));

      setFileData(newFrame);

    })
    .catch(error => {
      console.error(error);
    })
    .finally(()=>{
      setIsLoading(false);
    })

    pushIntoFrames();
  }

  const pushIntoFrames = () => {
    const newFrameArray = [];
    console.log(fileData);
    for (let i = 0; i < fileData.length; i++) {
        const frameColor = {}; // Crea un nuovo oggetto per ogni iterazione
        const dataArray = (fileData[i].file_colori).split(';').map(pair => {
            const [key, color] = pair.split('#');
            frameColor[key] = `#${color}`; // Assegna la coppia chiave-valore all'oggetto frameColor
        });

        const colorHistoryCopy = { ...frameColor }; // Copia l'oggetto frameColor
        newFrameArray.push(colorHistoryCopy);
    }


    // console.log(newFrameArray);

    setFrameArray(newFrameArray);
    renderFrames(newFrameArray);
    // updateColorHistoryFromFrame(newFrameArray[0]);
}

  //-------------------------------------------------------------


  //------------------FRAMES - FUNCTIONS--------------

  const handleAddFrameClick = () => {
    if (Object.keys(colorHistory).length === 0) {
      console.log("Nessun colore nella storia da aggiungere al frame.");
      return;
    }
  
    const colorHistoryCopy = { ...colorHistory };
    const newFrameArray = [...frameArray, colorHistoryCopy];
    
  
    console.log("Creazione nuovo frame...");
    // console.log(newFrameArray);
    
    setFrameArray(newFrameArray);
    console.log(frameArray);
    renderFrames(newFrameArray);
  };

  const updateColorHistoryFromFrame = (colorArray) => {

    const colorHistoryCopy = { ...colorArray};
    handleClearButtonClick("newFrameClear");

    //TODO -  ciclo nell'array colorhistory, gli passo le x e y in modo tale da colorare

    // Ciclo sulle chiavi dell'oggetto colorHistoryCopy
    for (const key of Object.keys(colorHistoryCopy)) {
      const [x, y] = key.split('_');
      const cellPixelLength = canvasRef.current.width / CELL_SIDE_COUNT;

      if(fileToLoadName !== null){
        newCurrentColor = colorHistoryCopy[key];
      }else{
        newCurrentColor = colorHistoryCopy[key].color;

      }

      console.log(colorHistoryCopy[key].color);
      fillCell(x, y, cellPixelLength);
    }
    setColorHistory(colorHistoryCopy);
  };


  const renderFrames = (arrayTest) =>{
    const frames = [];
    for (let i = 0; i < arrayTest.length; i++) {
        frames.push(
        <Frame 
            key={i} 
            indice={i} 
            colorArray = {arrayTest[i]} 
            // currentIndex = {frameIndex} 
            setIndexToLoad = {setIndexToLoad}
            updateColorHistory={updateColorHistoryFromFrame}
            // frameClickedIndex = {indexToLoad} 
            // updatedColorArray = {colorHistory}
            />
        );
        console.log(indexToLoad);
    }
    setRenderFrameArray(frames);
    // return frames;
  }

  //-------------------------------------------------------------

  //-----------------------FUNZIONI PLAY FRAMES----------------------

  const handlePlayFrameClick = () => {
    let i = 0;
    const intervalId = setInterval(() => {
      console.log(frameArray[i]);
      updateColorHistoryFromFrame(frameArray[i]);
      i++;
      if (i >= frameArray.length) {
        clearInterval(intervalId); // Ferma l'intervallo quando i raggiunge la lunghezza di frameArray
      }
    }, 100); // Esegui ogni 400 millisecondi
  };

  //---------------------------------------------------------


  //-------------------------------PRESSIONE TASTI------------------------------
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        const colorHistoryKeys = Object.keys(colorHistory);
        if (colorHistoryKeys.length > 0) {
          const lastKey = colorHistoryKeys[colorHistoryKeys.length - 1];
          const splitKey = lastKey.split('_');
          if (splitKey.length === 2) {
            const [lastX, lastY] = splitKey;
            console.log('Ctrl + Z premuto, eliminazione : ' + lastX +" "+ lastY ); //DEBUG
            clearSingleCell(lastX, lastY, canvasRef.current.width / CELL_SIDE_COUNT);
            handleCanvasMouseUp();
          }
        }else {
          console.log('Pixel colorati terminati');
        }
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [colorHistory]);

  //-----------------------

  //quando il mouse finisce di muoversi vado a cancellare tutti gli "errori" grafici -> polling (non il massimo)
  //fare che quando si muove viene richiamato
  useEffect(() => {
    // Timer che si attiva ogni 2 secondi
    const timer = setInterval(() => {
      // Funzione per pulire le celle non presenti in colorHistory
      clearNonHistoryCells();
    }, 50);

    // Cleanup del timer
    return () => clearInterval(timer);
  }, [colorHistory]);

  // Funzione per pulire le celle non presenti in colorHistory
  const clearNonHistoryCells = () => {
    const context = canvasRef.current.getContext("2d");
    const cellPixelLength = canvasRef.current.width / CELL_SIDE_COUNT;

    for (let x = 0; x < CELL_SIDE_COUNT; x++) {
      for (let y = 0; y < CELL_SIDE_COUNT; y++) {
        const cellKey = `${x}_${y}`;
        if (!colorHistory[cellKey] && !(currentCell && currentCell.x === x && currentCell.y === y)) {
          const startX = x * cellPixelLength;
          const startY = y * cellPixelLength;
          context.clearRect(startX, startY, cellPixelLength, cellPixelLength);
          context.fillStyle = "rgba(0, 0, 0, 0)";
          context.fillRect(startX, startY, cellPixelLength, cellPixelLength);
        }
      }
    }
  };


  const handleCanvasMouseDown = (e) => {
    setIsMouseDown(true); // Imposta il flag quando il mouse viene premuto
    handleDraw(e); // Inizia a disegnare immediatamente
  };

  const handleCanvasMouseUp = () => {
    setIsMouseDown(false); // Resetta il flag quando il mouse viene rilasciato

    //TODO - modificare il colorepassato a frame in qualche modo
    //prendo indexToLoad, lo passo al componente frame insieme al colorhistory
    //


    if (indexToLoad !== null && indexToLoad >= 0 && indexToLoad < frameArray.length) {
      const updatedFrameArray = [...frameArray]; // Creare una copia del frameArray
  
      // Modifica il colorArray del frame corrente
      const currentFrameColorArray = { ...updatedFrameArray[indexToLoad] };
      // Modifica il colorArray in base all'azione del mouse
      
      // Aggiorna il colorArray del frame corrente nel frameArray
      updatedFrameArray[indexToLoad] = colorHistory;
  
      // Aggiorna il frameArray e rifletti le modifiche nell'interfaccia utente
      setFrameArray(updatedFrameArray);
      renderFrames(updatedFrameArray);
    }


  };


  // quando il mouse entra nel canvas vado a colorare la cella corrente,
  // se premo la aggiungo al historyColor altrimenti no.
  const handleDraw = (e) => {
    // if (!isMouseDown) return; // Esci se il mouse non è premuto

    const canvasBoundingRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasBoundingRect.left;
    const y = e.clientY - canvasBoundingRect.top;
    const cellPixelLength = canvasRef.current.width / CELL_SIDE_COUNT;
    const cellX = Math.floor(x / cellPixelLength);
    const cellY = Math.floor(y / cellPixelLength);

    setCurrentCell({ x: cellX, y: cellY }); // Aggiornamento della cella corrente quando il mouse si muove
    fillCell(cellX, cellY, cellPixelLength);

  };

  const fillCell = (cellX, cellY, cellPixelLength) => {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;
    const context = canvasRef.current.getContext("2d");

    context.fillStyle = newCurrentColor;
    context.fillRect(startX, startY, cellPixelLength, cellPixelLength);

    // se il mouse viene premuto la cella colorate viene inserita all'interno dell'history
    if (isMouseDown){
      setCellHistory([""]);
      setColorHistory((prevHistory) => ({
        ...prevHistory,
        [`${cellX}_${cellY}`]: {color : newCurrentColor},
      }));


      //console.log(frameArray.length); DEBUG
      // console.log(colorHistory); //DEBUG
    }else{
      // la cella che devo "ripulire" è quello precedente
      // TODO - fare un array in cui ogni volta che entra in fill cell aggiungo le coordinate della cella
      // poi vado a prendere il valore precedente, se esiste, e lo cancello.

      setCellHistory(prevCellHistory => [
        ...prevCellHistory, { cellX, cellY }
      ]);

      if (cellHistory.length > 10) {
        const prevCell = cellHistory[cellHistory.length - 10];
        // console.log(prevCell.cellX + " , " + prevCell.cellY); //DEBUG
  
        // verifico se la cella precedente è presente in colorHistory
        const prevCellKey = `${prevCell.cellX}_${prevCell.cellY}`;
        if (!colorHistory[prevCellKey]) {
          clearSingleCell(prevCell.cellX, prevCell.cellY, cellPixelLength);
        }else{
          //console.log("sono sopra un pixel disegnato, colore: " + colorHistory[prevCellKey].color); //DEBUG
          reColorPixelPreview(prevCell.cellX, prevCell.cellY, cellPixelLength, colorHistory[prevCellKey].color);
        }
      }
    }

  };

  //-----------------------FUNZIONI PULIZIA---------------------------
  //ripulisce il canvas rendendolo di nuovo trasparente
  const handleClearButtonClick = (type) => {
    if(type !== "newFrameClear"){
      const yes = window.confirm("Are you sure you wish to clear the canvas?");
      if (!yes) return;
    }

    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Cancella tutto il contenuto del canvas
    context.fillStyle = "rgba(0, 0, 0, 0)"; // Imposta il colore di riempimento trasparente
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Riempie il canvas con il colore trasparente
    setColorHistory({}); // Resetta lo storico dei colori
  };

  const clearSingleCell = (cellX, cellY, cellPixelLength) => {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;
    const context = canvasRef.current.getContext("2d");
  
    context.clearRect(startX, startY, cellPixelLength, cellPixelLength);
    context.fillStyle = "rgba(0, 0, 0, 0)"; // Imposta il colore di riempimento trasparente
    context.fillRect(startX, startY, cellPixelLength, cellPixelLength); // Riempie la cella con il colore trasparente
  
    // Rimuovi la cella dall'history
    const updatedColorHistory = { ...colorHistory };
    delete updatedColorHistory[`${cellX}_${cellY}`];
    setColorHistory(updatedColorHistory);
  };

  /*
    questo metodo fa si che quando passo sopra ad un pixel disegnato con il mouse (senza cliccare) 
    utilizzando un altro colore, questo non vada a sovrascriversi permanentemente, e quindi cambiare il colore del pixel.
    ma viene cambiato solamente nel momento in cui il mouse è sopra quel pixel, dopodichè tornare quello di prima
  */
  const reColorPixelPreview = (cellX, cellY, cellPixelLength, prevColor) =>{
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;
    const context = canvasRef.current.getContext("2d");
  
    context.clearRect(startX, startY, cellPixelLength, cellPixelLength);
    context.fillStyle = prevColor;
    context.fillRect(startX, startY, cellPixelLength, cellPixelLength); // Riempie la cella con il colore trasparente
  
  }




  //---------------------------------

  return (
    <div className="canvasDiv">
      <canvas
        width="600"
        height="600"

        style={{
          border: "2px solid black",
          borderRadius: "8px",
          marginTop: "10px"
        }}

        id="canvas"
        ref={canvasRef}
      
        //eventi per disegnare  
        onMouseMove={handleDraw}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
      ></canvas>

      <div>
        <Button variant='outline-danger' onClick={handleClearButtonClick} style={{ marginBottom: "10px" }}>Clear</Button>
        
        <Button 
            variant='outline-success' 
            onClick={handleAddFrameClick} 
            style={{
                marginBottom:  "10px",
                marginLeft : "10px",
            }}
        >New Frame
        </Button>
        
        <Button 
            variant='outline-primary' 
            
            onMouseEnter={handleMouseEnterPlay}
            onMouseLeave={handleMouseLeavePlay}

            onClick={handlePlayFrameClick} 

            style={{
                marginBottom:  "10px",
                marginLeft : "10px",
            }}
        >
          <i className={`bi bi-play-fill ${isPlayHovered ? 'text-light' : 'text-primary'}`}></i>
        </Button>
      </div>

      {/* TODO - aprire un model che chiede il nome con cui voglio salvarlo e forse la dimensione in pixel */}
    </div>
  );
};

export default CanvasDrawing;