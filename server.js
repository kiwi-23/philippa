var data_arr;
var data = {};

console.log("hello! server is starting :)");

var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var server = app.listen(3000, listening);
function listening() {
  console.log("listening~");
}
app.use(express.static("website"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var fs = require("fs");
data_arr = fs.readFileSync("data/responses.json");
data_arr = JSON.parse(data_arr);

for (var i = 0; i < data_arr.length; i++) {
  var response = data_arr[i];
  var name = response.name;
  name = name.trim();
  var space = name.indexOf(' ');
  if (space != -1)
    name = name.substring(0, space);
  name = name.charAt(0).toUpperCase() + name.slice(1);
  if(!data[name]) {
    data[name] = response;
    data[name].name = name;
  }
  else {
    var count = 1;
    var name2 = name;
    while(data[name2]) {
      name2 = name + count++;
    }
    data[name2] = response;
    data[name2].name = name2;
  }
}

var arr = Object.keys(data);
for (var i = 0; i < arr.length; i++) {
  var name = arr[i];
  if (data[name].case1 == "Steer the trolley & kill 1 worker")
    data[name].case1 = 5;
  else
    data[name].case1 = 1;
  if (data[name].case2 == "Use the healthy patient's organs to save 5 lives")
    data[name].case2 = 5;
  else
    data[name].case2 = 1;
  if (data[name].case3 == "Execute the innocent person & save 5 lives")
    data[name].case3 = 5;
  else
    data[name].case3 = 1;
  if (data[name].case4 == "Give the dose to the initial patient")
    data[name].case4 = 1;
  else
    data[name].case4 = 5;
  if (data[name].case5 == "Manufacture the gas & let the 1 patient die")
    data[name].case5 = 5;
  else
    data[name].case5 = 1;
}

var list_data = JSON.stringify(data, null, 2);
fs.writeFile("website/data-list.json", list_data, function(err) {
  console.log("added list data");
});

var data2 = {};
data2["nodes"] = [
  {"id": "Case 1", "group": "#000000"},
  {"id": "Case 2", "group": "#000000"},
  {"id": "Case 3", "group": "#000000"},
  {"id": "Case 4", "group": "#000000"},
  {"id": "Case 5", "group": "#000000"}
];
data2["links"] = [];

for (var i = 0; i < arr.length; i++) {
  var label = {};
  var name = arr[i];
  label.id = data[name].name;
  label.group = "#686868";
  data2.nodes.push(label);

  var link1 = {};
  link1.source = data[name].name;
  link1.target = "Case 1";
  if (data[name].case1 == 5)
    link1.value = "#D1D1D1";
  else
    link1.value = "#EDEDED";
  data2.links.push(link1);

  var link2 = {};
  link2.source = data[name].name;
  link2.target = "Case 2";
  if (data[name].case2 == 5)
    link2.value = "#D1D1D1";
  else
    link2.value = "#EDEDED";
  data2.links.push(link2);

  var link3 = {};
  link3.source = data[name].name;
  link3.target = "Case 3";
  if (data[name].case3 == 5)
    link3.value = "#D1D1D1";
  else
    link3.value = "#EDEDED";
  data2.links.push(link3);

  var link4 = {};
  link4.source = data[name].name;
  link4.target = "Case 4";
  if (data[name].case4 == 5)
    link4.value = "#D1D1D1";
  else
    link4.value = "#EDEDED";
  data2.links.push(link4);

  var link5 = {};
  link5.source = data[name].name;
  link5.target = "Case 5";
  if (data[name].case5 == 5)
    link5.value = "#D1D1D1";
  else
    link5.value = "#EDEDED";
  data2.links.push(link5);
}

var visual_data = JSON.stringify(data2, null, 2);
fs.writeFile("website/data-visual.json", visual_data, function(err) {
  console.log("added visual data");
});

for (var i = 0; i < arr.length; i++) {
  var name = arr[i];
  delete data[name].timestamp;
  if (data[name].case1 == 5)
    data[name].case1 = [1, 0];
  else
    data[name].case1 = [0, 1];
  if (data[name].case2 == 5)
    data[name].case2 = [1, 0];
  else
    data[name].case2 = [0, 1];
  if (data[name].case3 == 5)
    data[name].case3 = [1, 0];
  else
    data[name].case3 = [0, 1];
  if (data[name].case4 == 5)
    data[name].case4 = [0, 1];
  else
    data[name].case4 = [1, 0];
  if (data[name].case5 == 5)
    data[name].case5 = [1, 0];
  else
    data[name].case5 = [0, 1];
}

var train_data = JSON.stringify(data, null, 2);
fs.writeFile("website/data-train.json", train_data, function(err) {
  console.log("added train data");
});





// app.get("/add/:person", function(request, response) {
//   var reply = {};
//   if (data[request.params.person]) {
//     reply.person = request.params.person;
//     reply.message = "Person exists in database";
//   }
//   else {
//     data[request.params.person] = {
//       "intrinsic": {
//         "rational": {
//           "OB": 1.0,
//           "IM": 0.0
//         },
//         "sentient": {
//           "OB": 1.0,
//           "IM": 0.0
//         },
//         "social-worth": {
//           "OB": 1.0,
//           "IM": 0.0
//         }
//       },
//       "instrumental": {
//         "number": {
//           "OB": 0.1,
//           "IM": 0.0
//         },
//         "desire": {
//           "OB": 1.0,
//           "IM": 0.0
//         },
//         "intent": {
//           "OB": 1.0,
//           "IM": 0.0
//         },
//         "duty": {
//           "OB": 1.0,
//           "IM": 0.0
//         }
//       }
//     };
//     reply.person = request.params.person;
//     reply.message = "Person added to database";
//     var entry = JSON.stringify(data, null, 2);
//     fs.writeFile("website/data.json", entry, function(err) {
//       console.log("added data");
//     });
//   }
//   response.send(reply);
// });

// app.post("/analyse", function(request, response) {
//   console.log(request.body);
//   var reply = {};
//   reply.message = "Thank you";
//   response.send(reply);
// });
