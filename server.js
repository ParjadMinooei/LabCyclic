import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = express();
const port = 3000;
//handlebars
const exphbs = require('express-handlebars');
const path = require("path");
//linebyline
const readline = require("linebyline");
const rl = readline("./images.txt");

//starting handle bars

app.engine(".hbs", exphbs.engine({											
  extname: ".hbs",                                                       
  defaultLayout: false,                                                  
  layoutsDir: path.join(__dirname, "./views")                              
}));

app.set("view engine", ".hbs");


//textByLine
var textByLine = [];
let numArray;
var finalarr = [];



//function starts here
rl.on("line", (line, lineCount, byteCount) => {
    textByLine.push(line);
})
.on("error", (err) => {
    console.error(err);
})
.on("end", () =>{
  numArray = textByLine.toString().split(",");
  for (var i = 0; i < numArray.length; i++){
    var word = "";
    var finalword = "";
    word = numArray[i]
    for (var d = 0; d < word.length; d++){
        if (word[d] === "."){
            break;
          }
          else {
           finalword += word[d];
          }
        }
    finalarr.push(finalword); 
  }
});


app.use(express.static('public'));

app.get("/",express.urlencoded({ extended: true }), (req, res) => {
  var imageList = [];
  var test = [];
  var result = "";
  var result2 = "";
  var passedVariable = req.query.valid;
  if (passedVariable === undefined || passedVariable === null || passedVariable === `${undefined}` || passedVariable === 'undefined'){
    result = `./images/Waterfall.webp`;
    result2 = `Gallery`;
    
  }
  else {
    let rx = /\[(-?\d+)\]/;
    var num = 0;
    num = passedVariable.match(rx)[1];
    result = `./images/${textByLine[num]}`;
    result2 = finalarr[num];

  }
  var size = textByLine.length;
  for (var i =0; i < size; i++){
    imageList.push({src: `./images/${textByLine[i]}`, name:`${finalarr[i]}`});
  }
  var moreData = {
    number1: result
  };
  var someData = {
    number2: result2
  };
  res.render ('viewData', {
    imageList:imageList,
    test:test,
    data1: moreData,
    data2: someData
  });
});
app.post("/",express.urlencoded({ extended: true }), (req, res) => {
  var test = req.body.images;
  res.redirect("/?valid=" + test);
});

app.use(function(req, res, next) {
  res.send("FAILED! Fix your URL");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



