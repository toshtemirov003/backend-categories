import { read, write } from "../utils/model.js";

let subCategories = {
  GET: (req, res) => {
    let subCategory = read("subCategories");
    let products = read("products");

    subCategory.map((subcategory) => {
      delete subcategory.category_id;
      subcategory.products = products.filter(
        (item) =>
          item.sub_category_id == subcategory.sub_category_id &&
          delete item.sub_category_id
      );
    });

    res.send(subCategory);
  },

  GETBYID: (req, res) => {
    let subCategories = read("subCategories");
    let products = read("products");
    let { id } = req.params;

    let subCategory = subCategories.find(
      (subcategory) => subcategory.sub_category_id == id
    );

    subCategories.map((subcategory) => {
      delete subcategory.category_id;
      subcategory.products = products.filter(
        (item) =>
          item.sub_category_id == subcategory.sub_category_id &&
          delete item.sub_category_id
      );
    });

    res.send(subCategory);
  },

  POST: (req, res) => {
    let subcategory = read("subCategories");

    try {
      let { category_id, sub_category_name } = req.body;
      if (!(sub_category_name.trim() && sub_category_name.length > 2)) {
        throw new Error("subCategories name invalid");
      }
      if (typeof category_id != "number") {
        throw new Error("categories_id invalid");
      }
      let newSubCategory = {
        sub_category_id: subcategory.at(-1)?.sub_category_id + 1 || 1,
        category_id,
        sub_category_name,
      };
      subcategory.push(newSubCategory);
      write("subCategories", subcategory);
      res.json({
        status: 201,
        message: "New subCategory name added",
        data: newSubCategory,
      });
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  },

  DELETE: (req, res) => {
    let { id } = req.params;
    let subcategories = read("subcategories");
    let subcategoryIndex = subcategories.findIndex(
      (item) => item.sub_category_id == id
    );

    if (subcategoryIndex != -1) {
      let subcategorySplice = subcategories.splice(subcategoryIndex, 1);
      write("subCategories", subcategories);
      return res.status(200).json({
        status: 200,
        message: "Subcategories deleted",
        data: subcategorySplice,
      });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "Subcategories not found" });
    }
  },

  PUT: (req, res) => {
    let { id } = req.params;
    let { category_id, sub_category_name } = req.body;
    let subcategories = read("subCategories");
    let subcategoryFind = subcategories.find(
      (item) => item.sub_category_id == id
    );

    if (!subcategoryFind) {
      return res
        .status(404)
        .json({ status: 404, message: "subcategories not found" });
    } else {
      subcategoryFind.category_id = category_id || subcategoryFind.category_id;
      subcategoryFind.sub_category_name =
        sub_category_name || subcategoryFind.sub_category_name;
      write("subcategories", subcategories);
      return res.status(200).json({
        status: 200,
        message: "Subcategories updated",
        data: subcategoryFind,
      });
    }
  },
};

export { subCategories };
