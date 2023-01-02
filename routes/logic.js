import express from "express";
import fs from "fs";
import readline from "readline";

const router = express.Router();

let dat = {
  records: [],
};

let format = {
  vusMin: 0,
  vusMax: 0,
  dataReceived: 0,
  dataSent: 0,
  iterationCount: 0,
  totalRequests: 0,
  data: [],
  checks: [],
  iteration_duration: {
    values: [],
    min: 0,
    max: 0,
    med: 0,
    avg: 0,
  },
};

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/", (req, res) => {
  const { data } = req.body;
  //console.log(data);
  let arr = data.split("\n");
  for (let i = 0; i < arr.length - 1; i++) {
    dat.records.push(JSON.parse(arr[i]));
  }
  console.log(dat);
  return res.status(200).send(format);
});

router.post("/check", (req, res) => {
  return res.status(200).send(format);
});

router.get("/check", (req, res) => {
  let { data } = req.body;
  return res.status(200).send(format);
});

export default router;
