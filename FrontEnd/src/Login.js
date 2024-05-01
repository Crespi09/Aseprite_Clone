import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';


const Login = () => {
    const navigate = useNavigate();

    useEffect(() =>{
        let login = localStorage.getItem("login", true);
        if(login){
            navigate("/");
        }
        let loginStatus = localStorage.getItem("loginStatus");
        if(loginStatus){
            console.log("login status error ",loginStatus);
            setTimeout(function() {
                localStorage.clear();
                window.location.reload();
            },300);
        }
    })

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
        ...data,
        [e.target.name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            email: data.email,
            password: data.password
        };
    

        if(data.email !== "" && data.password !== ""){
            axios.post('http://localhost/api_crud_php/user/login.php', userData)
            .then(response => {
                console.log(response.data);
                localStorage.setItem('login', true);
                localStorage.setItem('userEmail', data.email);
                //console.log("l'utente " + data.email + " si è loggato correttamente"); // DEBUG
                window.location.reload();
                // navigate('/');
            })
            .catch(error => {
                console.error(error);
            });
        }else{
            console.log("All fields are required");
        }

    };

    return(
        <>
        <div className='container' style={{textAlign : "center"}}>
            <h1>Login</h1>
        </div><br/>

        <div className='container'>

            <form onSubmit={handleSubmit}>
                <div className=  "form-group">
                    <input 
                        type = "email" 
                        name = "email"
                        value = {data.email} 
                        placeholder = "email" 
                        className = "form-control"
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className=  "form-group">
                    <div className="password-container">
                        <input 
                            type = "password" 
                            name = "password" 
                            value = {data.password} 
                            placeholder = "password" 
                            className = "form-control"
                            onChange={(e) => handleChange(e)}
                        />
                        <i className="fa-solid fa-eye" id="show-psw"></i>
                    </div>
                </div>

                {/* <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#exampleModal" style = "padding: 0px;">Forgot Password?</button> */}
                <Button variant="link">Forgot Password?</Button>
                <div className = "form-btm">
                    <br />
                    <Button type="submit" variant="outline-success">Login</Button>
                </div>
            </form>
        
            <div>
                Not registered yet
                <Link to = "../Register">
                    <Button variant="link">Register Here</Button>
                </Link>
            </div>
        </div>
       
        </>
    );
}
export default Login;