import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddCertificateModal from "./CertificateModalWindow";
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
import AlertDialogSlide from "./ConfirmationModalWindow";
import { useSearchParams } from "react-router-dom";
import InputBase from '@mui/material/InputBase';
import { useSelector, useDispatch } from 'react-redux';
import {
    loadAll, setSelected, selectFlagOfError, selectRows, selectSelected
} from '../../reducers/certificateSlice';
import SearchIcon from '@mui/icons-material/Search';
import ErrorAlert from '../error/ErrorComponent';


function CertificateSearch() {
    const [value, setValue] = React.useState();
    const rows = useSelector(selectRows);
    const dispatch = useDispatch();
    function findByCriteria(text) {
        let firstSymbol = text.charAt(0);
        switch (firstSymbol) {
            case '!': {
                let description = text.substring(1, text.length);
                findAllCertificates(0, 100, null, description);
                break;
            }
            case '#': {
                let tagNames = text.split('#');
                let realTags = [];
                for (let i = 1; i < tagNames.length; i++) {
                    realTags.push(tagNames[i].slice());
                }
                findAllCertificates(0, 100, null, null, realTags);
                break
            }
            default: {
                findAllCertificates(0, 100, text);
                break;
            }
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
                        console.warn(response.status);
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
    }
    const handleSearch = (event) => {
        const params = new URLSearchParams();
        params.append("text", value);
        findByCriteria(value);
    }
    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search row"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={event => {
                    setValue(event.target.value)
                }}
            />
            <IconButton sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};



function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'datetime',
        numeric: true,
        disablePadding: false,
        label: 'Datetime',
    },
    {
        id: 'tags',
        numeric: true,
        disablePadding: false,
        label: 'Tags',
    },
    {
        id: 'description',
        numeric: true,
        disablePadding: false,
        label: 'Description',
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Price',
    },
    {
        id: 'duration',
        numeric: true,
        disablePadding: false,
        label: 'Duration',
    },

];

function EnhancedTableHead(props) {

    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };


    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};



const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected == 1 ? (
                <AddCertificateModal flag={false} name={props.selected} rows={props.rows} />
            ) : (
                <div></div>
            )}
            {numSelected > 0 ? (

                < AlertDialogSlide selected={props.selected} />

            ) : (
                <div></div>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [count, setCount] = React.useState(0);
    const [status, setStatus] = React.useState(200);
    const flagOfError = useSelector(selectFlagOfError);
    const [searchParams, setSearchParams] = useSearchParams();
    const mounted = React.useRef();
    const rows = useSelector(selectRows);
    const selected = useSelector(selectSelected);
    const dispatch = useDispatch();

    const findCount = () => {
        axios.get(`https://localhost:8443/v3/certificates/count`)
            .then(res => {
                const countofCertificates = res.data;

                setCount(countofCertificates);
            })
    }

    React.useEffect(() => {
        if (!mounted.current) {

            let text = searchParams.get('text');
            if (!text) {
                findAllCertificates(0, 100)
            }


            mounted.current = true;
        } else {

        }
        findCount();
    });

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
    function loadCertificates(page, size) {
        try {
            findAllCertificates(page, size);

        } catch (error) {

        }
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
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            dispatch(setSelected(newSelecteds));
            return;
        }
        dispatch(setSelected([]));
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }


        dispatch(setSelected(newSelected));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let count = parseInt(event.target.value, 10)
        setRowsPerPage(count);
        setPage(0);

    };


    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (

        <Box sx={{ width: '100%' }}>
            <ErrorAlert flag={flagOfError} status={status} />
            <CertificateSearch />
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} rows={rows} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.datetime}</TableCell>
                                            <TableCell align="right">{row.tags}</TableCell>
                                            <TableCell align="right">{row.description}</TableCell>
                                            <TableCell align="right">{row.price}</TableCell>
                                            <TableCell align="right">{row.duration}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={<span>Rows:</span>}
                    labelDisplayedRows={({ page }) => {
                        return `Page: ${page + 1}`;
                    }}
                    backIconButtonProps={{
                        color: "secondary"
                    }}
                    nextIconButtonProps={{ color: "secondary" }}
                    SelectProps={{
                        inputProps: {
                            "aria-label": "page number"
                        }
                    }}
                    showFirstButton={true}
                    showLastButton={true}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}



