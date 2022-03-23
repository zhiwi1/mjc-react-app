import "./index.css";
import React from "react";
import { NotFound } from "../src/components/NotFound"
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CertificateTable from "./components/certificates/CertificateTable"
import { StyledEngineProvider } from '@mui/material/styles';

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<StyledEngineProvider injectFirst>
            <CertificateTable />
          </StyledEngineProvider>}>
          </Route>
          <Route path="/login" element={<div>Hello</div>}>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;



