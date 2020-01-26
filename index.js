//express setup
const ex = require("express");
const app = ex();

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//spawnSync is used to spawn a child process synchronously, meaning that it stops everything until it finishes
//spawn is like spawnSync but asynchronous
const { spawn, spawnSync } = require("child_process");

watchedStocks = [];

//Initial data fetch. Synchronous data fetch
let { stdout, stderr } = spawnSync("python", [
  "./python/test.py",
  "pythonProgram"
]);
watchedStocks = stdout.toString();

//next data fetch. Asynchronous data fetch
const update = () => {
  console.log("update");
  pyProgram = spawn("python", ["./python/test.py", "pythonProgram"]);
  pyProgram.stdout.on("data", stdout => {
    watchedStocks = stdout.toString();
  });
  pyProgram.stderr.on("data", stderr => {
    console.log(stderr.toString());
    watchedStocks = [];
  });
};

//Update every 10 seconds. Long Polling
setInterval(() => {
  update();
}, 10000);

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/python", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(watchedStocks);
});

//Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app listening to port ${port}`);
});
