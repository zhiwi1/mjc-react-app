
import ReactDOM from "react-dom";
import "./index.css";
import React from "react";
import {NotFound}  from "../src/components/NotFound"
import {BrowserRouter, Route, Routes, Redirect} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CertificateTable from "./components/certificates/CertificateTable"
import { StyledEngineProvider } from '@mui/material/styles';
import store from "./reducers";
import { Provider } from "react-redux";
import axiosInstance from "./components/security/requestInterceptor";
import axios from "axios";
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

const App = () => {
    // const dispatch = useDispatch()
    // const count = useSelector(state => state.repos.count)

    // function onCountClick() {
    //     dispatch(setCount(5))
    // }
    try {
      console.log(findAllCertificates(0,19));
  }
  catch (err) {
      console.log(err);
  }

    return (
<React.StrictMode>
    {/* <Provider store={store}> */}
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<div>Hello</div>}>
            {/* <div>Hello</div> */}
          </Route>
          <Route path="/" element={  <StyledEngineProvider injectFirst>
    <CertificateTable />
  </StyledEngineProvider>}>
            {/* <App /> */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    {/* </Provider> */}
  </React.StrictMode>
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

function isEmpty(str) {
  return (!str || str.length === 0);
}
async function findAllCertificates(page, size, name = null, description = null, tagNames = null) {
    let apiUrl = `https://localhost:8443/v3/certificates?page=${page}&size=${size}&sortType=DESC&orderType=CREATE_DATE`;

    if (!isEmpty(name)) {
        apiUrl += `&name=${name}`
    }
    if (!isEmpty(description)) {
        apiUrl += `&description=${description}`
    }
    if (!isEmpty(tagNames)) {
        apiUrl += `&tagNames=${tagNames}`
    }
    return await axios.get(apiUrl)
    
    
    
}