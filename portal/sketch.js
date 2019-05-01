var list_data = {};
var train_data = {};
var visual_data = {};
var simulation;

function preload() {
  //list_data = loadJSON("https://raw.githubusercontent.com/kiwi-23/philippa/master/data/data-list.json");
  //train_data = loadJSON("https://raw.githubusercontent.com/kiwi-23/philippa/master/data/data-train.json");
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
  //spreadsheet id = 118EpNxeOf2Ly7ObSThWU76uCJbNlj7zfEs1Ng5sJFvI
  $.getJSON("https://spreadsheets.google.com/feeds/list/118EpNxeOf2Ly7ObSThWU76uCJbNlj7zfEs1Ng5sJFvI/1/public/values?alt=json", function(data) {
    for (var i = 0; i < data.feed.entry.length; i++) {
      var name = data.feed.entry[i]["gsx$firstname"]["$t"];
      name = name.trim();
      var space = name.indexOf(' ');
      if (space != -1)
        name = name.substring(0, space);
      name = name.toLowerCase();
      name = name.charAt(0).toUpperCase() + name.slice(1);
      var user = {};
      user.timestamp = data.feed.entry[i]["gsx$timestamp"]["$t"];
      user.name = name;
      var ques = Object.keys(data.feed.entry[i]);
      var ques1 = ques[8];
      var answer = data.feed.entry[i][ques1]["$t"];
      if (answer == "Steer the trolley & kill 1 worker")
        user.case1 = 5;
      else
        user.case1 = 1;
      var ques2 = ques[9];
      var answer = data.feed.entry[i][ques2]["$t"];
      if (answer == "Use the healthy patient's organs to save 5 lives")
        user.case2 = 5;
      else
        user.case2 = 1;
      var ques3 = ques[10];
      var answer = data.feed.entry[i][ques3]["$t"];
      if (answer == "Execute the innocent person & save 5 lives")
        user.case3 = 5;
      else
        user.case3 = 1;
      var ques4 = ques[11];
      var answer = data.feed.entry[i][ques4]["$t"];
      if (answer == "Give the dose to the initial patient")
        user.case4 = 1;
      else
        user.case4 = 5;
      var ques5 = ques[12];
      var answer = data.feed.entry[i][ques5]["$t"];
      if (answer == "Manufacture the gas & let the 1 patient die")
        user.case5 = 5;
      else
        user.case5 = 1;
      user.code = "" + user.case1 + user.case2 + user.case3 + user.case4 + user.case5;

      if(!list_data[name])
        list_data[name] = user;
      else {
        var count = 1;
        var name2 = name;
        while(list_data[name2]) {
          name2 = name + count++;
        }
        list_data[name2] = user;
        list_data[name2].name = name2;
      }
    }
    var data_arr = Object.keys(list_data);
    for (var i = 0; i < data_arr.length; i++) {
      var name = data_arr[i];
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

    $("#user_count").text(data_arr.length);
    $("#data_count").text(data_arr.length * 5);

    train_data = JSON.parse(JSON.stringify(list_data));
    for (var i = 0; i < data_arr.length; i++) {
      var name = data_arr[i];
      delete train_data[name].timestamp;
      delete train_data[name].code;
      if (train_data[name].case1 == 5)
        train_data[name].case1 = [1, 0];
      else
        train_data[name].case1 = [0, 1];
      if (train_data[name].case2 == 5)
        train_data[name].case2 = [1, 0];
      else
        train_data[name].case2 = [0, 1];
      if (train_data[name].case3 == 5)
        train_data[name].case3 = [1, 0];
      else
        train_data[name].case3 = [0, 1];
      if (train_data[name].case4 == 5)
        train_data[name].case4 = [0, 1];
      else
        train_data[name].case4 = [1, 0];
      if (train_data[name].case5 == 5)
        train_data[name].case5 = [1, 0];
      else
        train_data[name].case5 = [0, 1];
    }

    visual_data["nodes"] = [
      {"id": "Case 1", "group": "#000000"},
      {"id": "Case 2", "group": "#000000"},
      {"id": "Case 3", "group": "#000000"},
      {"id": "Case 4", "group": "#000000"},
      {"id": "Case 5", "group": "#000000"}
    ];
    visual_data["links"] = [];

    for (var i = 0; i < data_arr.length; i++) {
      var label = {};
      var name = data_arr[i];
      label.id = list_data[name].name;
      label.group = "#000000";
      visual_data.nodes.push(label);

      var link1 = {};
      link1.source = list_data[name].name;
      link1.target = "Case 1";
      //console.log(list_data[name].case1);
      if (list_data[name].case1 == 5)
        link1.value = "#656565";
      else
        link1.value = "#DCDCDC";
      visual_data.links.push(link1);

      var link2 = {};
      link2.source = list_data[name].name;
      link2.target = "Case 2";
      if (list_data[name].case2 == 5)
        link2.value = "#656565";
      else
        link2.value = "#DCDCDC";
      visual_data.links.push(link2);

      var link3 = {};
      link3.source = list_data[name].name;
      link3.target = "Case 3";
      if (list_data[name].case3 == 5)
        link3.value = "#656565";
      else
        link3.value = "#DCDCDC";
      visual_data.links.push(link3);

      var link4 = {};
      link4.source = list_data[name].name;
      link4.target = "Case 4";
      if (list_data[name].case4 == 5)
        link4.value = "#656565";
      else
        link4.value = "#DCDCDC";
      visual_data.links.push(link4);

      var link5 = {};
      link5.source = list_data[name].name;
      link5.target = "Case 5";
      if (list_data[name].case5 == 5)
        link5.value = "#656565";
      else
        link5.value = "#DCDCDC";
      visual_data.links.push(link5);
    }

    var svg = d3.select("svg"),
    w = +svg.attr("width"),
    h = +svg.attr("height");


    simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-350))
    .force("center", d3.forceCenter(w / 2, h / 2));

    var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(visual_data.links)
    .enter().append("line")
    .attr("stroke", function(d) {return d.value;});

    var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(visual_data.nodes)
    .enter().append("g")
    .attr("class", "node")
    .append("circle")
    .attr("r", 2.5)
    .style("fill", function(d) {return d.group;})
    .attr("class", "point")
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

    var labels = d3.selectAll("g.node")
    .append("text")
    .attr("class", "caption")
    .attr("dx", 7)
    .attr("dy", "-.5em")
    .text(function(d) {return d.id;});

    simulation
    .nodes(visual_data.nodes)
    .on("tick", ticked);

    simulation.force("link")
    .links(visual_data.links);

    function ticked() {
      node
      .attr("cx", function(d) { return d.x = Math.max(2.5, Math.min(svg.attr("width") - 2.5, d.x)); })
      .attr("cy", function(d) { return d.y = Math.max(2.5, Math.min(svg.attr("height") - 2.5, d.y)); });

      link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      labels
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
    }

    d3.selectAll("g.node")
    .on("mouseover", function() {d3.select(this).select(".caption").style("visibility", "visible");})
    .on("mouseout", function() {d3.select(this).select(".caption").style("visibility", "hidden");});

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  });



  // net = new Network(6, 10, 2);
  //
  // var train_arr = Object.keys(train_data);
  // for (var i = 0; i < train_arr.length; i++) {
  //   var name = train_arr[i];
  //   var dataset = {};
  //   dataset.inputs = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  //   dataset.output = train_data[name].case1;
  //   train.push(dataset);
  //   var dataset = {};
  //   dataset.inputs = [inputs.desire.crucial, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  //   dataset.output = train_data[name].case2;
  //   train.push(dataset);
  //   var dataset = {};
  //   dataset.inputs = [inputs.desire.corrupt, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  //   dataset.output = train_data[name].case3;
  //   train.push(dataset);
  //   var dataset = {};
  //   dataset.inputs = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive];
  //   dataset.output = train_data[name].case4;
  //   train.push(dataset);
  //   var dataset = {};
  //   dataset.inputs = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  //   dataset.output = train_data[name].case5;
  //   train.push(dataset);
  // }
  // for (var c = 0; c < 500; c++) {
  //   for (var i = 0; i < train.length; i++) {
  //     //var set = random(train);
  //     var set = train[i];
  //     net.train(set.inputs, set.output);
  //   }
  // }
  // //[1, 1, 1, 1, 1, 1]
  // var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  // console.log("You are a trolley driver, and you notice 5 construction workers working towards the end of the track. Your brakes are faulty. However, you notice a side-track where there is only 1 worker. Which is the more ethical course of action?");
  // //console.log("case 1:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // var kill5 = floor(value[1] * 100);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
  // //[1, 1, 0, 1, 1, 1]
  // var test = [inputs.desire.crucial, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  // console.log("You are a transplant surgeon, you have 5 patients in critical need of an organ each. One needs a liver, two need a kidney, one a heart, another a lung. There are no donors. But there is a healthy patient in the next room. Which is the more ethical course of action?");
  // // console.log("case 2:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // var kill5 = floor(value[1] * 100);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
  //
  // // [0, 0, 0, 1, 1, 1]
  // var test = [inputs.desire.corrupt, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  // console.log("You are a judge, and 5 activists are threatening to kill themselves if the culprit of a certain crime is not found. The real culprit remains unknown. You can prevent the bloodshed by framing an innocent individual. Which is the more ethical course of action?");
  // // console.log("case 3:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // var kill5 = floor(value[1] * 100);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
  //
  // // [1, 1, 0, 1, 1, 0]
  // var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive];
  // console.log("You are a doctor, and in order to save a patient, you need to give him a massive dose of a drug that's in short supply. Later on, 5 other patients arrive, each of whom could be saved with 1/5th of that dose. Which is the more ethical option?");
  // // console.log("case 4:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // var kill5 = floor(value[1] * 100);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
  //
  // // [1, 1, 0, 1, 1, 1]
  // var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  // console.log("You are a doctor, and there are 5 patients whose lives could be saved by the manufacture of a certain gas. But this leads to the release of lethal fumes into the room of another patient who, for some reason, you cannot move elsewhere. Which is the more ethical option?");
  // // console.log("case 5:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // var kill5 = floor(value[1] * 100);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");
