import { read, write } from "../utils/model.js";

let categories = {
  GET: (req, res) => {
    let categories = read("categories");
    let subCategory = read("subCategories");

    categories.map((category) => {
      category.subCategories = subCategory.filter(
        (subcategory) =>
          subcategory.category_id == category.category_id &&
          delete subcategory.category_id
      );
    });

    res.send(categories);
  },

  GETBYID: (req, res) => {
    let categories = read("categories");
    let subCategory = read("subCategories");
    let { id } = req.params;
    let category = categories.find((category) => category.category_id == id);

    categories.map((category) => {
      category.subCategories = subCategory.filter(
        (subcategory) =>
          subcategory.category_id == category.category_id &&
          delete subcategory.category_id
      );
    });

    res.send(category);
  },

  POST: (req, res) => {
    let category = read("categories");
    try {
      let { category_name } = req.body;
      if (!(category_name.trim() && category_name.length > 2)) {
        throw new Error("Category name invalid");
      }
      let newCategory = {
        category_id: category.at(-1)?.category_id + 1 || 1,
        category_name,
      };
      category.push(newCategory);
      write("categories", category);
      res.json({
        status: 201,
        message: "New category name added",
        data: newCategory,
      });
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  },
  DELETE: (req, res) => {
    let { id } = req.params;
    let categories = read("categories");
    let categoryIndex = categories.findIndex((item) => item.category_id == id);

    if (categoryIndex != -1) {
      let category = categories.splice(categoryIndex, 1);
      write("categories", categories);
      return res
        .status(200)
        .json({ status: 200, message: "Categories deleted", data: category });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "Categories not found" });
    }
  },

  PUT: (req, res) => {
    let { id } = req.params;
    let { category_name } = req.body;
    let categories = read("categories");
    let category = categories.find((item) => item.category_id == id);
    if (!category) {
      return res
        .status(404)
        .json({ status: 404, message: "Categories not found" });
    } else {
      category.category_name = category_name || category.category_name;
      write("categories", categories);
      return res.status(200).json({
        status: 200,
        message: "Categories updated",
        data: category,
      });
    }
  },
};

export { categories };
