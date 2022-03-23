import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axiosInstance from "../security/requestInterceptor";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';

import {
    loadAll,  setStatus, setFlagOfError, setSelected
} from '../../reducers/certificateSlice';
import axios from "axios";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
    const [stateFormatString, setStateFormatString] = React.useState('');
 
    React.useEffect(() => {
        createFormatCertificates(props.selected);
    })
    const dispatch = useDispatch();
    const createFormatCertificates = (names) => {
        let formatString = '';
        names.forEach((name) => {
            formatString += (name + ' ');
        });
        setStateFormatString(formatString);
    }
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const deleteCertificates = (selected) => {
        console.log(selected);
        axiosInstance
            .delete(`https://localhost:8443/v3/certificates/delete`, { data: selected })
            .then((response) => {
               findAllCertificates(0,100);
            }).catch(error => {
               
                dispatch(setFlagOfError(true))
                if (error.response) {
                dispatch(setStatus(error.response.status))
                console.log('ERROER' + error.response.status);
                handleClose();

            }else  dispatch(setStatus(401));

                
            });

    }
    const handleClosePositive = (selected) => {
        dispatch(setSelected([]));
        deleteCertificates(selected);
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
   
  

    function isEmpty(str) {
        return (!str || str.length === 0);
    }
    
    function findAllCertificates(page, size, name = null, description = null, tagNames = null) {
        let answer = [];

        let apiUrl = `https://localhost:8443/v3/certificates?page=${page}&size=${size}&sortType=DESC&orderType=CREATE_DATE`;

        if (!isEmpty(name)) {
            apiUrl += `&name=${name}`
        }
        if (!isEmpty(description)) {
            apiUrl += `&description=${description}`
        }

        if (!isEmpty(tagNames)) {
            for (let i = 0; i < tagNames.length; i++) {
                let tagName = tagNames[i];
                apiUrl += `&tagNames=${tagName}`
            }
        }
        console.log(apiUrl);
        axios.get(apiUrl)
            .then((response) => {
                answer = showCertificates(response.data)

            }).catch(error => {
                if (error.response) {
                dispatch(setFlagOfError(true))
                dispatch(setStatus(error.response.status))
                handleClose();

            }else if(error.status) dispatch(setStatus(401));

                
            });
        return (answer);
    }




    function showCertificates(certificates) {
        let rs = [];
        certificates.forEach((certificate) => {
            console.log(certificate);
            let tagsFormatString = '';
            certificate.tags.forEach((tag) => {
                tagsFormatString += (tag.name + ' ');
            });
            const row = createData(certificate.id, certificate.name, certificate.create_date, tagsFormatString, certificate.description, certificate.price, certificate.duration);
            console.log(row);
            rs.push(row);

        }
        );
        dispatch(loadAll(rs));
        return rows;
    };

    function createData(id, name, datetime, tags, description, price, duration) {
        return {
            id,
            name,
            datetime,
            tags,
            description,
            price,
            duration
        };
    }
    return (
        <div>
            <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen} >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Are you sure you really want to delete?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Names of certificates: {stateFormatString}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={() => handleClosePositive(props.selected)}>Confirm</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}