// }

// function draw () {
  // //[1, 1, 1, 1, 1, 1]
  // var test = [inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  // //console.log("You are a trolley driver, and you notice 5 construction workers working towards the end of the track. Your brakes are faulty. However, you notice a side-track where there is only 1 worker. Which is the more ethical course of action?");
  // //console.log("case 1:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // $("#case1-1").text(kill1);
  // var kill5 = floor(value[1] * 100);
  // $("#case1-5").text(kill5);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");

  // //[1, 1, 0, 1, 1, 1]
  // var test = [inputs.desire.crucial, inputs.intent.direct, inputs.duty.positive, inputs.desire.crucial, inputs.intent.oblique, inputs.duty.negative];
  // //console.log("You are a transplant surgeon, you have 5 patients in critical need of an organ each. One needs a liver, two need a kidney, one a heart, another a lung. There are no donors. But there is a healthy patient in the next room. Which is the more ethical course of action?");
  // // console.log("case 2:");
  // var value = net.predict(test);
  // var kill1 = floor(value[0] * 100);
  // $("#case2-1").text(kill1);
  // var kill5 = floor(value[1] * 100);
  // $("#case2-2").text(kill1);
  // console.log("kill 1: " + kill1 + "% kill 5: " + kill5 + "%");

  // for (var i = 0; i < train.length; i++) {
  //   //var set = random(train);
  //   var set = train[i];
  //   net.train(set.inputs, set.output);
  // }
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
