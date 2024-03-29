const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    //creating product instance using mongoose.
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user._id,
    });
    await product.save();

    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    // Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  //finding the product
  const product = await Product.findById(prodId);
  product.title = updatedTitle;
  product.price = updatedPrice;
  product.imageUrl = updatedImageUrl;
  product.description = updatedDesc;

  //saving product
  const result = await product.save();

  console.log("UPDATED PRODUCT!");
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find() //method provided by mongoose to bring all data.
      // .select("title imageUrl -_id")
      .populate("userId");

    console.log(products);
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  await Product.findByIdAndRemove(prodId); //method provided by mongoose.

  console.log("DESTROYED PRODUCT");
  res.redirect("/admin/products");
};
