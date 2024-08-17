import Category from "./components/admin/category/Category";
import DisplayAllCategory from "./components/admin/category/DisplayAllCategory";
import Subcategory from "./components/admin/Subcategory/Subcategory";
import DisplayAllSubCategory from "./components/admin/Subcategory/DisplayAllSubcategory";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Brand from "./components/admin/Brand/Brand";
import DisplayAllBrand from "./components/admin/Brand/DisplayAllBrand";
import Product from "./components/admin/Product/Product";
import DisplayAllProduct from "./components/admin/Product/DisplayAllProduct";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Category/>} path="/category" />
          <Route element={<DisplayAllCategory/>} path="/displayallcategory" />
          <Route element={<Subcategory/>} path="/subcategory" />
          <Route element={<DisplayAllSubCategory/>} path="/displayallsubcategory" />
          <Route element={<Brand/>} path="/brand" />
          <Route element={<DisplayAllBrand/>} path="/displayallbrand" />
          <Route element={<Product/>} path="/product" />
          <Route element={<DisplayAllProduct/>} path="/displayallproduct" />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
