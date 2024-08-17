import { useState, useEffect } from 'react';
import MaterialTable from '@material-table/core';
import { getData, serverURL, createDate } from '../../../services/FetchNodeAdminServices';
import { useStyles } from './subcategorycss'; // Create a similar CSS file for subcategory
import { IconButton, Grid, TextField, Avatar, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import logo from "../../../assets/logo.png";
import cart from "../../../assets/cart.png";
import SaveIcon from '@mui/icons-material/Save';
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import { postData, currentDate } from '../../../services/FetchNodeAdminServices';

export default function DisplayAllSubcategory() {
  const classes = useStyles();
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [categoryId, setCategoryId] = useState(''); // Assuming you have a category ID to link to subcategories
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [subcategoryIcon, setSubcategoryIcon] = useState({ bytes: '', fileName: cart });
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
    if (subcategoryName.length === 0) {
      handleErrorMessages('subcategoryName', 'Please input subcategory name...');
      err = true;
    }
    return err;
  };

  function handleImage(e) {
    handleErrorMessages('subcategoryIcon', null);
    setSubcategoryIcon({
      bytes: e.target.files[0],
      fileName: URL.createObjectURL(e.target.files[0]),
    });
    setHideUploadButton(true);
  }

  const subcategoryForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.mainHeadingStyle}>
          <img src={logo} className={classes.imageStyle} alt="Logo" style={{ width: 70, height: 70 }} />
          <div className={classes.headingStyle}>Subcategory Register</div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={subcategoryName}
          onFocus={() => handleErrorMessages('subcategoryName', null)}
          error={!!errorMessages.subcategoryName}
          helperText={errorMessages.subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
          label="Subcategory Name"
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
      <Grid item xs={6} className={classes.center}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {hideUploadButton ? showSaveCancelButton() : (
            <Button variant="contained" component="label">
              Upload
              <input onChange={handleImage} hidden type="file" accept="image/*" />
            </Button>
          )}
          <div className={classes.errorMessageStyle}>
            {errorMessages.subcategoryIcon}
          </div>
        </div>
      </Grid>
      <Grid item xs={6} className={classes.center}>
        <Avatar src={subcategoryIcon.fileName} style={{ width: 70, height: 70 }} variant="rounded" />
      </Grid>
    </Grid>
  );

  const fetchAllSubcategory = async () => {
    const result = await getData('subcategory/display_all_subcategory');
    if (result.status) {
      setSubcategoryList(result.data);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    fetchAllSubcategory();
  }, []);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCancelIcon = () => {
    setSubcategoryIcon({ bytes: '', fileName: oldImage });
    setHideUploadButton(false);
  };

  const handleOpenDialog = (rowData) => {
    setSubcategoryId(rowData.subcategoryid);
    setSubcategoryName(rowData.subcategoryname);
    setCategoryId(rowData.categoryid);
    setSubcategoryIcon({ bytes: '', fileName: `${serverURL}/images/${rowData.subcategoryicon}` });
    setOldImage(`${serverURL}/images/${rowData.subcategoryicon}`);
    setOpen(true);
  };

  const handleEditData = async () => {
    const err = validateData();
    if (!err) {
      setLoadingStatus(true); // Start loading

      const body = {
        subcategoryname: subcategoryName,
        created_at: currentDate(),
        updated_at: currentDate(),
        categoryid: categoryId,
        subcategoryid: subcategoryId
      };

      const result = await postData('subcategory/edit_subcategory_data', body);

      Swal.fire({
        position: 'top-end',
        icon: result.status ? "success" : "error",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });

      setLoadingStatus(false); // Stop loading
      fetchAllSubcategory();
    }
  };

  const handleEditIcon = async () => {
    setLoadingStatus(true); // Start loading
    const formData = new FormData();
    formData.append('subcategoryicon', subcategoryIcon.bytes);
    formData.append('created_at', currentDate());
    formData.append('updated_at', currentDate());
    formData.append('categoryid', categoryId);
    formData.append('subcategoryid', subcategoryId);

    const result = await postData('subcategory/edit_subcategory_icon', formData);

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
    fetchAllSubcategory();
  };

  const handleDeleteSubcategory = async () => {
    Swal.fire({
      title: "Do you want to delete the subcategory?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await subcategoryDelete();

        Swal.fire({
          position: 'top-end',
          icon: "success",
          title: "Subcategory deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else if (result.isDenied) {
        Swal.fire("Subcategory not deleted", "", "info");
      }
    });
  };

  const subcategoryDelete = async () => {
    setLoadingStatus(true); // Start loading

    var body = { 'subcategoryid': subcategoryId };
    var result = await postData('subcategory/delete_subcategory', body);

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
    fetchAllSubcategory(); // Refresh the subcategory list
  };

  const showSubcategoryDialog = () => (
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
        {subcategoryForm()}
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
        <Button onClick={handleDeleteSubcategory} variant="contained">Delete</Button>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const subcategoryTable = () => (
    <div className={classes.root}>
      <div className={classes.displayBox}>
        <MaterialTable
          title="Subcategory List"
          columns={[
            { title: 'Subcategory Id', field: 'subcategoryid' },
            { title: 'Subcategory Name', field: 'subcategoryname' },
            { title: 'Category Id', field: 'categoryid' },
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
                  <img src={`${serverURL}/images/${rowData.subcategoryicon}`} style={{ width: 60, height: 60, borderRadius: 6 }} alt="Subcategory Icon" />
                </div>
              ),
            },
          ]}
          data={subcategoryList}
          options={{
            pageSize: 3,
            pageSizeOptions: [3, 5, 10, { value: subcategoryList.length, label: 'All' }],
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Subcategory',
              onClick: (event, rowData) => handleOpenDialog(rowData),
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div>
      {subcategoryTable()}
      {showSubcategoryDialog()}
    </div>
  );
}
