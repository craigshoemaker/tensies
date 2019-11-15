# tensies: Batch Markdown clean up tool

## Configuration

Before you run tensies, you need to create a *config.json* file. When you clone the repo, this file does not exist.

Make a copy of *config.example.json* and rename it to *config.json* and enter the values required for your purposes.

> **Note**: Make sure to replace any tokens `IN_ALL_CAPS` with your desired values.

## Usage

### Get a list of all available rules

```bash
node 10.js --rules
```

Which returns a list of rules:

```bash
Running tensies...

Available rules:
 - trimTitle: Trim "|" and anything after it from the metadata title
 - removeDeprecatedMetadata: Remove deprecated metadata (values defined in config)
 - updateManagerAlias: Update manager alias (values defined in config)
```

### Run a rule

To run a specific rule, use the following syntax:

```bash
node 10 trimTitle
```

Which returns a response like:

```bash
Running tensies...

[RULE] trimTitle: Trim "|" and anything after it from the metadata title

Number of files modified: 10

    - app-service-export-api-to-powerapps-and-flow.md
    - create-function-app-linux-app-service-plan.md
    - deployment-zip-push.md
    - functions-api-definition.md
    - functions-best-practices.md
    - functions-cli-samples.md
    - functions-continuous-deployment.md
    - functions-create-cosmos-db-triggered-function.md
    - functions-create-function-app-portal.md
    - functions-create-maven-eclipse.md

Done
```

### Run all rules

To run all rules you can either call the script with no arguments:

```bash
node 10
```

or explicitly call all rules:

```bash
node 10 all
```

## Add a rule

Rules are implemented as simple JavaScript objects. Each rule features an id, description, matching pattern (regular expression wrapped in a function), and `run` function which handles the text replacement. You can add a new rule in the [rules](https://github.com/craigshoemaker/tensies/blob/master/modules/rules.js) array.

Once a rule is listed in the [rules](https://github.com/craigshoemaker/tensies/blob/master/modules/rules.js) array, then it automatically appears when users list rules by using the `--rules` switch.
