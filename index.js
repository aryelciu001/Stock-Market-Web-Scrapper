const ex = require("express");
const app = ex();

//spawnSync is used to spawn a child process synchronously, meaning that it stops everything until it finishes
//spawn is like spawnSync but asynchronous
const { spawn, spawnSync } = require("child_process");

watchedStocks = [];

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

let { stdout, stderr } = spawnSync("python", [
  "./python/test.py",
  "pythonProgram"
]);
watchedStocks = stdout.toString();

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

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app listening to port ${port}`);
});

//   exec("python python/test.py", (err, stdout, stderr) => {
//     console.log("python out here ", stdout);
//   });
