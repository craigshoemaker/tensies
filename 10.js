const args = require('yargs').argv;
const config = require('./config').read();
const rules = require('./rules');
const fs = require("fs");
const path = require("path");

const ENCODING = 'utf8';

console.log('\nRunning tensies...\n');

// Output for --rules.
if (args.rules) {
  const keys = Object.keys(rules);
  console.log('Available rules:');
  keys.forEach(key => {
    console.log(` - ${key}: ${rules[key].description}`);
  });
  return;
}

const sourceFileNames = [];
//const processedFileNames = [];
const processedFiles = [];
const rulesToRun = [];

// Get the rules we need to run.
if (args.all) {
  for (var ruleName in rules) {
    rulesToRun.push(rules[ruleName]);
  } 
}else {
  args._.forEach(ruleName => {
    rulesToRun.push(rules[ruleName]);
  });
}

try {

  // Load the list of files in the directory.
  fs.readdirSync(config.filePath).forEach(fileName => {
    if (/\.md/.test(fileName)) {
      sourceFileNames.push(fileName);
    }
  });

  // Process each requested rule.
  rulesToRun.forEach(rule => {
    //for(let i = 0; i < args._.length; i++) {

    // //const ruleName = args._[i];
    // // Get the rule with the current name.
    // const rule = rules[ruleName];

    // if (rule) {
      //@craigshoemaker not sure how to the get the key of the current 'rule'.
      console.log(`[RULE] ${rule.description}`);

      // If we've already processed some files, check them first.
      if (processedFiles.length > 0) {
        processedFiles.forEach(file => {
          processMatchingFiles(file, rule);
        });
      }

      let j = 0;
      // If we don't have all X files, add some in this pass.
      while (processedFiles.length < config.threshold) {
        const isProcessed = false;

        // Have we checked a given file for the current rule.
        processedFiles.forEach(p => {
          if (p.name === sourceFileNames[j]) {
            isProcessed = true;
          }
        });

        // Process a new file.
        if (!isProcessed) {
          const file = new Object;
          file.name = sourceFileNames[j];

          file.path = path.join(config.filePath, file.name);
          file.text = fs.readFileSync(file.path, ENCODING);

          // Add if the file matches the rule and isn't in the array.
          if (processMatchingFiles(file, rule)) {
            if (!processedFiles.includes(file)) {
              processedFiles.push(file);
            }
          }
        }
        j++;
      //}
    };
  });

  // Write out processed files.
  processedFiles.forEach(file => {
    fs.writeFileSync(file.path, file.text, ENCODING);
    console.log("- " + file.name);
  });


  // @craigshoemaker I'm not sure how to best do this. 
  // Probably we need to build a logging object that gets loaded with each run.
  //console.log(`\nNumber of files modified: ${processedFiles.length}`);

  // if (processedFiles.length > 0) {
  //   processedFiles.forEach(file => {
  //     console.log("\n - " + file.name.join("\n - "));
  //   });

  // } else {
  //   console.log("\nNo files were modified by this rule.");
  // }

  // console.log("\nDone");
}
catch (e) {
  console.log(`Error: ${JSON.stringify(e)}`);
};

function processMatchingFiles(file, rule) {
  // Does the file text match the rule. 
  const isMatch = rule.pattern.test(file.text);
  // Run the rule if a match.
  if (isMatch) {
    file.text = rule.run(file.text);
  }
  return isMatch;
}
