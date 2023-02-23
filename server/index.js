const app = require("./app");
const port = process.env.PORT || 3000;
const { seed, db } = require("./db/index");

app.listen(port, async () => {
  await seed();
  console.log(`listening on port ${port}`);
});
