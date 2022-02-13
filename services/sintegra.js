var request = require("request");
var rp = require("request-promise");
var documents = require("./info");
var fs = require("fs");

var options = {
  method: "GET",
  uri: "https://www.sintegraws.com.br/api/v1/execute-api.php",
  qs: {
    token: "",
    plugin: "ST",
  },
  json: true,
};

let qtdCompanies = documents.documents.length;
let date = new Date();
console.log("Obtendo informações de " + qtdCompanies + " Empresas (" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + ")");

let save = (data) => {
  fs.exists("d:\\data.json", function (exists) {
    var json = JSON.stringify(data);
    if (exists) {
      fs.appendFile("d:\\data.json", "," + json, function (err, result) {
        if (err) console.log("error", err);
        1;
      });
    } else {
      fs.writeFile("d:\\data.json", json, function (err, result) {
        if (err) console.log("error", err);
      });
    }
  });
};

let notSave = (data) => {
  fs.exists("d:\\dataNotSave.json", function (exists) {
    var json = JSON.stringify(data);
    if (exists) {
      fs.appendFile("d:\\dataNotSave.json", "," + json, function (err, result) {
        if (err) console.log("error", err);
        1;
      });
    } else {
      fs.writeFile("d:\\dataNotSave.json", json, function (err, result) {
        if (err) console.log("error", err);
      });
    }
  });
};

let getInfos = async (options, plugin) => {
  options.qs["plugin"] = plugin;
  return await rp(options);
};

let handle = async () => {
  for (let i = 0; i < documents.documents.length; i++) {
    let document = documents.documents[i];
    options.qs["cnpj"] = document;
    let data = await getInfos(options, "ST");
    if (data) {
      if (data.code == 7) {
        date = new Date();
        console.log("Erro na pesquisa: " + document + "(" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + ")");
        notSave(document);
      } else if (
        data.message.localeCompare(
          "Nenhum estabelecimento encontrado no SINTEGRA."
        ) == 0
      ) {
        data = await getInfos(options, "SN");
      }
      save(data);
    }
    qtdCompanies--;

    date = new Date();
    console.log("Faltam " + qtdCompanies + " Empresas (" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + ")");
  }
};

handle();
