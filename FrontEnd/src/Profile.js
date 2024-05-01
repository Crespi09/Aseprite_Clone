import React, { useEffect, useState } from "react";
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const Profile = () => {

    const [data, setData] = useState({
        email: localStorage.getItem('userEmail')
    });

    const [inputFieldData, setInputFieldData] = useState ({
        username : "",
        email : "",
        created_at : ""
    })

    const [isLoading, setIsLoading] = useState(true);

    //bottoni
    const [isUpdateHovered, setIsUpdateHovered] = useState(false);
    // const [borderColor, setBorderColor] = useState("transparent");

    const [borderColors, setBorderColors] = useState({
        username: "transparent",
        email: "transparent",
        created_at: "transparent"
    });

    //edit - save
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(()=>{
        if (isLoading) {
            getUserInfo();
        }
    }, [isLoading]);

    //chiamata al DB per informazioni iniziali
    const getUserInfo = () =>{

        const userData = {
            email : data.email
        }

        axios.post('http://localhost/api_crud_php/user/getUser.php', userData)
        .then(response => {
            //debug
            // console.log('Nome utente:', response.data.records[0].name);
            // console.log('Email:', response.data.records[0].email);
            // console.log('Data di creazione:', response.data.records[0].created_at);

            setInputFieldData({
                username : response.data.records[0].name,
                email : response.data.records[0].email,
                created_at : response.data.records[0].created_at
            });

            setIsLoading(false); // Imposta isLoading su false una volta che i dati sono stati caricati

        })
        .catch(error => {
            console.error(error);
        });
    }

//---------------------FUNZIONI GESTIONE COLORE BORDI INPUT-------------------------------
    const setBorderColorFunction = () => {
        setBorderColors(prevState => ({
            ...prevState,
            username: "white",
            email: "black",
            created_at : "black"
        }));
    }

    const resetBorderColorFunction = () => {
        setBorderColors(prevState => ({
            ...prevState,
            username: "transparent", 
            email: "transparent",
            created_at : "transparent"
        }));
    }
//-----------------------------------------------------------------------
//--------------------UTILITY FUNCTIONS ---------------------------------
    //update
    const handleMouseEnterUpdate = () =>{
        setIsUpdateHovered(true);
        setBorderColorFunction();
    }

    const handleMouseLeaveUpdate = () => {
        setIsUpdateHovered(false);
        if(!isEditMode){
            resetBorderColorFunction();
        }
    }

    const handleUpdateClick = () => {
        setIsEditMode(!isEditMode);
        console.log("EDITMODE : " + !isEditMode);
        if(!isEditMode){
            setBorderColorFunction();
        }else{
            resetBorderColorFunction();
        }
    }

    const handleChange = (e) =>{
        const value = e.target.value;

        setInputFieldData({
            ...inputFieldData,
            [e.target.name] : value
        });

    }

    const handleSaveClick = (e) => {
        setIsSaving(true);
        handleSubmit(e); //chiamata DB per salvare i dati

        setIsEditMode(false); //edit mode -> false
        setIsSaving(false); // salvatagio completato
        
        resetBorderColorFunction(); // resetta il colore del bordo dei campi input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(inputFieldData.username !== "" && inputFieldData.email !== "" && inputFieldData.created_at != ""){
            axios.post('http://localhost/api_crud_php/user/update.php', {
                validationEmail : data.email,
                username : inputFieldData.username,
                email : inputFieldData.email,   
            })
            .then(response => {
                console.log(response.data);

            })
            .catch(error => {
                console.error(error);
            });
        }else{
            console.log("All fields are required");
        }

        
    }
