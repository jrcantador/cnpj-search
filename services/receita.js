var request = require("request");
var rp = require("request-promise");
var documents = require("./info");
var fs = require("fs");

const sleep = require("util").promisify(setTimeout);

var options = {
  method: "GET",
  uri: "",
  json: true,
};

let qtdCompanies = documents.documents.length;
console.log("Obtendo informações de " + qtdCompanies + " Empresas");

let save = (data) => {
  fs.exists("d:\\data_2.json", function (exists) {
    var json = JSON.stringify(data);
    if (exists) {
      fs.appendFile("d:\\data_2.json", "," + json, function (err, result) {
        if (err) console.log("error", err);
        1;
      });
    } else {
      fs.writeFile("d:\\data_2.json", json, function (err, result) {
        if (err) console.log("error", err);
      });
    }
  });
};

let notSave = (data) => {
  fs.exists("d:\\dataNotSave_2.json", function (exists) {
    var json = JSON.stringify(data);
    if (exists) {
      fs.appendFile(
        "d:\\dataNotSave_2.json",
        "," + json,
        function (err, result) {
          if (err) console.log("error", err);
          1;
        }
      );
    } else {
      fs.writeFile("d:\\dataNotSave_2.json", json, function (err, result) {
        if (err) console.log("error", err);
      });
    }
  });
};

let getInfos = async (options) => {
  return await rp(options);
};

let handle = async () => {
  for (let i = 0; i < documents.documents.length; i++) {
    let document = documents.documents[i];
    options.uri = options.uri + document.replace(/[^\w\s]/gi, "");
    try {
      await sleep(60*1000);
      let data = await getInfos(options);
      save(data);      
      qtdCompanies--;
      console.log("Faltam " + qtdCompanies + " Empresas");
    } catch (error) {
      console.log("Erro ao salvar" + document);
      notSave(document);
    }
  }
};

handle();
