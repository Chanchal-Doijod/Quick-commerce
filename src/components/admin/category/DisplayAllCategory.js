import { useState, useEffect } from 'react';
import MaterialTable from '@material-table/core';
import { getData, serverURL, createDate } from '../../../services/FetchNodeAdminServices';
import { useStyles } from './categorycss';
import { IconButton, Grid, TextField, Avatar, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import logo from "../../../assets/logo.png";
import cart from "../../../assets/cart.png";
import SaveIcon from '@mui/icons-material/Save';
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import { postData, currentDate } from '../../../services/FetchNodeAdminServices';

export default function DisplayAllCategory() {
  const classes = useStyles();
  const [categoryList, setCategoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [categoryIcon, setCategoryIcon] = useState({ bytes: '', fileName: cart });
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
    if (categoryName.length === 0) {
      handleErrorMessages('categoryName', 'Please input category name...');
      err = true;
    }
    return err;
  };

  function handleImage(e) {
    handleErrorMessages('categoryIcon', null);
    setCategoryIcon({
      bytes: e.target.files[0],
      fileName: URL.createObjectURL(e.target.files[0]),
    });
    setHideUploadButton(true);
  }

  const categoryForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.mainHeadingStyle}>
          <img src={logo} className={classes.imageStyle} alt="Logo" style={{ width: 70, height: 70 }} />
          <div className={classes.headingStyle}>Category Register</div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={categoryName}
          onFocus={() => handleErrorMessages('categoryName', null)}
          error={!!errorMessages.categoryName}
          helperText={errorMessages.categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          label="Category Name"
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
            {errorMessages.categoryIcon}
          </div>
        </div>
      </Grid>
      <Grid item xs={6} className={classes.center}>
        <Avatar src={categoryIcon.fileName} style={{ width: 70, height: 70 }} variant="rounded" />
      </Grid>
    </Grid>
  );

  const fetchAllCategory = async () => {
    const result = await getData('category/display_all_category');
    if (result.status) {
      setCategoryList(result.data);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCancelIcon = () => {
    setCategoryIcon({ bytes: '', fileName: oldImage });
    setHideUploadButton(false);
  };

  const handleOpenDialog = (rowData) => {
    setCategoryId(rowData.categoryid);
    setCategoryName(rowData.categoryname);
    setCategoryIcon({ bytes: '', fileName: `${serverURL}/images/${rowData.categoryicon}` });
    setOldImage(`${serverURL}/images/${rowData.categoryicon}`);
    setOpen(true);
  };

  const handleEditData = async () => {
    const err = validateData();
    if (!err) {
      setLoadingStatus(true); // Start loading

      const body = {
        categoryname: categoryName,
        created_at: currentDate(),
        updated_at: currentDate(),
        user_admin: 'Farzi',
        categoryid: categoryId
      };

      const result = await postData('category/edit_category_data', body);

      Swal.fire({
        position: 'top-end',
        icon: result.status ? "success" : "error",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });

      setLoadingStatus(false); // Stop loading
      fetchAllCategory();
    }
  };

  const handleEditIcon = async () => {
    setLoadingStatus(true); // Start loading
    const formData = new FormData();
    formData.append('categoryicon', categoryIcon.bytes);
    formData.append('created_at', currentDate());
    formData.append('updated_at', currentDate());
    formData.append('user_admin', 'Farzi');
    formData.append('categoryid', categoryId);

    const result = await postData('category/edit_category_icon', formData);

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
    fetchAllCategory();
  };

  const handleDeleteCategory = async () => {
    Swal.fire({
      title: "Do you want to delete the category?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Call categoryDelete() after user confirms
        await categoryDelete();
  
        Swal.fire({
          position: 'top-end',
          icon: "success",
          title: "Category deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else if (result.isDenied) {
        Swal.fire("Category not deleted", "", "info");
      }
    });
  };
  
  const categoryDelete = async () => {
    setLoadingStatus(true); // Start loading
  
    var body = { 'categoryid': categoryId };
    var result = await postData('category/delete_category', body);
  
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
    fetchAllCategory(); // Refresh the category list
  };
  
  const showCategoryDialog = () => (
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
        {categoryForm()}
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
        <Button onClick={handleDeleteCategory} variant="contained">Delete</Button>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const categoryTable = () => (
    <div className={classes.root}>
      <div className={classes.displayBox}>
        <MaterialTable
          title="Category List"
          columns={[
            { title: 'Category Id', field: 'categoryid' },
            { title: 'Category Name', field: 'categoryname' },
            {
              title: 'Created at',
              render: (rowData) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{createDate(rowData.created_at)}</div>
                  <div>{createDate(rowData.updated_at)}</div>
                </div>
              ),
            },
            { title: 'Admin', field: 'user_admin' },
            {
              title: 'Icon',
              render: (rowData) => (
                <div>
                  <img src={`${serverURL}/images/${rowData.categoryicon}`} style={{ width: 60, height: 60, borderRadius: 6 }} alt="Category Icon" />
                </div>
              ),
            },
          ]}
          data={categoryList}
          options={{
            pageSize: 3,
            pageSizeOptions: [3, 5, 10, { value: categoryList.length, label: 'All' }],
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Category',
              onClick: (event, rowData) => handleOpenDialog(rowData),
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div>
      {categoryTable()}
      {showCategoryDialog()}
    </div>
  );
}

