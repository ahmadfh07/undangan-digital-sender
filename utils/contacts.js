const fs = require("fs");
const { builtinModules } = require("module");

//mengambil data contacts
const loadContact = (fileName) => {
  const fileBuffer = fs.readFileSync(`temp/${fileName}`, "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

module.exports = { loadContact };
