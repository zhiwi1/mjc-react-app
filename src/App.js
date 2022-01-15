import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
function App() {
  const adminUser = {
    login: '12',
    password: '123456'
  }
  const [user, setUser] = useState({ login: "", password: "" });
  const [error, serError] = useState("");
  const Login = details => {
    if (adminUser.login == details.login && adminUser.password == details.password) {
      console.log('successful login')
    }

    console.log(details);
  }
  const Logout = () => {
    console.log('logout');
  }
  return (
    <div className="app">
      <LoginForm Login={Login} error={error} />
      <Footer />
    </div>
  );
}

export default App;
