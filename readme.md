# tensies: Batch Markdown clean up tool

## Configuration

To run tensies against a folder, add the folder path to *config.json*. When you clone the repo, this file does not exist. Make a copy of *config.example.json* and rename it to *config.json* and enter your desired file path.

## Usage

1. Get a list of all available rules

    ```bash
    node 10.js --rules    
    ```

    Which returns a list of rules:

    ```bash
    Running tensies...

    Available rules:
     - trimTitle: Trim "|" and anything after it from the metadata title
    ```

2. Run a rule

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
## Add a rule

Rules are implemented as simple JavaScript objects. Each rule features a description, a matching pattern (regular expression), and a `run` function which handles the text replacement. You can add a new rule in the rules object.

Once a rule is listed in the rules object, then it automatically appears when users list rules by using the `--rules` switch.
