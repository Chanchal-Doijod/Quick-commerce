import { useState, useEffect } from 'react';
import MaterialTable from '@material-table/core';
import { getData, serverURL, createDate } from '../../../services/FetchNodeAdminServices';
import { useStyles } from './Productcss';
import { IconButton, Grid, TextField, Avatar, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import logo from "../../../assets/logo.png";
import cart from "../../../assets/cart.png";
import SaveIcon from '@mui/icons-material/Save';
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import { postData, currentDate } from '../../../services/FetchNodeAdminServices';

export default function DisplayAllProduct() {
  const classes = useStyles();
  const [productList, setProductList] = useState([]); // Initialize as an empty array
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [productImage, setProductImage] = useState({ bytes: '', fileName: cart });
  const [errorMessages, setErrorMessages] = useState({});
  const [hideUploadButton, setHideUploadButton] = useState(false);
  const [oldImage, setOldImage] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false); // Initialize as false

  const handleErrorMessages = (label, message) => {
    setErrorMessages((prev) => ({ ...prev, [label]: message }));
  };

  const showSaveCancelButton = () => (
    <div>
      <Button onClick={handleEditImage}>Save</Button>
      <Button onClick={handleCancelImage}>Cancel</Button>
    </div>
  );

  const validateData = () => {
    let err = false;
    if (productName.length === 0) {
      handleErrorMessages('productName', 'Please input product name...');
      err = true;
    }
    if (categoryId.length === 0) {
      handleErrorMessages('categoryId', 'Please input category ID...');
      err = true;
    }
    if (brandId.length === 0) {
      handleErrorMessages('brandId', 'Please input brand ID...');
      err = true;
    }
    return err;
  };

  function handleImage(e) {
    handleErrorMessages('productImage', null);
    const file = e.target.files[0];
    if (file) {
      setProductImage({
        bytes: file,
        fileName: URL.createObjectURL(file),
      });
      setHideUploadButton(true);
    }
  }

  const productForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.mainHeadingStyle}>
          <img src={logo} className={classes.imageStyle} alt="Logo" style={{ width: 70, height: 70 }} />
          <div className={classes.headingStyle}>Product Register</div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={productName}
          onFocus={() => handleErrorMessages('productName', null)}
          error={!!errorMessages.productName}
          helperText={errorMessages.productName}
          onChange={(e) => setProductName(e.target.value)}
          label="Product Name"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={productDescription}
          onFocus={() => handleErrorMessages('productDescription', null)}
          error={!!errorMessages.productDescription}
          helperText={errorMessages.productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          label="Product Description"
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
          value={brandId}
          onFocus={() => handleErrorMessages('brandId', null)}
          error={!!errorMessages.brandId}
          helperText={errorMessages.brandId}
          onChange={(e) => setBrandId(e.target.value)}
          label="Brand Id"
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
            {errorMessages.productImage}
          </div>
        </div>
      </Grid>
      <Grid item xs={6} className={classes.center}>
        <Avatar src={productImage.fileName} style={{ width: 70, height: 70 }} variant="rounded" />
      </Grid>
    </Grid>
  );

  const fetchAllProduct = async () => {
    try {
      const result = await getData('product/display_all_product');
      if (result.status) {
        setProductList(result.data || []); // Fallback to empty array if result.data is undefined
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCancelImage = () => {
    setProductImage({ bytes: '', fileName: oldImage });
    setHideUploadButton(false);
  };

  const handleOpenDialog = (rowData) => {
    setProductId(rowData.productid);
    setProductName(rowData.productname);
    setProductDescription(rowData.productdescription);
    setCategoryId(rowData.categoryid);
    setBrandId(rowData.brandid);
    setProductImage({ bytes: '', fileName: `${serverURL}/images/${rowData.productimage}` });
    setOldImage(`${serverURL}/images/${rowData.productimage}`);
    setOpen(true);
  };

  const handleEditData = async () => {
    const err = validateData();
    if (!err) {
      setLoadingStatus(true);

      const body = {
        productname: productName,
        productdescription: productDescription,
        categoryid: categoryId,
        brandid: brandId,
        productid: productId,
        updated_at: currentDate()
      };

      const result = await postData('product/edit_product_data', body);

      Swal.fire({
        position: 'top-end',
        icon: result.status ? "success" : "error",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });

      setLoadingStatus(false);
      fetchAllProduct();
    }
  };

  const handleEditImage = async () => {
    setLoadingStatus(true);
    const formData = new FormData();
    formData.append('productimage', productImage.bytes);
    formData.append('productid', productId);
    formData.append('updated_at', currentDate());

    const result = await postData('product/edit_product_image', formData);

    Swal.fire({
      position: 'top-end',
      icon: result.status ? "success" : "error",
      title: result.message,
      showConfirmButton: false,
      timer: 2000,
      toast: true
    });

    setLoadingStatus(false);
    setHideUploadButton(false);
    fetchAllProduct();
  };

  const handleDeleteProduct = async () => {
    Swal.fire({
      title: "Do you want to delete the product?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await productDelete();

        Swal.fire({
          position: 'top-end',
          icon: "success",
          title: "Product deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else if (result.isDenied) {
        Swal.fire("Product not deleted", "", "info");
      }
    });
  };

  const productDelete = async () => {
    setLoadingStatus(true);

    const body = { 'productid': productId };
    const result = await postData('product/delete_product', body);

    Swal.fire({
      position: 'top-end',
      icon: result.status ? "success" : "error",
      title: result.message,
      showConfirmButton: false,
      timer: 2000,
      toast: true
    });

    setLoadingStatus(false);
    setHideUploadButton(false);
    fetchAllProduct();
  };

  const showProductDialog = () => (
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
        {productForm()}
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
        <Button onClick={handleDeleteProduct} variant="contained">Delete</Button>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const productTable = () => (
    <div className={classes.root}>
      <div className={classes.displayBox}>
        <MaterialTable
          title="Product List"
          columns={[
            { title: 'Product Id', field: 'productid' },
            { title: 'Product Name', field: 'productname' },
            { title: 'Description', field: 'productdescription' },
            { title: 'Category Id', field: 'categoryid' },
            { title: 'Brand Id', field: 'brandid' },
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
                  <img src={`${serverURL}/images/${rowData.productimage}`} style={{ width: 60, height: 60, borderRadius: 6 }} alt="Product Icon" />
                </div>
              ),
            },
          ]}
          data={productList} // Ensure productList is an array
          options={{
            pageSize: 3,
            pageSizeOptions: [3, 5, 10, { value: productList.length, label: 'All' }],
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Product',
              onClick: (event, rowData) => handleOpenDialog(rowData),
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div>
      {productTable()}
      {showProductDialog()}
    </div>
  );
}
