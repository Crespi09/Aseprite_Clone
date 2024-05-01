import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = (props) => {
    const navigate = useNavigate();
    const { Component } = props;

    useEffect(()=>{
        let login = localStorage.getItem("login");
        console.log(login);
        if(login !== "true"){
            localStorage.setItem("loginStatus" , "Please Login");
            console.log("NON DOVREI ESSERE QUI");
            navigate("/");
        }
    }, []);

    return (
        <Component />
    );
}

export default Protected;
