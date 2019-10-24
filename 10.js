const args = require('yargs').argv;
const config = require('./config').read();
const rules = require('./rules');
const fs = require("fs");
const path = require("path");

const ENCODING = 'utf8';

console.log('\nRunning tensies...\n');

if (args.rules) {
  const keys = Object.keys(rules);
  console.log('Available rules:');
  keys.forEach(key => {
    console.log(` - ${key}: ${rules[key].description}`);
  });
  return;
} 

try {

  const ruleName = args._[0];
  const rule = rules[ruleName];

  const fileNames = [];
  const processedFileNames = [];

  if (rule) {
    console.log(`[RULE] ${ruleName}: ${rule.description}`);

    fs.readdirSync(config.filePath).forEach(fileName => {
      if(/\.md/.test(fileName)) {
        fileNames.push(fileName);
      }
    });

    fileNames.forEach(fileName => {
      const shouldProcessFiles = processedFileNames.length < config.threshold;

      if (shouldProcessFiles) {
        const filePath = path.join(config.filePath, fileName);
        let text = fs.readFileSync(filePath, ENCODING);
        const isMatch = rule.pattern.test(text);

        if (isMatch) {
          processedFileNames.push(fileName);
          text = rule.run(text);
          fs.writeFileSync(filePath, text, ENCODING);
        }
      }
    });

    console.log(`\nNumber of files modified: ${processedFileNames.length}`);

    if (processedFileNames.length > 0) {
      console.log("\n - " + processedFileNames.join("\n - "));
    } else {
      console.log("\nNo files were modified by this rule.");
    }

    console.log("\nDone");
  }
} catch(e) {
  console.log(`Error: ${JSON.stringify(e)}`);
}
