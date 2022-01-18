import React, { useState, useEffect } from "react";
import Keycloak from "keycloak-js";

export const Secured = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false)

  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    console.log('im hereeeeeeeeeeeeeeeeeee1');
    const keycloak = Keycloak("keycloak.json");
    console.log('im hereeeeeeeeeeeeeeeeeee2');
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      console.log(authenticated);
      console.log('im hereeeeeeeeeeeeeeeeeee');
      setKeycloak(keycloak);
      setAuthenticated(authenticated);
      //    this.setState({ keycloak: keycloak, authenticated: authenticated });
      if (authenticated) {
        window.localStorage.setItem("accessToken", keycloak.token);
        console.log(keycloak.token);
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
// export default class Secured extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { Keycloak: null, authenticated: false };
//   }

//   componentDidMount() {
//     const keycloak = Keycloak("keycloak.json");
//     keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
//       this.setState({ keycloak: keycloak, authenticated: authenticated });
//       if (authenticated) {
//         window.localStorage.setItem("accessToken", keycloak.token);
//         console.log(keycloak.token);
//       }
//     });

//   }
//   render() {
//     if (this.state.Keycloak) {
//       if (this.state.authenticated) return (
//         <div>
//           <p>This is a Keycloak-secured component of your application</p>
//         </div>
//       ); else return (<div>Unable to auth</div>)
//     }
//     return (<div>
//       Init keycloak...
//     </div>)
//   }
// }
