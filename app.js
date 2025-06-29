// ... all the other imports
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const authRoute = require("./route/auth");
const adminRoute = require("./route/admin");
const companyRouter = require("./route/company");
const path = require("path");
const { graphqlHTTP } = require("express-graphql"); // ✅ CORRECT
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolver");
const fs = require("fs");

const app = express();

// Load env vars
require("dotenv").config();
const MongoURL = process.env.MONGODB_URL;
const port = process.env.PORT || 4000;

// Serve static files from "public" folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const imageDir = path.join(__dirname, "/public/img/user-profile");

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// Set disk storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/img/user-profile"));
  },
  filename: (req, file, cb) => {
    const timeStamp = new Date().toISOString().replace(/:/g, "-");
    const sanitizedName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timeStamp}-${sanitizedName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Multer middleware FIRST
app.use(multer({ storage: diskStorage, fileFilter }).single("photo"));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/company", companyRouter);

// Error handler (last)
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: "Failure",
    statusCode: error.statusCode || 500,
    message: error.message || "Internal Server Error",
  });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return {
        message: message,
        code: code,
        data: data,
      };
    },
  })
);

// DB connection
mongoose
  .connect(MongoURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on ${port}!`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
