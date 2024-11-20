import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getSingleProduct, getlatestProducts, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";


const app=express.Router();

//To create new product /api/v1/product/new
app.post("/new",adminOnly,singleUpload,newProduct)

//to get all products with filter only /api/v1/product/all
app.get("/all",getAllProducts)

//To ge last 10 product /api/v1/product/latest
app.get("/latest",getlatestProducts)


//To get all unique categories /api/v1/product/categories
app.get("/categories",getAllCategories)


//To get all product /api/v1/product/admin-products
app.get("/admin-products",adminOnly,getAdminProducts)


//to get update ,delete product
app.route("/:id").get(getSingleProduct).put(adminOnly,singleUpload,updateProduct).delete(adminOnly,deleteProduct)




export default app;