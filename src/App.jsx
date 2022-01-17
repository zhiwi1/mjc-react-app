// import React, { useState } from "react";
// import LoginForm from "./components/LoginForm";
// import Footer from "./components/Footer";
// function App() {
//   const adminUser = {
//     login: '12',
//     password: '123456'
//   }
//   const [user, setUser] = useState({ login: "", password: "" });
//   const [error, serError] = useState("");
//   const Login = details => {
//     if (adminUser.login == details.login && adminUser.password == details.password) {
//       console.log('successful login')
//     }

//     console.log(details);
//   }
//   const Logout = () => {
//     console.log('logout');
//   }
//   return (
//     <div className="app">
//       <LoginForm Login={Login} error={error} />
//       <Footer />
//     </div>
//   );
// }

// export default App;
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCount} from "../src/reducers/reposReducer";
import {Secured} from "../src/components/security/Secured"
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
const App = () => {
    // const dispatch = useDispatch()
    // const count = useSelector(state => state.repos.count)

    // function onCountClick() {
    //     dispatch(setCount(5))
    // }

    return (
<Secured/>
//       <BrowserRouter>
//       <div className="container">
//        <Switch>
//                <Route exact path="/" component={Main}/>
//            <Route path="/card" component={Card}/>
//                <Redirect to="/"/>
//           </Switch>
//       </div>
//  </BrowserRouter>
        // <div className="app">
        //     <button onClick={()=>onCountClick()}>COUNT</button>
        //     <div>{count}</div>
        // </div>
    );
};

export default App;