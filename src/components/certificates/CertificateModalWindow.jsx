import * as React from 'react';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import axiosInstance from "../security/requestInterceptor";
import { Link, Modal, Box, Typography, Stack, Button } from "@mui/material";
import { WithContext as ReactTags } from 'react-tag-input';
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

export default function AddCertificateModal() {
    const [open, setOpen] = React.useState(false);
    const [certificate, setCertificate] = React.useState({ name: '', description: '', duration: '', price: '', tags: '' });
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const suggestions = [
        { id: "1", text: "mango" },
        { id: "2", text: "pineapple" },
        { id: "3", text: "orange" },
        { id: "4", text: "pear" }
    ];
    // const suggestions = COUNTRIES.map(country => {
    //     return {
    //         id: country,
    //         text: country
    //     };
    // });

    const KeyCodes = {
        comma: 188,
        enter: 13
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];


    const [tags, setTags] = React.useState([
        { id: 'Thailand', text: 'Thailand' },
        { id: 'India', text: 'India' },
        { id: 'Vietnam', text: 'Vietnam' },
        { id: 'Turkey', text: 'Turkey' }
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

    const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
    };





const createCertificate = (result) => {

    axiosInstance
        .post("https://localhost:8443/v3/certificates", result)
        .then((response) => {
            console.log(response.data.id+'resp');
            const tagDtos = tags.map((value) => {
                delete value.id;
                return value.text;
              });
            console.log(tagDtos)
            axiosInstance
                .post(`https://localhost:8443/v3/tags/create/${response.data.id}`, tagDtos)
            handleClose();
            window.location.reload();
        });

}
return (

    <div>
        <Typography variant="h5" color="white">
            <Link
                color="inherit"
                underline="hover"
                style={{ paddingLeft: '20px' }}
                onClick={handleOpen}>
                Add certificate
            </Link>
        </Typography>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h5" color="black">
                    Create certificate
                </Typography>
                <ValidatorForm
                    onSubmit={(e) => {
                        // const tags = certificate.tags.map((value) => {
                        //     delete value.id;
                        //     return value;
                        // });
                        const result = {
                            name: certificate.name,
                            description: certificate.description,
                            duration: certificate.duration,
                            price: certificate.price,
                            // tags: tags,
                        };

                        createCertificate(result);

                    }}
                >
                    <Stack
                        spacing={3}
                        direction="column"
                        marginTop={2}
                        marginBottom={2}
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
                            multiline
                            rows={4}
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
                                Save
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