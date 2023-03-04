const jsonfile = require("jsonfile");

exports.write = function (obj, file) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + `/${file}.json`, obj, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.read = function (file) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + `/${file}.json`, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
