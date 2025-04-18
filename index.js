const express = require("express");
var logger = require('morgan');
var path = require('path');
var moment = require('moment-timezone');
require("dotenv").config();
const { exec } = require('child_process');
const fs = require('node:fs');
const app = express();
const port = 4002;

// Use morgan middleware to log HTTP requests to the console
logger.token('date', (req, res, tz) => {
  return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
})
logger.format('logformat', ':date[Asia/Bangkok], :remote-addr, :method, :url, :res[content-length], :response-time ms');

app.use(logger("logformat"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/", function (req, res) {
  res.status(404).send('404 Not found : Your request is not available.');
});

app.post("/", function (req, res) {
  res.status(404).send('404 Not found : Your request is not available.');
});

app.post("/api/anc", function (req, res) {
  let resData = {
    code : 1,
    msg : "default",
    data : null
  }
  //console.log(req.body);
  if(req.body.api_key != "1234567890") return res.json(resData);
  const log_data = `### API :: ANC :: play filename = ${req.body.filename} to number = ${req.body.number} for ${req.body.duration} seconds.`;
  console.log(log_data);
  // Write start log
  let _date = moment().tz("Asia/Bangkok").format('YYYY-MM-DD');
  let _datetime = moment().tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss');
  let _log_filename = 'logs/anc_'+_date+'.log';
  fs.writeFile(_log_filename, _datetime+ ": START: " + log_data + "\r\n", { flag: 'a+' }, err => {});
  exec(`./sip_play.sh ${req.body.number} ${req.body.duration} ${req.body.filename} ${req.body.sip_username} ${req.body.sip_password} `+
       `${req.body.sip_host} ${req.body.sip_port}`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      resData.msg = "Error play file";
    } else {
      // the *entire* stdout and stderr (buffered)
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
      resData.msg = 'OK';
      resData.code = 0;
      _datetime = moment().tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss');
      fs.writeFile(_log_filename, _datetime+ ": END: " + log_data + "\r\n", { flag: 'a+' }, err => {});
    }
    res.json(resData);
  });
  //res.json(resData);
});

app.post("/api/anc/fileplay_stop", function (req, res) {
  let resData = {
    code : 1,
    msg : "default",
    data : null
  }
 exec(`/usr/bin/killall vlc`, (err,stdout) => {});
 exec(`/usr/bin/killall baresip`, (err, stdout) => {
   if (err) {
      resData.msg = "Error stop play file";
   } else {
     resData.code = 0;
     resData.msg = "Ok";
   }
   res.json(resData);
 })
});

app.post("/api/anc/radio_play", function (req, res) {
  let resData = {
    code : 1,
    msg : "default",
    data : null
  }
  //console.log(req.body);
  if(req.body.api_key != "1234567890") return res.json(resData);
  const log_data = `### API: ANC: Radio play to number = ${req.body.number} at ${req.body.url}`;
  console.log(log_data);
  let _date = moment().tz("Asia/Bangkok").format('YYYY-MM-DD');
  let _datetime = moment().tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss');
  let _log_filename = 'logs/anc_'+_date+'.log';
  fs.writeFile(_log_filename, _datetime+ ": START: " + log_data + "\r\n", { flag: 'a+' }, err => {});
  exec(`./radio_sip_play.sh ${req.body.number} ${req.body.period} ${req.body.url} ${req.body.sip_username} `+
        `${req.body.sip_password} ${req.body.sip_host} ${req.body.sip_port}`, (err, stdout, stderr) => {
    if (err) {
      resData.msg = "Error play radio";
    } else {
      resData.msg = 'OK';
      resData.code = 0;
      _datetime = moment().tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss');
      fs.writeFile(_log_filename, _datetime+ ": END: " + log_data + "\r\n", { flag: 'a+' }, err => {});
    }
  });
  res.json(resData);
});
app.post("/api/anc/radio_stop", function (req, res) {
  let resData = {
    code : 1,
    msg : "default",
    data : null
  }
 exec(`/usr/bin/killall vlc`, (err,stdout) => {});
 exec(`/usr/bin/killall baresip`, (err, stdout) => {
   if (err) {
      resData.msg = "Error stop radio";
   } else {
     resData.code = 0;
     resData.msg = "Ok";
   }
   res.json(resData);
 })
});

app.listen(port, function () {
  console.log(`Running in env :  ${process.env.NODE_ENV}`);
  console.log(`App open on port ${port}!`);
});
