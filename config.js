const fs = require('fs');

module.exports = {

  read: () => {
    const filePath = "./config.json";
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.log(`Error while trying to read: ${filePath}`);
    }
  }
};
