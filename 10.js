const args = require('yargs').argv;
const config = require('./config').read();
const rules = require('./modules/rules');
const fs = require("fs");
const path = require("path");

const ENCODING = 'utf8';

console.log('\nRunning tensies...\n');

if (args.rules) {
  console.log('Available rules:');
  rules.get().forEach(rule => {
    console.log(` - ${rule.id}: ${rule.description}`);
  });
  return;
} 

try {

  const ruleName = args._[0];
  const currentRules = rules.get(ruleName);

  const fileInfo = [];
  const processedFiles = [];

  const hasRulesToRun = currentRules.length > 0;

  if (hasRulesToRun) {

    fs.readdirSync(config.filePath).forEach(fileName => {
      if (/\.md/.test(fileName)) {
        fileInfo.push({
          name: fileName,
          fullPath: path.join(config.filePath, fileName)
        });
      }
    });

    let ruleMessages = [];

    fileInfo.forEach(file => {
      const shouldProcessFile = processedFiles.length < config.threshold;

      if (shouldProcessFile) {
        let text = fs.readFileSync(file.fullPath, ENCODING);
        let isUpdated = false;

        currentRules.forEach(rule => {
          const isMatch = rule.getPattern(config).test(text);
          if (isMatch) {
            ruleMessages.push(`[RULE] ${rule.id}: ${rule.description}`);
            isUpdated = true;
            text = rule.run(text, config);
          }
        });

        if (isUpdated) {
          processedFiles.push({
            name: file.name
          });
          fs.writeFileSync(file.fullPath, text, ENCODING);
        }
      }
    });

    ruleMessages = [...new Set(ruleMessages)];

    console.log(ruleMessages.join("\n"));

    console.log(`\nNumber of files modified: ${processedFiles.length}`);

    if (processedFiles.length > 0) {
      console.log(
        "\n - " + processedFiles.map(file => file.name).join("\n - ")
      );
    } else {
      console.log("\nNo files were modified by this rule.");
    }

    console.log("\nDone");
  }
} catch(e) {
  console.log(`Error: ${JSON.stringify(e)}`);
}
