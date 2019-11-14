module.exports = {
  trimTitle: {
    description: 'Trim "|" and anything after it from the metadata title',
    getPattern: () => /(title:.*)(\|.*)/,
    run: function(content) {
      return content.replace(this.getPattern(), "$1");
    }
  },

  removeDeprecatedMetadata: {
    description: "Remove deprecated metadata",
    getPattern: config => {
      const { deprecatedMetadata } = config;
      const suffix = ":.*\n";
      const expression = deprecatedMetadata.join(`${suffix}|`) + suffix;
      const regex = new RegExp(expression, 'g');
      return regex;
    },
    run: function(content, config) {
      return content.replace(this.getPattern(config), "");
    }
  }
};