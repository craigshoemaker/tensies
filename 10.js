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

  const fileInfo = [];
  const processedFiles = [];

  if (rule) {
    console.log(`[RULE] ${ruleName}: ${rule.description}`);

    fs.readdirSync(config.filePath).forEach(fileName => {
      if(/\.md/.test(fileName)) {
        fileInfo.push({
          name: fileName,
          fullPath: path.join(config.filePath, fileName)
        });
      }
    });

    fileInfo.forEach(file => {
      const shouldProcessFile = processedFiles.length < config.threshold;

      if (shouldProcessFile) {
        let text = fs.readFileSync(file.fullPath, ENCODING);
        const isMatch = rule.getPattern(config).test(text);

        if (isMatch) {
          processedFiles.push({
            name: file.name
          });
          text = rule.run(text, config);
          fs.writeFileSync(file.fullPath, text, ENCODING);
        }
      }
    });

    console.log(`\nNumber of files modified: ${processedFiles.length}`);

    if (processedFiles.length > 0) {
      console.log("\n - " + processedFiles
                              .map(file => file.name)
                              .join("\n - "));
    } else {
      console.log("\nNo files were modified by this rule.");
    }

    console.log("\nDone");
  }
} catch(e) {
  console.log(`Error: ${JSON.stringify(e)}`);
}
