var list_data, train_data;

function preload() {
  list_data = loadJSON("https://raw.githubusercontent.com/kiwi-23/philippa/master/data/data-list.json");
  train_data = loadJSON("https://raw.githubusercontent.com/kiwi-23/philippa/master/dara/data-train.json");
}

var net;
var train = [];

var inputs = {
  "desire": {
    "crucial": 1,
    "corrupt": 0
  },
  "intent": {
    "oblique": 1,
    "direct": 0
  },
  "duty": {
    "negative": 1,
    "positive": 0
  }
};

function setup() {
  noCanvas();
  var arr = Object.keys(list_data);
  for (var i = 0; i < arr.length; i++) {
    var name = arr[i];
    var row = createElement("tr");
    row.parent("data_table");
    var timestamp = createElement("td", list_data[name].timestamp);
    timestamp.parent(row);
    var respondent = createElement("td", list_data[name].name);
    respondent.parent(row);
    var case1 = createElement("td", list_data[name].case1);
    case1.parent(row);
    var case2 = createElement("td", list_data[name].case2);
    case2.parent(row);
    var case3 = createElement("td", list_data[name].case3);
    case3.parent(row);
    var case4 = createElement("td", list_data[name].case4);
    case4.parent(row);
    var case5 = createElement("td", list_data[name].case5);
    case5.parent(row);
  }

  $("#user_count").text(arr.length);
  $("#data_count").text(arr.length * 5);

  net = new Network(6, 30, 2);

  var arr = Object.keys(train_data);
  for (var i = 0; i < arr.length; i++) {
    var name = arr[i];
    var dataset = {};
    dataset.inputs = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
    dataset.output = train_data[name].case1;
    train.push(dataset);
    var dataset = {};
    dataset.inputs = [inputs.desire.crucial, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
    dataset.output = train_data[name].case2;
    train.push(dataset);
    var dataset = {};
    dataset.inputs = [inputs.desire.corrupt, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
    dataset.output = train_data[name].case3;
    train.push(dataset);
    var dataset = {};
    dataset.inputs = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive];
    dataset.output = train_data[name].case4;
    train.push(dataset);
    var dataset = {};
    dataset.inputs = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
    dataset.output = train_data[name].case5;
    train.push(dataset);
  }
  for (var c = 0; c < 500; c++) {
    for (var i = 0; i < train.length; i++) {
      //var set = random(train);
      var set = train[i];
      net.train(set.inputs, set.output);
    }
  }
  //[1, 1, 1, 1, 1, 1]
  var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  console.log("You are a trolley driver, and you notice 5 construction workers working towards the end of the track. Your brakes are faulty. However, you notice a side-track where there is only 1 worker. Which is the more ethical course of action?");
  //console.log("case 1:");
  var value = net.predict(test);
  var kill1 = floor(value[0] * 100);
  var kill5 = floor(value[1] * 100);
  console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
  //[1, 1, 0, 1, 1, 1]
  var test = [inputs.desire.crucial, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  console.log("You are a transplant surgeon, you have 5 patients in critical need of an organ each. One needs a liver, two need a kidney, one a heart, another a lung. There are no donors. But there is a healthy patient in the next room. Which is the more ethical course of action?");
  // console.log("case 2:");
  var value = net.predict(test);
  var kill1 = floor(value[0] * 100);
  var kill5 = floor(value[1] * 100);
  console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");

  // [0, 0, 0, 1, 1, 1]
  var test = [inputs.desire.corrupt, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  console.log("You are a judge, and 5 activists are threatening to kill themselves if the culprit of a certain crime is not found. The real culprit remains unknown. You can prevent the bloodshed by framing an innocent individual. Which is the more ethical course of action?");
  // console.log("case 3:");
  var value = net.predict(test);
  var kill1 = floor(value[0] * 100);
  var kill5 = floor(value[1] * 100);
  console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");

  // [1, 1, 0, 1, 1, 0]
  var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive];
  console.log("You are a doctor, and in order to save a patient, you need to give him a massive dose of a drug that's in short supply. Later on, 5 other patients arrive, each of whom could be saved with 1/5th of that dose. Which is the more ethical option?");
  // console.log("case 4:");
  var value = net.predict(test);
  var kill1 = floor(value[0] * 100);
  var kill5 = floor(value[1] * 100);
  console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");

  // [1, 1, 0, 1, 1, 1]
  var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  console.log("You are a doctor, and there are 5 patients whose lives could be saved by the manufacture of a certain gas. But this leads to the release of lethal fumes into the room of another patient who, for some reason, you cannot move elsewhere. Which is the more ethical option?");
  // console.log("case 5:");
  var value = net.predict(test);
  var kill1 = floor(value[0] * 100);
  var kill5 = floor(value[1] * 100);
  console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
}

function draw () {

}
























// function setup() {
//   var config = {
//     apiKey: "AIzaSyADEZcHaGfDU7J0l-PupJfD9tSb2KylUOw",
//     authDomain: "philippa-kiwi.firebaseapp.com",
//     databaseURL: "https://philippa-kiwi.firebaseio.com",
//     projectId: "philippa-kiwi",
//     storageBucket: "philippa-kiwi.appspot.com",
//     messagingSenderId: "0076063665002"
//   };
//   firebase.initializeApp(config);
//
//   var database = firebase.database();
//   var ref = database.ref("users");
//   ref.push(data);
//
//   ref.on("value", function(data) {
//     console.log(data.val());
//   }, function(err) {
//     onsole.log("Error!");
//     console.log(err);
//   });
//
//   loadJSON("/all", function(data) {
//     console.log(data);
//   });
//   var data = {
//     data: "yoongo the mango"
//   };
//   httpPost("analyse/", data, "json", function(result) {
//     console.log(result);
//   }, function (err) {
//     console.log(err);
//   });
// }
