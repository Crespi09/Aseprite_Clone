import Button from 'react-bootstrap/Button';
import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate();

//--------------------------------------------------------------------------------------------------
    const [data, setData] = useState({
        name: "",
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
            name: data.name,
            email: data.email,
            password: data.password

            //DEBUG
            // name: "maurizio",
            // email: "maurizio@example.com",
            // password: "password123456"
        };
        e.preventDefault();

        if(data.name !== "" && data.email !== "" && data.password !== ""){
            axios.post('http://localhost/api_crud_php/user/create.php', userData)
            .then(response => {
                console.log(response.data);
                navigate('/Login');         
            })
            .catch(error => {
                console.error(error)
                console.log("utente già esistente");
                data.email = "";
                data.password = "";
            });
        }else{
            console.log("All fields are required");
        }


    };

  //---------------------------------------------------------

    return(
        <>
            <div className="container" style={{textAlign : "center"}}>
                <h1>Registration</h1>
            </div><br />

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name"
                            value={data.name}
                            placeholder="Name" 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="form-group">
                        <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            value={data.email}
                            placeholder="Email" 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            name="password"
                            value={data.password}
                            placeholder="Password" 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-btm">
                        <Button type="submit" variant="outline-success">Register</Button>
                    </div>
                </form>
                <br/>
                <div>
                    Already registered? 
                    <Link to="../Login">
                        <Button variant="link">Login here</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Register;
