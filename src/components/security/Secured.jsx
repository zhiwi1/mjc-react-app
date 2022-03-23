import React, { useState, useEffect } from "react";
import Keycloak from "keycloak-js";

export const Secured = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false)


  useEffect(() => {
    const keycloak = Keycloak("keycloak.json");
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setKeycloak(keycloak);
      setAuthenticated(authenticated);
      if (authenticated) {
        window.localStorage.setItem("accessToken", keycloak.token);
      }
    }).catch(error => {
      if (error.response) {
        dispatch(setFlagOfError(true))
        dispatch(setStatus(error.response.status))
      }
    });
  }, []);
  if (keycloak) {
    if (authenticated) return (
      <div>
        <p>This is a Keycloak-secured component of your application</p>
      </div>
    ); else return (<div>Unable to auth</div>)
  }
  return (<div>
    Init keycloak...
  </div>)
}






























