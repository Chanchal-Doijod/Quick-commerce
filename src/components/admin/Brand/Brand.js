import { FormHelperText, FormControl, InputLabel, Select, MenuItem, Button, Grid, TextField, Avatar } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import logo from "../../../assets/logo.png";
import cart from "../../../assets/cart.png";
import SaveIcon from '@mui/icons-material/Save';
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { postData, currentDate, getData } from "../../../services/FetchNodeAdminServices";
import { useStyles } from './Brandcss';

export default function Brand(props) {
    var classes = useStyles();
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [brandName, setBrandName] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [brandIcon, setBrandIcon] = useState({ bytes: '', fileName: cart });
    const [errorMessages, setErrorMessages] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [subcategoryList, setSubcategoryList] = useState([]);

    const fetchAllCategory = async () => {
        var result = await getData('category/display_all_category');
        setCategoryList(result.data);
    };

    const fetchAllsubcategory = async (cid) => {
        var body = { categoryid: cid };
        var result = await postData("subcategory/get_all_subcategory_by_categoryid", body);
        setSubcategoryList(result.data);
    };

    useEffect(() => {
        fetchAllCategory();
    }, []);

    


    const fillCategory = () => {
        return categoryList.map((item) => (
            <MenuItem key={item.categoryid} value={item.categoryid}>
                {item.categoryname}
            </MenuItem>
        ));
    };

    const fillSubcategory = () => {
        return subcategoryList.map((item) => (
            <MenuItem key={item.subcategoryid} value={item.subcategoryid}>
                {item.subcategoryname}
            </MenuItem>
        ));
    };

    const handleSubcategory = (cid) => {
        setCategoryId(cid);
        fetchAllsubcategory(cid);
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
        if (subcategoryId.length === 0) {
            handleErrorMessages('subcategoryId', 'Please select a subcategory ID...');
            err = true;
        }
        if (brandName.length === 0) {
            handleErrorMessages('brandName', 'Please input brand name...');
            err = true;
        }
        if (brandIcon.bytes.length === 0) {
            handleErrorMessages('brandIcon', 'Please select a brand icon...');
            err = true;
        }
        return err;
    };

    const handleImage = (e) => {
        handleErrorMessages('brandIcon', null);
        const file = e.target.files[0];
        setBrandIcon({
            bytes: file,
            fileName: URL.createObjectURL(file)
        });
    };

    const resetValue = () => {
        setCategoryId('');
        setSubcategoryId('');
        setBrandName('');
        setBrandIcon({ bytes: '', fileName: cart });
    };

    const handleSubmit = async () => {
        var err = validateData();
        if (!err) {
            setLoadingStatus(true);

            var formData = new FormData();
            formData.append('categoryid', categoryId);
            formData.append('subcategoryid', subcategoryId);
            formData.append('brandname', brandName);
            formData.append('brandicon', brandIcon.bytes);
            formData.append('created_at', currentDate());
            formData.append('updated_at', currentDate());
            formData.append('user_admin', 'Farzi');

            var result = await postData('brand/brand_submit', formData);

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

            setLoadingStatus(false);
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
                                Brand Register
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
                                onChange={(e) => handleSubcategory(e.target.value)}
                            >
                                {fillCategory()}
                            </Select>
                            <FormHelperText>
                                <div className={classes.errorMessageStyle}>{errorMessages?.categoryId}</div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    {categoryId && (
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Subcategory Id</InputLabel>
                                <Select
                                    value={subcategoryId}
                                    error={!!errorMessages?.subcategoryId}
                                    onFocus={() => handleErrorMessages('subcategoryId', null)}
                                    label="Subcategory Id"
                                    onChange={(e) => setSubcategoryId(e.target.value)}
                                >
                                    {fillSubcategory()}
                                </Select>
                                <FormHelperText>
                                    <div className={classes.errorMessageStyle}>{errorMessages?.subcategoryId}</div>
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            onFocus={() => handleErrorMessages('brandName', null)}
                            error={!!errorMessages?.brandName}
                            helperText={errorMessages?.brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            label="Brand Name"
                            value={brandName}
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
                                {errorMessages?.brandIcon != null ? errorMessages?.brandIcon : <></>}
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Avatar src={brandIcon.fileName} style={{ width: 70, height: 70 }} variant="rounded" />
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
