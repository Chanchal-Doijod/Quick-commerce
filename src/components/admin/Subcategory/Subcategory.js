import { FormHelperText, FormControl, InputLabel, Select, MenuItem, Button, Grid, TextField, Avatar } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import logo from "../../../assets/logo.png";
import cart from "../../../assets/cart.png";
import SaveIcon from '@mui/icons-material/Save';
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { postData, currentDate, getData } from "../../../services/FetchNodeAdminServices";
import { useStyles } from './subcategorycss';

export default function Subcategory(props) {
    var classes = useStyles();
    const [categoryId, setCategoryId] = useState(''); // Added state for categoryId
    const [subcategoryName, setSubcategoryName] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(false); // Change to boolean
    const [subcategoryIcon, setSubcategoryIcon] = useState({ bytes: '', fileName: cart });
    const [errorMessages, setErrorMessages] = useState({});
    const [categoryList, setCategoryList] = useState([]);

    const fetchAllCategory = async () => {
        var result = await getData('category/display_all_category');
        setCategoryList(result.data);
    };

    useEffect(function () {
        fetchAllCategory();
    }, []);

    const fillCategory = () => {
        return categoryList.map((item) => (
            <MenuItem key={item.categoryid} value={item.categoryid}>
                {item.categoryname}
            </MenuItem>
        ));
    };

    const handleErrorMessages = (label, message) => {
        var msg = { ...errorMessages };
        msg[label] = message;
        setErrorMessages(msg);
    };

    const validateData = () => {
        var err = false;
        if (categoryId.length === 0) {
            handleErrorMessages('categoryId', 'Please select a category ID...');
            err = true;
        }
        if (subcategoryName.length === 0) {
            handleErrorMessages('subcategoryName', 'Please input subcategory name...');
            err = true;
        }
        if (subcategoryIcon.bytes.length === 0) {
            handleErrorMessages('subcategoryIcon', 'Please select a subcategory icon...');
            err = true;
        }
        return err;
    };

    const handleImage = (e) => {
        handleErrorMessages('subcategoryIcon', null);
        const file = e.target.files[0];
        console.log(file); // Log the file object to see if it's correctly picked up
        setSubcategoryIcon({
            bytes: file,
            fileName: URL.createObjectURL(file)
        });
    };
    

    const resetValue = () => {
        setCategoryId(''); // Reset categoryId
        setSubcategoryName('');
        setSubcategoryIcon({ bytes: '', fileName: cart });
    };

    const handleSubmit = async () => {
        var err = validateData();
        if (!err) {
            setLoadingStatus(true); // Start loading

            var formData = new FormData();
            formData.append('categoryid', categoryId);
            formData.append('subcategoryname', subcategoryName);
            formData.append('subcategoryicon', subcategoryIcon.bytes);
            formData.append('created_at', currentDate());
            formData.append('updated_at', currentDate());
            formData.append('user_admin', 'Farzi');

            var result = await postData('subcategory/subcategory_submit', formData);

            if (result.status) {
                Swal.fire({
                    icon: "success",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                });
            }

            setLoadingStatus(false); // Stop loading
            resetValue();
        }
    };

    const handleReset = () => {
        resetValue();
    };

    return (
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={classes.mainHeadingStyle}>
                            <img src={logo} className={classes.imageStyle} alt="Logo" style={{ width: 70, height: 70 }} />
                            <div className={classes.headingStyle}>
                                SubCategory Register
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Category Id</InputLabel>
                            <Select
                                value={categoryId}
                                error={!!errorMessages?.categoryId}
                                onFocus={() => handleErrorMessages('categoryId', null)}
                                label="Category Id"
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {fillCategory()}
                            </Select>
                            <FormHelperText>
                                <div className={classes.errorMessageStyle}>{errorMessages?.categoryId}</div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onFocus={() => handleErrorMessages('subcategoryName', null)}
                            error={!!errorMessages?.subcategoryName}
                            helperText={errorMessages?.subcategoryName}
                            onChange={(e) => setSubcategoryName(e.target.value)}
                            label="SubCategory Name"
                            value={subcategoryName}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Button variant="contained" component="label">
                                Upload
                                <input onChange={handleImage} hidden type="file" accept="image/*" />
                            </Button>
                            <div className={classes.errorMessageStyle}>
                                {errorMessages?.subcategoryIcon != null ? errorMessages?.subcategoryIcon : <></>}
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Avatar src={subcategoryIcon.fileName} style={{ width: 70, height: 70 }} variant="rounded" />
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <LoadingButton
                            loading={loadingStatus}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            onClick={handleSubmit}
                            
                        >
                            Save
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Button onClick={handleReset} variant="contained">Reset</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
