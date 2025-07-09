if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config.env" });
  console.log(process.env.PORT);
}

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
