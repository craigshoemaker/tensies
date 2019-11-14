const _rules = {
  trimTitle: {
    description: 'Trim "|" and anything after it from the metadata title',
    getPattern: () => /(title:.*)(\|.*)/,
    run: function(content) {
      return content.replace(this.getPattern(), "$1");
    }
  },

  removeDeprecatedMetadata: {
    description: "Remove deprecated metadata (values defined in config)",
    getPattern: config => {
      const { deprecated } = config.metadata;
      const suffix = ":.*\n";
      const expression = deprecated.join(`${suffix}|`) + suffix;
      const regex = new RegExp(expression, 'g');
      return regex;
    },
    run: function(content, config) {
      return content.replace(this.getPattern(config), "");
    }
  },

  updateManagerAlias: {
    description: "Update manager alias (values defined in config)",
    getPattern: config => {
      const { manager } = config.metadata.replacements;
      return new RegExp(`manager: ?${manager.old}`)
    },
    run: function (content, config) {
      const { manager } = config.metadata.replacements;
      return content.replace(
        this.getPattern(config),
        `manager: ${manager.new}`
      );
    }
  }
};

const getRules = ruleName => {

  let rules = [];

  const runAllRules = !ruleName || /all/.test(ruleName);
  const ruleExists = !!_rules[ruleName];

  if (runAllRules) {
    Object.keys(_rules).map(ruleName => {
      const rule = { ..._rules[ruleName], ...{ id: ruleName } };
      rules.push(rule);
    });
  } else if(ruleExists) {
    const rule = { ..._rules[ruleName], ...{ id: ruleName } };
    rules.push(rule);
  }

  return rules;

};

module.exports = {
  get: getRules
};