import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Login = (props) => {
    const host = "http://localhost:5000"
    // const host = "window.location.origin"
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${host}/api/auth/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });

        //client side logic to add a note
        const json = await response.json();
        console.log(json)
        
        if (json.success) {
            //save the auth token redirect to home page
            localStorage.setItem("token", json.authtoken)
            props.showAlert("Logged In Successfully", "success")
            navigate("/");
        }
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
        // console.log(note);
    }
    return (
        // <form onSubmit={handleSubmit}>
        //     <div class="mb-3">
        //         <label htmlFor="email" class="form-label">Email address</label>
        //         <input type="email" class="form-control" id="email" aria-describedby="emailHelp" value={credentials.email}/>
        //         <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        //     </div>
        //     <div class="mb-3">
        //         <label htmlFor="password" class="form-label">Password</label>
        //         <input type="password" class="form-control" id="password" />
        //     </div>
        //     <button type="submit" class="btn btn-primary">Submit</button>
        // </form>
        <div className='mt-3'>
            <h2>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit} className='my-3'>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={handleChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" value={credentials.password} onChange={handleChange} id="password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
