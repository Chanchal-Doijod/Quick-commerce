import { useState, useEffect } from 'react';
import MaterialTable from '@material-table/core';
import { getData, serverURL, createDate } from '../../../services/FetchNodeAdminServices';
import { useStyles } from './Brandcss'; // Create a similar CSS file for brand
import { IconButton, Grid, TextField, Avatar, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import logo from "../../../assets/logo.png";
import cart from "../../../assets/cart.png";
import SaveIcon from '@mui/icons-material/Save';
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import { postData, currentDate } from '../../../services/FetchNodeAdminServices';

export default function DisplayAllBrand() {
  const classes = useStyles();
  const [brandList, setBrandList] = useState([]);
  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState('');
  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState(''); 
  const [subcategoryId, setSubcategoryId] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [brandIcon, setBrandIcon] = useState({ bytes: '', fileName: cart });
  const [errorMessages, SetErrorMessages] = useState({});
  const [hideUploadButton, setHideUploadButton] = useState(false);
  const [oldImage, setOldImage] = useState('');

  const handleErrorMessages = (label, message) => {
    SetErrorMessages((prev) => ({ ...prev, [label]: message }));
  };

  const showSaveCancelButton = () => (
    <div>
      <Button onClick={handleEditIcon}>Save</Button>
      <Button onClick={handleCancelIcon}>Cancel</Button>
    </div>
  );

  const validateData = () => {
    let err = false;
    if (brandName.length === 0) {
      handleErrorMessages('brandName', 'Please input brand name...');
      err = true;
    }
    if (categoryId.length === 0) {
      handleErrorMessages('categoryId', 'Please input category ID...');
      err = true;
    }
    if (subcategoryId.length === 0) {
      handleErrorMessages('subcategoryId', 'Please input subcategory ID...');
      err = true;
    }
    return err;
  };

  function handleImage(e) {
    handleErrorMessages('brandIcon', null);
    setBrandIcon({
      bytes: e.target.files[0],
      fileName: URL.createObjectURL(e.target.files[0]),
    });
    setHideUploadButton(true);
  }

  const brandForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.mainHeadingStyle}>
          <img src={logo} className={classes.imageStyle} alt="Logo" style={{ width: 70, height: 70 }} />
          <div className={classes.headingStyle}>Brand Register</div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={brandName}
          onFocus={() => handleErrorMessages('brandName', null)}
          error={!!errorMessages.brandName}
          helperText={errorMessages.brandName}
          onChange={(e) => setBrandName(e.target.value)}
          label="Brand Name"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={categoryId}
          onFocus={() => handleErrorMessages('categoryId', null)}
          error={!!errorMessages.categoryId}
          helperText={errorMessages.categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          label="Category Id"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={subcategoryId}
          onFocus={() => handleErrorMessages('subcategoryId', null)}
          error={!!errorMessages.subcategoryId}
          helperText={errorMessages.subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          label="Subcategory Id"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} className={classes.center}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {hideUploadButton ? showSaveCancelButton() : (
            <Button variant="contained" component="label">
              Upload
              <input onChange={handleImage} hidden type="file" accept="image/*" />
            </Button>
          )}
          <div className={classes.errorMessageStyle}>
            {errorMessages.brandIcon}
          </div>
        </div>
      </Grid>
      <Grid item xs={6} className={classes.center}>
        <Avatar src={brandIcon.fileName} style={{ width: 70, height: 70 }} variant="rounded" />
      </Grid>
    </Grid>
  );

  const fetchAllBrand = async () => {
    const result = await getData('brand/display_all_brand');
    if (result.status) {
      setBrandList(result.data);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    fetchAllBrand();
  }, []);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCancelIcon = () => {
    setBrandIcon({ bytes: '', fileName: oldImage });
    setHideUploadButton(false);
  };

  const handleOpenDialog = (rowData) => {
    setBrandId(rowData.brandid);
    setBrandName(rowData.brandname);
    setCategoryId(rowData.categoryid);
    setSubcategoryId(rowData.subcategoryid);
    setBrandIcon({ bytes: '', fileName: `${serverURL}/images/${rowData.brandicon}` });
    setOldImage(`${serverURL}/images/${rowData.brandicon}`);
    setOpen(true);
  };

  const handleEditData = async () => {
    const err = validateData();
    if (!err) {
      setLoadingStatus(true); // Start loading

      const body = {
        brandname: brandName,
        categoryid: categoryId,
        subcategoryid: subcategoryId,
        brandid: brandId,
        updated_at: currentDate()
      };

      const result = await postData('brand/edit_brand_data', body);

      Swal.fire({
        position: 'top-end',
        icon: result.status ? "success" : "error",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });

      setLoadingStatus(false); // Stop loading
      fetchAllBrand();
    }
  };

  const handleEditIcon = async () => {
    setLoadingStatus(true); // Start loading
    const formData = new FormData();
    formData.append('brandicon', brandIcon.bytes);
    formData.append('brandid', brandId);
    formData.append('updated_at', currentDate());

    const result = await postData('brand/edit_brand_icon', formData);

    Swal.fire({
      position: 'top-end',
      icon: result.status ? "success" : "error",
      title: result.message,
      showConfirmButton: false,
      timer: 2000,
      toast: true
    });

    setLoadingStatus(false); // Stop loading
    setHideUploadButton(false);
    fetchAllBrand();
  };

  const handleDeleteBrand = async () => {
    Swal.fire({
      title: "Do you want to delete the brand?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await brandDelete();

        Swal.fire({
          position: 'top-end',
          icon: "success",
          title: "Brand deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else if (result.isDenied) {
        Swal.fire("Brand not deleted", "", "info");
      }
    });
  };

  const brandDelete = async () => {
    setLoadingStatus(true); // Start loading

    var body = { 'brandid': brandId };
    var result = await postData('brand/delete_brand', body);

    if (result.status) {
      Swal.fire({
        position: 'top-end',
        icon: "success",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: "error",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    }

    setLoadingStatus(false); // Stop loading
    setHideUploadButton(false);
    fetchAllBrand(); // Refresh the brand list
  };

  const showBrandDialog = () => (
    <Dialog open={open} onClose={handleCloseDialog}>
      <IconButton
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={handleCloseDialog}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {brandForm()}
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loadingStatus}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={handleEditData}
        >
          Edit Data
        </LoadingButton>
        <Button onClick={handleDeleteBrand} variant="contained">Delete</Button>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const brandTable = () => (
    <div className={classes.root}>
      <div className={classes.displayBox}>
        <MaterialTable
          title="Brand List"
          columns={[
            { title: 'Brand Id', field: 'brandid' },
            { title: 'Brand Name', field: 'brandname' },
            { title: 'Category Id', field: 'categoryid' },
            { title: 'Subcategory Id', field: 'subcategoryid' },
            {
              title: 'Created at',
              render: (rowData) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{createDate(rowData.created_at)}</div>
                  <div>{createDate(rowData.updated_at)}</div>
                </div>
              ),
            },
            {
              title: 'Icon',
              render: (rowData) => (
                <div>
                  <img src={`${serverURL}/images/${rowData.brandicon}`} style={{ width: 60, height: 60, borderRadius: 6 }} alt="Brand Icon" />
                </div>
              ),
            },
          ]}
          data={brandList}
          options={{
            pageSize: 3,
            pageSizeOptions: [3, 5, 10, { value: brandList.length, label: 'All' }],
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Brand',
              onClick: (event, rowData) => handleOpenDialog(rowData),
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div>
      {brandTable()}
      {showBrandDialog()}
    </div>
  );
}
