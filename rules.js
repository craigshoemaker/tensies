module.exports = {

  trimTitle: {
    description: "Trim \"|\" and anything after it from the metadata title.",
    pattern: /(title:.*)(\|.*)/,
    run: function(content) {
      return content.replace(this.pattern, "$1");
    }
  },
  replaceManager: {
    description: "Replace \"jeconnoc\" with manager \"gwallace\".",
    pattern: /(manager:.*)(jeconnoc.*)/,
    run: function(content) {
      return content.replace(this.pattern, "$1gwallace");
    }
  },
  removeServices: {
    description: "Remove the unused \"services:\" metadata.",
    pattern: /services:.*\m/,
    run: function(content) {
      return content.replace(this.pattern, "");
    }
  },
  removeDocumentationCenter: {
    description: "Remove the unused \"documentationcenter:\" metadata.",
    pattern: /documentationcenter:.*\m/,
    run: function(content) {
      return content.replace(this.pattern, "");
    }
  },
  resetFreshness: {
    description: "Update the freshness for all processed articles.",
    pattern: /ms.date:.*/,
    run: function(content) {
      return content.replace(this.pattern, "$1" + "10/28/2019");
    }
  },
};