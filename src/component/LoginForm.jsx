import React, { useState } from "react"


function LoginForm({Login, error}) {
    const [details, setDetails] = useState({ login: "", password: "" });
    const submitHandler = e => {
        e.preventDefault();

        Login(details);
    }
    return (
        <form className="login"  onSubmit={submitHandler}>
            <div className="login__label"><label>Login</label></div>

            <div className="login-form">
                <div className="login-inputs">

                    <div className="login-field">
                        <label className="login-label" >Login Name</label>
                        <br />
                        <input className="login_input" type="text" name="login" value={details.login} onChange={e=>setDetails({...details,login:e.target.value})} />
                    </div>
                    <div className="login-field">
                        <label className="label" >Password</label>
                        <br />
                        <input className="login-input" type="text" name="password" value={details.password} onChange={e=>setDetails({...details,password:e.target.value})} />
                    </div>

                    <div className="login-buttons">
                        <button className="acceptbtn" type="submit" name="button">Sign in</button>
                    </div>

                </div>
            </div>

        </form>

    )
}

export default LoginForm
