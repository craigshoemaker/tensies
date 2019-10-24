module.exports = {

  trimTitle: {
    description: "Trim \"|\" and anything after it from the metadata title",
    pattern: /(title:.*)(\|.*)/,
    run: function(content) {
      return content.replace(this.pattern, "$1");
    }
  },

};