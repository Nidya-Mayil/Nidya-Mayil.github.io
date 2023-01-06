import express from "express";
const router = express.Router();

let data = {
  records: [],
};

let set = new Set([]);
let set_checks = new Set([]);

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

function findAll(array) {
  let lower, upper, weight;
  const med = (arr) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };
  function percentile(arr, p) {
    if (arr.length === 0) return 0;
    if (typeof p !== "number") throw new TypeError("p must be a number");
    if (p <= 0) return arr[0];
    if (p >= 1) return arr[arr.length - 1];

    arr.sort(function (a, b) {
      return a - b;
    });
    var index = (arr.length - 1) * p;
    (lower = Math.floor(index)), (upper = lower + 1), (weight = index % 1);

    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
  }
  const average = array.reduce((a, b) => a + b, 0) / array.length;
  const maximum = Math.max(...array);
  const minimum = Math.min(...array);
  const median = med(array);
  const percentile90 = percentile(array, 0.9);
  const percentile95 = percentile(array, 0.95);
  return { average, maximum, minimum, median, percentile90, percentile95 };
}

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/", (req, res) => {
  const { data } = req.body;
  //console.log(data);
  let arr = data.split("\n");
  for (let i = 0; i < arr.length - 1; i++) {
    data.records.push(JSON.parse(arr[i]));
  }
  console.log(data);
  return res.status(200).send(format);
});

router.post("/check", (req, res) => {
  return res.status(200).send(format);
});

router.post("/report", async (req, res) => {
  var total_request = 0,
    data_sent = 0,
    data_received = 0,
    vus_min = 1,
    vus_max = 1,
    iterations = 0;
  const { request_data } = req.body;
  console.log("222");
  console.log(request_data);

  let arr = request_data.split("\n");
  let promise = new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length - 1; i++) {
      data.records.push(JSON.parse(arr[i]));
      if (data.records[i].type == "Point") {
        if (data.records[i].metric == "http_reqs") {
          if (!set.has(data.records[i].data.tags.url)) {
            set.add(data.records[i].data.tags.url);
            let url_specific = {
              url: data.records[i].data.tags.url,
              conditions: {
                requests: 0,
                http_req_duration: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                  perc_90: 0,
                  perc_95: 0,
                },
                http_req_waiting: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                  perc_90: 0,
                  perc_95: 0,
                },
                http_req_connecting: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                  perc_90: 0,
                  perc_95: 0,
                },
                http_req_tls_handshaking: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                },
                http_req_sending: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                  perc_90: 0,
                  perc_95: 0,
                },
                http_req_receiving: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                  perc_90: 0,
                  perc_95: 0,
                },
                http_req_blocked: {
                  values: [],
                  min: 0,
                  max: 0,
                  med: 0,
                  avg: 0,
                  perc_90: 0,
                  perc_95: 0,
                },
              },
            };
            format.data.push(url_specific);
          }
          for (let j = 0; j < format.data.length; j++) {
            if (format.data[j].url == data.records[i].data.tags.url) {
              format.data[j].conditions.requests++;
              total_request++;
            }
          }
        } else if (data.records[i].metric == "http_req_duration") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_duration.values.push(value);
            }
          }
        } else if (data.records[i].metric == "http_req_waiting") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_waiting.values.push(value);
            }
          }
        } else if (data.records[i].metric == "http_req_connecting") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_connecting.values.push(value);
            }
          }
        } else if (data.records[i].metric == "http_req_tls_handshaking") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_tls_handshaking.values.push(
                value
              );
            }
          }
        } else if (data.records[i].metric == "http_req_sending") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_sending.values.push(value);
            }
          }
        } else if (data.records[i].metric == "http_req_receiving") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_receiving.values.push(value);
            }
          }
        } else if (data.records[i].metric == "http_req_blocked") {
          const value = data.records[i].data.value;
          const url = data.records[i].data.tags.url;
          for (let k = 0; k < format.data.length; k++) {
            if (format.data[k].url == url) {
              format.data[k].conditions.http_req_blocked.values.push(value);
            }
          }
        } else if (data.records[i].metric == "data_received") {
          data_received += data.records[i].data.value;
        } else if (data.records[i].metric == "data_sent") {
          data_sent += data.records[i].data.value;
        } else if (data.records[i].metric == "vus") {
          vus_min =
            data.records[i].data.value < vus_min
              ? data.records[i].data.value
              : vus_min;
        } else if (data.records[i].metric == "vus_max") {
          vus_max =
            data.records[i].data.value > vus_max
              ? data.records[i].data.value
              : vus_max;
        } else if (data.records[i].metric == "iterations") {
          iterations += data.records[i].data.value;
        } else if (data.records[i].metric == "iteration_duration") {
          const value = data.records[i].data.value;
          format.iteration_duration.values.push(value);
        } else if (data.records[i].metric == "checks") {
          if (!set_checks.has(data.records[i].data.tags.check)) {
            set_checks.add(data.records[i].data.tags.check);
            let check_specific = {
              name: data.records[i].data.tags.check,
              passed: 0,
              failed: 0,
            };
            format.checks.push(check_specific);
          }
          for (let j = 0; j < format.checks.length; j++) {
            if (format.checks[j].name == data.records[i].data.tags.check) {
              data.records[i].data.value == 1
                ? format.checks[j].passed++
                : format.checks[j].failed++;
            }
          }
        }
      }
    }
    setTimeout(() => resolve(format), 1000);
  });
  console.log("after", data);
  let result = await promise;
  let metrics = [
    "http_req_duration",
    "http_req_receiving",
    "http_req_sending",
    "http_req_blocked",
    "http_req_connecting",
    "http_req_tls_handshaking",
    "http_req_waiting",
  ];
  for (let a = 0; a < format.data.length; a++) {
    for (let b = 0; b < metrics.length; b++) {
      const { average, maximum, minimum, median, percentile90, percentile95 } =
        findAll(format.data[a].conditions[metrics[b]].values);
      format.data[a].conditions[metrics[b]].min = minimum;
      format.data[a].conditions[metrics[b]].max = maximum;
      format.data[a].conditions[metrics[b]].med = median;
      format.data[a].conditions[metrics[b]].avg = average;
      format.data[a].conditions[metrics[b]].perc_90 = percentile90;
      format.data[a].conditions[metrics[b]].perc_95 = percentile95;
    }
  }
  for (let a = 0; a < format.iteration_duration.values.length; a++) {
    const { average, maximum, minimum, median, percentile90, percentile95 } =
      findAll(format.iteration_duration.values);
    format.iteration_duration.min = minimum;
    format.iteration_duration.max = maximum;
    format.iteration_duration.med = median;
    format.iteration_duration.avg = average;
    format.iteration_duration.perc_90 = percentile90;
    format.iteration_duration.perc_95 = percentile95;
  }

  (format.vusMin = vus_min), (format.vusMax = vus_max);
  format.dataReceived = data_received;
  format.dataSent = data_sent;
  format.iterationCount = iterations;
  format.totalRequests = total_request;
  return res.status(200).send(result);
});

router.get("/check", (req, res) => {
  let { data } = req.body;
  return res.status(200).send(format);
});

export default router;
