const { app } = require("./app");
const { env } = require("./config/env");

app.listen(env.port, () => {
  console.log(`StockCerdas API berjalan di http://localhost:${env.port}`);
});
