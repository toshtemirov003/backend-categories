import express from "express";
import { categories } from "./controllers/categories.controller.js";
import { subCategories } from "./controllers/subCategories.controller.js";
import { products } from "./controllers/products.controller.js";

const app = express();

app.use(express.json());

// GET-------------------------------------------------------------------------
app.get("/categories", categories.GET);
app.get("/subcategories", subCategories.GET);
app.get("/products", products.GET);

// BY-ID-------------------------------------------------------------------------
app.get("/categories/:id", categories.GETBYID);
app.get("/subcategories/:id", subCategories.GETBYID);
app.get("/products/:id", products.GETBYID);

// POST-------------------------------------------------------------------------
app.post("/categories", categories.POST);
app.post("/subcategories", subCategories.POST);
app.post("/products", products.POST);

// DELETE-------------------------------------------------------------------------
app.delete("/categories/:id", categories.DELETE);
app.delete("/subcategories/:id", subCategories.DELETE);
app.delete("/products/:id", products.DELETE);

// PUT-------------------------------------------------------------------------
app.put("/categories/:id", categories.PUT);
app.put("/subcategories/:id", subCategories.PUT);
app.put("/products/:id", products.PUT);

app.listen(2000, () => console.log("Port is working 2000* port"));
