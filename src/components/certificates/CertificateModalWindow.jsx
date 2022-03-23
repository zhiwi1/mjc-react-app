import * as React from 'react';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import axiosInstance from "../security/requestInterceptor";
import { Link, Modal, Box, Typography, Stack, Button } from "@mui/material";
import { WithContext as ReactTags } from 'react-tag-input';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector, useDispatch } from 'react-redux';
import {
    loadAll, selectStatusOfError, setStatus, setFlagOfError, setSelected
} from '../../reducers/certificateSlice';
import axios from 'axios';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AddCertificateModal(props) {

    const [open, setOpen] = React.useState(false);
    const [certificate, setCertificate] = React.useState({ name: '', description: '', duration: '', price: '', tags: '' });

    const handleOpen = () => { setOpen(true); }
    const handleClose = () => { setOpen(false); dispatch(setSelected([])); }
    const dispatch = useDispatch();
    const mounted = React.useRef();


    const suggestions = [
        { id: "1", text: "mango" },
        { id: "2", text: "pineapple" },
        { id: "3", text: "orange" },
        { id: "4", text: "pear" }
    ];


    const KeyCodes = {
        comma: 188,
        enter: 13
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    // function createData(name) {
    //     return {
    //        {id: name,text: name}

    //     };
    // }


    const [tags, setTags] = React.useState([
        // { id: 'NotFree', text: '#notfree' },
        // { id: 'India', text: 'India' },
        // { id: 'Vietnam', text: 'Vietnam' },
        // { id: 'Turkey', text: 'Turkey' }
    ]);


    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };
    function findIdOfCertificateByName(name) {
        let id = 0;
        if (!props.flag) {
            props.rows.forEach((row) => {
                if (name == row.name) {
                    
                    
                    id = row.id;
                }
            })
        } return id;
    }
    const handleTagClick = index => {
        
    };
    const createFormatTags = (tags) => {
        
        let formatTags = [];
        tags.forEach((tag) => {
            if (tag != '') {
                let formatTag = { id: tag, text: tag };
                formatTags.push(formatTag);
            }
        })
        return formatTags;
    };
    React.useEffect(() => {
        if (!mounted.current) {
            if (!props.flag) {
                props.rows.forEach((row) => {
                    if (row.name == props.name) {
                        setCertificate(row);
                        var space = ' ';
                        let tags = row.tags.split(space);
                        let formatTags = createFormatTags(tags);
                        setTags(formatTags);
                    }
                })
            }
            mounted.current = true;
        } 
    });
    const editCertificate = (result) => {

        let id = findIdOfCertificateByName(props.name)
        
        axiosInstance
            .patch(`https://localhost:8443/v3/certificates/${id}`, result)
            .then((response) => {
                
                const tagDtos = tags.map((value) => {
                    delete value.id;
                    return value.text;
                });
                
                axiosInstance
                    .post(`https://localhost:8443/v3/tags/create/${response.data.id}`, tagDtos)
                    .catch(function (error) {
                        if (error.response) {
                            
                        }
                    });

                handleClose();

            }).catch(error => {

                dispatch(setFlagOfError(true))
                if (error.response) {
                    dispatch(setStatus(error.response.status))
                    



                } else { dispatch(setStatus(401)); }
                handleClose();

            });

        setTimeout(() => { findAllCertificates(0, 100) }, 1000);;

    }


    const createCertificate = (result, flagOfEditing) => {

        axiosInstance
            .post("https://localhost:8443/v3/certificates", result)
            .then((response) => {
                
                const tagDtos = tags.map((value) => {
                    delete value.id;
                    return value.text;
                });
                
                axiosInstance
                    .post(`https://localhost:8443/v3/tags/create/${response.data.id}`, tagDtos)


                handleClose();
            }).catch(error => {

                dispatch(setFlagOfError(true))
                if (error.response) {
                    dispatch(setStatus(error.response.status))
                    
                    handleClose();

                } else dispatch(setStatus(401));
            });
        
        setTimeout(() => { findAllCertificates(0, 100) }, 1000);;
    }
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
        
        axios.get(apiUrl)
            .then((response) => {
                answer = showCertificates(response.data)

            }).catch(function (error) {
                if (error.response) {

                    

                }
            });
        return (answer);
    }




    function showCertificates(certificates) {
        let rs = [];
        certificates.forEach((certificate) => {
            
            let tagsFormatString = '';
            certificate.tags.forEach((tag) => {
                tagsFormatString += (tag.name + ' ');
            });
            const row = createData(certificate.id, certificate.name, certificate.create_date, tagsFormatString, certificate.description, certificate.price, certificate.duration);
            
            rs.push(row);

        });
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
            {props.flag ? (
                <Typography variant="h5" color="white">
                    <Link
                        color="inherit"
                        underline="hover"

                        style={{ paddingLeft: '20px' }}

                        onClick={handleOpen}>
                        (<div style={{ marginLeft: '1em' }} > Create certificate</div>) : (

                    </Link>

                </Typography>) : (
                <Tooltip title="Edit">
                    <IconButton onClick={handleOpen} >
                        <EditIcon />
                    </IconButton>
                </Tooltip>)}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5" color="black">
                        {props.flag ? (
                            <div > Create certificate</div>
                        ) : (<div> Edit certificate</div>)}
                    </Typography>
                    <ValidatorForm
                        onSubmit={(e) => {

                            const result = {
                                name: certificate.name,
                                description: certificate.description,
                                duration: certificate.duration,
                                price: certificate.price,
                            };
                            props.flag ? createCertificate(result) : editCertificate(result);



                        }}
                    >
                        <Stack
                            spacing={3}
                            direction="column"
                            marginTop={2}
                            marginBottom={3}
                        >
                            {/* <Typography variant="h4">{this.props.title}</Typography> */}
                            <TextValidator
                                id="name"
                                label="Title"
                                value={certificate.name}
                                onChange={(event) => {
                                    const name = event.target.value;
                                    setCertificate({ ...certificate, name: name });
                                }}
                                validators={[
                                    "required",
                                    "minStringLength:6",
                                    "maxStringLength:30",
                                ]}
                                errorMessages={[
                                    "This field is required",
                                    "Length must be more than 6",
                                    "Length must be less than 30",
                                ]}
                            />
                            <TextValidator
                                id="description"
                                label="description"
                                value={certificate.description}
                                onChange={(event) => {
                                    const description = event.target.value;
                                    setCertificate({ ...certificate, description: description });
                                }}
                                // multiline
                                // rows={3}
                                validators={[
                                    "required",
                                    "minStringLength:12",
                                    "maxStringLength:1000",
                                ]}
                                errorMessages={[
                                    "this field is required",
                                    "Length must be more than 12",
                                    "Length must be less than 1000",
                                ]}
                            />
                            <TextValidator
                                id="duration"
                                label="duration"
                                value={certificate.duration}
                                onChange={(event) => {
                                    const duration = event.target.value;
                                    setCertificate({ ...certificate, duration: duration });
                                }}
                                validators={["required", "isNumber", "minNumber:1"]}
                                errorMessages={[
                                    "This field is required",
                                    "Must be a number",
                                    "Must be greater than 1",
                                ]}
                            />
                            <TextValidator
                                id="price"
                                label="price"
                                value={certificate.price}
                                onChange={(event) => {
                                    const price = event.target.value;
                                    setCertificate({ ...certificate, price: price });
                                }}
                                validators={["required", "isFloat", "isPositive"]}
                                errorMessages={[
                                    "This field is required",
                                    "Must be a number",
                                    "Must be positive",
                                ]}
                            />
                            <div className="tags">
                                <div>
                                    <ReactTags
                                        tags={tags}
                                        suggestions={suggestions}
                                        delimiters={delimiters}
                                        handleDelete={handleDelete}
                                        handleAddition={handleAddition}
                                        handleDrag={handleDrag}
                                        handleTagClick={handleTagClick}
                                        inputFieldPosition="bottom"
                                        autocomplete
                                    />
                                </div>
                            </div>
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Button type="submit" variant="text">
                                    {
                                        props.flag ? (<div > Save</div>) : (
                                            <div> Edit</div>
                                        )
                                    }

                                </Button>
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </ValidatorForm>
                </Box>
            </Modal>

        </div >
    );
}