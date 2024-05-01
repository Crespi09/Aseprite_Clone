import { useState, useEffect, useRef } from 'react';
import { useParams , Navigate } from 'react-router-dom';
import React from 'react';

//librerie
import { SketchPicker } from 'react-color';
import axios from 'axios';

//files
import Palette from "./Palette";
import CanvasDrawing from './CanvasDrawing';
import Frame from "./Frame";

//bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const NewFile = () => {
    const { value } = useParams();
    // console.log("pixelSize: " + value);  //DEBUG : pixel size
    // vado a prendere i parametri dalla get
    const params = new URLSearchParams(value);
    const param1 = params.get('pixel');     //  pixel
    const param2 = params.get('name');      //  nome file

    return (
        <div className='contentNewFile'>
            <AutoLayoutVariableExample pixelSize={param1} fileToLoadName = {param2}/>
        </div>
    );
}

export default NewFile;

function AutoLayoutVariableExample({pixelSize, fileToLoadName}) {

    const [currentColor, setCurrentColor] = useState("#F1356D")
    const [renderFrameArray, setRenderFrameArray] = useState([]);
    const [completedFile, setCompletedFile] = useState ([])
    const [modalShow, setModalShow] = useState(false);
    const[fileNameDB, setFileNameDB] = useState("");

    const handleOnChange = (color) => {
        setCurrentColor(color.hex);
    }

    const handleAddColorClick = () => {
        console.log("aggiunto : " + currentColor);
    }
    
    //mi va a creare tanti <Frame /> quanti sono gli elemente presenti nell'array di oggetti frameArray
    // -> gli passo la chiave (non so bene a cosa serva) l'indice e il suo correspettivo array di Colori
    const renderFrames = () => {
        return renderFrameArray;
    };

    const handleSaveImgCilck = () =>{

        let contatoreFrame = 0;
        const email = localStorage.getItem('userEmail');
        
        if(renderFrameArray.length > 0){
            renderFrameArray.forEach(frame => {
                contatoreFrame++;
                const colorArray = frame.props.colorArray;;

                // for(const key of Object.keys(colorArray)){
                //     const [x , y] = key.split('_');

                //     const pixelFileData = {
                //         coord : key,
                //         color : colorArray[key].color
                //     }

                //     completedFile.push(pixelFileData);
                // }
                completedFile.push(colorArray);
                // console.log(completedFile);

                let file_colori = "";

                //vado a ciclare tra gli elementi di colorArray e li concateno alla string file_colori
                for (const key of Object.keys(colorArray)) {
                    // const [x, y] = key.split('_');
                    const color = colorArray[key].color;
                    // file_colori += `${x},${y}:${color};`;
                    file_colori += `${key}${color};`;
                }
                
                // Rimuovi l'ultimo punto e virgola dalla stringa
                file_colori = file_colori.slice(0, -1);

                const filesData = {
                    email_user : email,
                    nome : fileNameDB,
                    n_frame: contatoreFrame,
                    file_colori : file_colori,
                    pixel_size : pixelSize //AGGIUNGERE UN CAMPO AL DB CON LA DIMENSIONE DEI PIXEL

                } 

                if(filesData !== null){
                    axios.post('http://localhost/api_crud_php/file/create.php', filesData)
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }else{
                    console.log("Nessun File da caricare");
                }

            });

        } else {
            console.log("IMPOSSIBILE SALVARE FILE VUOTO");
        }
        setModalShow(false);
    }


    const openSaveFileModal = () =>{
        setModalShow(true);
    }

    return (
      <Container style={{margin: "10px", display: "inline"}}>
        <Row>
        <Col xs={3}>
            <div className="colorsDiv">
                
                <Palette colors={["#1CC2BA", "#42D1B0", "#6CDEA0", "#98EA8E", "#C7F27D"]} getColor = {setCurrentColor}/>
                <Palette colors={["#C21CB3", "#FC268E", "#FF5D6B", "#FF9551", "#FFC94F"]} getColor = {setCurrentColor}/>

            </div>
            <div className="pickColorDiv">
                <SketchPicker 
                color = {currentColor} 
                onChange = {handleOnChange}
                width = '90%'
                heigh = '90%'
                />
                {/* <Button variant='outline-success' onClick={handleAddColorClick} style={{marginTop : "20px"}}>+</Button> */}
                <Button variant='outline-warning' onClick={openSaveFileModal}  style={{marginTop : "20px"}}>Save File</Button>
            </div>
        </Col>
        <Col mb="auto" style={{
            border: "2px solid black",
            borderRadius: "8px",
            display : "flex",
            overflow : "auto"
        }}>

            <CanvasDrawing newCurrentColor={ currentColor } pixelSize = { pixelSize } setRenderFrameArray = { setRenderFrameArray} fileToLoadName = {fileToLoadName}/>
            
            <div className='frameHolder' style={{ 
                width: "100%",
                // display : "grid",
                overflow: "auto",
                maxHeight : "70%",
                maxWidth : "100%",
                minWidth : "20%"
            }}>
                {renderFrames()}
            </div>


        </Col>
        {/* <Col xs ={1}>3 of 3</Col> */}
        </Row>
        
        <MyModalWithGrid 
            show={modalShow} 
            onHide={() => setModalShow(false)} 
            setFileNameDB={setFileNameDB} 
            onSaveClick={handleSaveImgCilck}
        />

      </Container>

      
    );

}


//VERIFICARE SE NELL'URL IL NOME FILE ESISTE GIA' 
//MODAL
function MyModalWithGrid(props) {
    const nameInputRef = useRef(null);
    const [fileName, setFileName] = useState("")

    useEffect(() => {
        if (props.show) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [props.show]);


    const handleInputChange = (e) =>{
        setFileName(e.target.value);
        props.setFileNameDB(e.target.value);
    }


    return (
        <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h4>Save File</h4>
                    <h6>File Name:</h6>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row>
                        <Col xs={6} md={4}>
                            <span className="spanWidth">Name: </span>
                        </Col>
                        <Col xs={6} md={6}>
                            <InputGroup className="mb-3">
                                <Form.Control 
                                    ref={nameInputRef} 
                                    aria-label="width" 
                                    type="text"
                                    placeholder='ex: file_0'
                                    value={fileName}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="outline-success" onClick={props.onSaveClick}>Save</Button>
                <Button variant="outline-danger" onClick={props.onHide}>Exit</Button>

            </Modal.Footer>
        </Modal>
    );
}