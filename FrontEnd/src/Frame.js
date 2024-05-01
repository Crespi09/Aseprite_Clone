import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { text } from "@fortawesome/fontawesome-svg-core";


import LordiconAnimation from './Icons/LordiconAnimation';



function Frame({ indice, colorArray, setIndexToLoad, updateColorHistory}) {
    
    const [backgroundColor, setBackgroundColor] = useState('');
    const [textColor, setTextColor] = useState('#0d6efd');

    // useEffect(() => {
    //     if(indice === frameClickedIndex){
    //         console.log("FRAME -"+indice + " ATTIVO");
    //         // colorArray = updateColorHistory;
    //     }

    //     // if (indice === currentIndex) {
    //     //     console.log("FRAME ATTUALE : " + indice);
    //     //     setBackgroundColor('#0d6efd');
    //     //     setTextColor("white");
    //     //     setCurrentColorHistory(colorArray);

    //     // } else {
    //     //     console.log("FRAME non cosiderato : " + indice);
    //     //     setBackgroundColor('');
    //     //     setTextColor("#0d6efd");
    //     // }
    // }, [indice, frameClickedIndex]);

    const handleLoadFrame = () =>{
        if (colorArray) {
            console.log("colori: ", colorArray);
            setIndexToLoad(indice);
            updateColorHistory(colorArray); // Modifica questa riga
            // frameClickedIndex(indice);
        } else {
            console.log("undefined");
        }
    }

    const handleDeleteFrame = () =>{
        console.log("Eliminazione Frame: " , indice); 
    }

    return (
        <>
            <Container>
                <Row>
                    <Col xs={10}>
                        <Button 
                            variant='outline-primary' 
                            onClick={handleLoadFrame} 
                            // style={{
                            //     margin: "5px",
                            //     backgroundColor: backgroundColor,
                            //     color : textColor
                            // }}
                        >
                            Frame-{indice}
                        </Button>
                    </Col>
                    <Col>
                        <LordiconAnimation
                        src="https://cdn.lordicon.com/wpyrrmcq.json"
                        colors="primary:#dc3545"
                        style={{ width: '40px', height: '40px' }}
                        onClick = {handleDeleteFrame} 
                        />

                    </Col>
                </Row>




            </Container>
        </>
    );
}

export default Frame;