//---------------------------------------
    return (
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row container d-flex justify-content-center">
                    <div className="col-xl-6 col-md-12">
                    <form onSubmit={handleSaveClick}>
                        <div className="card user-card-full">

                            <div className="row m-l-0 m-r-0">
                                <div className="col-sm-4 bg-c-lite-green user-profile">
                                    <div className="card-block text-center text-white">
                                        <div className="m-b-25">
                                            <img src="https://img.icons8.com/bubbles/100/000000/user.png" className="img-radius" alt="User-Profile-Image" />
                                        </div>
                                        <h6 className="f-w-600">
                                        <input 
                                            type = "text" 
                                            name = "username"
                                            value = {inputFieldData.username} 
                                            placeholder = "username" 
                                            className = "form-control"
                                            disabled= {!isEditMode}
                                            style={{
                                                textAlign: "center",
                                                backgroundColor : "transparent",
                                                borderColor : borderColors.username,
                                                color: "white",
                                                fontSize : "30px",
                                                // paddingBottom : "0px"
                                            }}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        </h6>
                                        <p style={{
                                            color : "white",
                                            textDecoration : "underline",
                                            fontSize: "15px"
                                        }}>Artist</p>
                                        <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                    </div>
                                </div>
                                <div className="col-sm-8">
                                    <div className="card-block">
                                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <p className="m-b-10 f-w-600">Email</p>
                                                <h6 className="text-muted f-w-400">
                                                <input 
                                                    type = "email" 
                                                    name = "email"
                                                    value = {inputFieldData.email} 
                                                    placeholder = "email" 
                                                    className = "form-control"
                                                    disabled={!isEditMode}
                                                    style={{
                                                        // textAlign: "center",
                                                        backgroundColor : "transparent",
                                                        borderColor : borderColors.email,
                                                        width : "100%",
                                                    }}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                </h6>
                                            </div>
                                            <div className="col-sm-6">
                                                <p className="m-b-10 f-w-600">Membro da</p>
                                                <h6 className="text-muted f-w-400">
                                                <input 
                                                    type = "date" 
                                                    name = "created_at"
                                                    value = {inputFieldData.created_at} 
                                                    placeholder = "dd/mm/yyy" 
                                                    className = "form-control"
                                                    disabled
                                                    style={{
                                                        // textAlign: "center",
                                                        backgroundColor : "transparent",
                                                        borderColor : "transparent",
                                                        width : "100%"
                                                    }}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                </h6>
                                            </div>
                                        </div>
                                        <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Projects</h6>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <p className="m-b-10 f-w-600">Recent</p>
                                                <h6 className="text-muted f-w-400">
                                                <input 
                                                    type = "text" 
                                                    name = "test"
                                                    value =  "p-1"//{email}
                                                    placeholder = "progetto" 
                                                    className = "form-control"
                                                    disabled
                                                    style={{
                                                        // textAlign: "center",
                                                        backgroundColor : "transparent",
                                                        borderColor : "transparent",
                                                        width : "100%"
                                                    }}
                                                />
                                                </h6>
                                            </div>
                                            <div className="col-sm-6">
                                                <p className="m-b-10 f-w-600">Most Viewed</p>
                                                <h6 className="text-muted f-w-400">
                                                <input 
                                                    type = "text" 
                                                    name = "test"
                                                    value =  "p-1"//{email} 
                                                    placeholder = "progetto" 
                                                    className = "form-control"
                                                    disabled
                                                    style={{
                                                        // textAlign: "center",
                                                        backgroundColor : "transparent",
                                                        borderColor : "transparent",
                                                        width : "100%"
                                                    }}
                                                />
                                                </h6>
                                            </div>
                                        </div>
                                        <ul className="social-link list-unstyled m-t-40 m-b-10">
                                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="facebook" data-abc="true"><i className="mdi mdi-facebook feather icon-facebook facebook" aria-hidden="true"></i></a></li>
                                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="twitter" data-abc="true"><i className="mdi mdi-twitter feather icon-twitter twitter" aria-hidden="true"></i></a></li>
                                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="instagram" data-abc="true"><i className="mdi mdi-instagram feather icon-instagram instagram" aria-hidden="true"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            
                        {isEditMode && (
                            <Button 
                                type="submit" 
                                variant="outline-success" // Cambia il colore del pulsante a verde
                                style = {{
                                    marginRight : "5px"
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Save'} {/* Testo dinamico in base allo stato di salvataggio */}
                            </Button>
                            )}
                        

                            <Button 
                            type="button" 
                            variant="outline-warning"
                            onClick={handleUpdateClick}
                            onMouseEnter={handleMouseEnterUpdate}
                            onMouseLeave={handleMouseLeaveUpdate}  
                            >
                               <i className={`bi bi-pencil-square ${isUpdateHovered ? 'text-light' : 'text-warning'}`}></i>

                            </Button>
                            
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Profile;
