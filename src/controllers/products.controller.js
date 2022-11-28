import { read, write } from "../utils/model.js";

let products = {
  GET: (req, res) => {
    let products = read("products");
    let categories = read("categories");
    let subCategories = read("subCategories");

    let { category_id, sub_category_id } = req.query;
    // console.log(category_id, sub_category_id);
    let filteredCategory = categories.filter(
      (item) => item.category_id == category_id
    );
    let filteredSubCategory = subCategories.filter(
      (item) => item.sub_category_id == sub_category_id
    );
    if (filteredCategory) {
      return res.send(filteredCategory);
    } else {
      return res.send(filteredSubCategory);
    }
  },

  GETBYID: (req, res) => {
    let products = read("products");
    let { id } = req.params;
    let product = products.find((pro) => pro.product_id == id);
    res.send(product);
  },

  POST: (req, res) => {
    let products = read("products");
    try {
      let { sub_category_id, product_name, model, color, price } = req.body;
      console.log(sub_category_id, product_name, model, color, price);
      if (
        !(
          product_name.trim() &&
          model.trim() &&
          color.trim() &&
          price.trim() &&
          product_name.length > 2 &&
          model.length >= 2 &&
          color.length >= 2 &&
          price.length >= 2
        )
      ) {
        throw new Error("Products invalid");
      }
      if (typeof sub_category_id != "number") {
        throw new Error("sub_category_id invalid");
      }

      let newProducts = {
        product_id: products.at(-1)?.product_id + 1 || 1,
        sub_category_id,
        product_name,
        model,
        color,
        price,
      };
      products.push(newProducts);
      write("products", products);
      res.json({
        status: 201,
        message: "New product added",
        data: newProducts,
      });
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  },

  DELETE: (req, res) => {
    let { id } = req.params;
    let products = read("products");
    let productIndex = products.findIndex((item) => item.product_id == id);

    if (productIndex != -1) {
      let productSplice = products.splice(productIndex, 1);
      write("products", products);
      return res.status(200).json({
        status: 200,
        message: "Product deleted",
        data: productSplice,
      });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }
  },

  PUT: (req, res) => {
    let products = read("products");
    let { id } = req.params;
    let { sub_category_id, product_name, model, color, price } = req.body;
    let productFind = products.find((item) => item.product_id == id);

    if (!productFind) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    } else {
      productFind.sub_category_id =
        sub_category_id || productFind.sub_category_id;
      productFind.product_name = product_name || productFind.product_name;
      productFind.model = model || productFind.model;
      productFind.color = color || productFind.color;
      productFind.price = price || productFind.price;
      write("products", products);
      return res
        .status(200)
        .json({ status: 200, message: "Product updated", data: productFind });
    }
  },
};

export { products };
