module.exports = {
  trimTitle: {
    description: 'Trim "|" and anything after it from the metadata title',
    getPattern: () => /(title:.*)(\|.*)/,
    run: function(content) {
      return content.replace(this.getPattern(), "$1");
    }
  },
};