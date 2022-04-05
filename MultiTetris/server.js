const express = require("express");
const { path } = require("express/lib/application");
const app = express();
const port = 3000;

app.use(express.static('public'));

// app.get('/', function(req, res) {
//   res.sendFile('./index.html' , { root : __dirname});
// });

app.listen(port, (req, res) => {
  console.log(`${port} is running`);
});