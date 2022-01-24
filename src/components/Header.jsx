import React, { useState, useEffect } from "react";
import { Box, Link, Stack, Typography,Button } from "@mui/material";
import AddCertificateModal from "./certificates/CertificateModalWindow";
import Keycloak from "keycloak-js";
import { useSelector, useDispatch } from "react-redux";

export default function Header() {
    const [details, setDetails] = useState({ keycloak: null, authenticated: false });
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
      };
    
    useEffect(() => {
        const keycloak = Keycloak("keycloak.json");
        keycloak.init({ onLoad: "check-sso" }).then((authenticated) => {
            setDetails({ ...details, keycloak: keycloak, authenticated: authenticated })
            if (authenticated) {
                window.localStorage.setItem("accessToken", keycloak.token);
            }
        });
    }, []);

    return (
        <header>
            <Box
                sx={{
                    height: 40,
                    bgcolor: "#013220",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Stack
                    justifyContent="flex-start"
                    direction="row"
                    alignItems="center"
                    ml={2}
                >
                    <Typography variant="h5" color="white">
                        LOGO
                    </Typography>
                    <AddCertificateModal/>
                </Stack>
              
                    
                   
             
                {details.authenticated ? (
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        mr={2}
                        spacing={2}
                    >
                        <Typography variant="h5" color="white">
                            {details.keycloak.tokenParsed.preferred_username}
                        </Typography>
                        <Typography variant="h5" color="white">
                            <Link
                                color="inherit"
                                underline="hover"
                                onClick={() => {
                                    setDetails({
                                        ...details,
                                        authenticated: false,
                                    });
                                    window.localStorage.removeItem("accessToken");
                                    details.keycloak.logout();
                                }}
                            >
                                Logout
                            </Link>
                        </Typography>
                    </Stack>
                ) : (
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        mr={2}
                        spacing={2}
                    >
                        <Typography variant="h5" color="white">
                            <Link
                                color="inherit"
                                underline="hover"
                                onClick={() => {
                                    details.keycloak.login().then((authenticated) => {
                                        setDetails({
                                            ...details,
                                            authenticated: authenticated,
                                        });
                                        if (authenticated) {
                                            window.localStorage.setItem(
                                                "accessToken",
                                                details.keycloak.token
                                            );
                                        }
                                    });
                                }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Stack>
                )}
            </Box>
        </header>
    );
}