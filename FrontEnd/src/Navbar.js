import React, { useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";



// import { eventWrapper } from "@testing-library/user-event/dist/utils";
import { Link } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const [modalShow, setModalShow] = useState(false);
    const fileInputRef = useRef(null);
    // const [isHovered, setIsHovered] = useState(false);
    const [isFolderHovered, setIsFolderHovered] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    const [isExitHovered, setIsExitHovered] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login") === "true");


    //gestione click
    function handleHomeClick(){
        console.log("open folder");
        fileInputRef.current.click();
    }

    function handleNewFileClick(){
        console.log("creating new file...");
        setModalShow(true);
    }

//  if(python > php){} -> warning: condizione sempre falsa

    function handleFileChange(event){
        const file = event.target.files[0];
        if(file){
            console.log("File selezionato : " , file);
        }
    }

    //FUNZIONE GESTIONE LOGOUT
    function handleLogOutClick(){

        localStorage.setItem('login', false);
        localStorage.setItem("loginStatus", "Logged Out successfully");
        localStorage.clear();
        console.log(localStorage.getItem("login"));
        setIsLoggedIn(false);
        // navigate("/");
        window.location.reload();
    }

    //funzioni per cambiare colore dell'icona folder quando ci passo sopra
    //folder
    const handleMouseEnterFolder = () => {
        setIsFolderHovered(true);
    };
    const handleMouseLeaveFolder = () => {
        setIsFolderHovered(false);
    };

    //profile
    const handleMouseEnterProfile = () => {
        setIsProfileHovered(true);
    };
    const handleMouseLeaveProfile = () => {
        setIsProfileHovered(false);
    };

    //exit
    const handleMouseEnterExit = () => {
        setIsExitHovered(true);
    };
    const handleMouseLeaveExit = () => {
        setIsExitHovered(false);
    };
    


    return (  
        <nav className="navbar">

            <Link to = "./">
                <button className="nameApp">Aseprite</button>
            </Link>

            {/* <h1>Aseprite</h1> */}

            <div className="links">
                <Button 
                variant="outline-dark" 
                onClick={handleHomeClick}
                onMouseEnter={handleMouseEnterFolder}
                onMouseLeave={handleMouseLeaveFolder}  
                >
                    <i className={`bi bi-image ${isFolderHovered ? 'text-light' : ''}`}></i>
                </Button>{' '}
                <Button variant="outline-dark" onClick={handleNewFileClick} >New File</Button>{' '}
                
                {isLoggedIn ? (
                    // Se l'utente è loggato, mostra il bottone con l'icona
                    <>
                    <Link to = "./Profile">
                    <Button 
                        variant="outline-dark" 
                        onMouseEnter={handleMouseEnterProfile}
                        onMouseLeave={handleMouseLeaveProfile}
                        style={{
                            marginRight : "5px"
                        }} 
                    >
                        <i className={`bi bi-person-fill ${isProfileHovered ? 'text-light' : ''}`}></i>
                    </Button>
                    </Link>

                    <Button 
                    variant="outline-danger" 
                    onClick={handleLogOutClick}
                    onMouseEnter={handleMouseEnterExit}
                    onMouseLeave={handleMouseLeaveExit}
                    >
                        <i className={`bi bi-box-arrow-right ${isExitHovered ? 'text-light' : 'text-danger'}`}></i>

                    </Button>{' '}

                    </>

                ) : (
                    // Se l'utente non è loggato, mostra il bottone di login
                    <Link to="./Login">
                        <Button variant="outline-success">Login</Button>
                    </Link>
                )}

                {/* QUI BOTTONE CON ICONA */}
                {/* <Link to = "./Login">
                    <Button variant="outline-success">Login</Button>
                </Link> */}
                
                {/* QUI BOTTONE CON SCRITTA LOGIN */}
                {/* <Button 
                variant="outline-dark" 
                onClick={handleHomeClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}  
                >
                    <i className={`bi bi-person-fill ${isHovered ? 'text-light' : ''}`}></i>
                </Button>{' '} */}

            </div>
            <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={(e) => handleFileChange(e)}/>
            <MyModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
        </nav>
    );
}

function MyModalWithGrid(props) {
    const widthInputRef = useRef(null);
    const [width, setWidth] = useState(32)
    const [height, setHeight] = useState(32)

    useEffect(() => {
        if (props.show) {
            widthInputRef.current.focus();
            widthInputRef.current.select();
        }
    }, [props.show]);


    const handleInputChange = (e) =>{

        //TODO - quando capirò come funziona per altezza e larghezza differenti usare switch case
        // e passare il tipo come parametro

        setWidth(e.target.value);
        setHeight(e.target.value);
    }


    return (
        <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h4>New Sprite</h4>
                    <h6>Pixel Size:</h6>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row>
                        <Col xs={6} md={4}>
                            <span className="spanWidth">Width: </span>
                        </Col>
                        <Col xs={6} md={6}>
                            <InputGroup className="mb-3">
                                <Form.Control 
                                    ref={widthInputRef} 
                                    aria-label="width" 
                                    type="number" min={0} 
                                    value={width}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                <InputGroup.Text>px</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col xs={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                            Height: 
                        </Col>
                        <Col xs={6} md={6}>
                            <InputGroup className="mb-3">
                                <Form.Control 
                                    aria-label="height" 
                                    type="number" 
                                    min={0} 
                                    value={height}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                <InputGroup.Text>px</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Link to={`/NewFile/pixel=${width}`}>
                    <Button variant="outline-success" onClick={props.onHide}>Ok</Button>
                </Link>
                <Button variant="outline-danger" onClick={props.onHide}>Cancel</Button>

            </Modal.Footer>
        </Modal>
    );
}

export default Navbar;
