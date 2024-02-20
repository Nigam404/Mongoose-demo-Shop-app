const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65d4d9dc271fc079d0e3fa55")
    .then((user) => {
      req.user = user;
      // console.log("User is: ", user.name);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://nigam:nigam404@cluster0.99k3bnv.mongodb.net/shop-mongoose?retryWrites=true"
  )
  .then(async (result) => {
    const user = await User.findOne();
    //if we dont have any user we create once else we will not create user.
    if (!user) {
      const user = new User({
        name: "Nigam",
        email: "nkc@gmail.com",
        cart: { items: [] },
      });
      user.save();
    }
    app.listen(3000);
    console.log("App is listening...");
  })
  .catch((err) => {
    console.log(err);
  });
