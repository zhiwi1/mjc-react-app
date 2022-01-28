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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
    const [stateFormatString, setStateFormatString] = React.useState('');
    React.useEffect(() => {
        createFormatCertificates(props.selected);
    })
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
                //todo 
                window.location.reload();
            });

    }
    const handleClosePositive = (selected) => {
        console.log(selected + 'f');
        deleteCertificates(selected);
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
    };

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