const LINE_BREAK_PATTERN = "(\r\n|\n|\r)";

const _rules = [
  {
    id: "trimTitle",
    description: 'Trim "|" and anything after it from the metadata title',
    getPattern: () => /(title:.*)(\|.*)/,
    isMatch: function(text) {
      return this.getPattern().test(text);
    },
    run: function(text) {
      return text.replace(this.getPattern(), "$1");
    }
  },

  {
    id: "removeDeprecatedMetadata",
    description: "Remove deprecated metadata (values defined in config)",
    getPattern: config => {
      const { deprecated } = config.metadata;
      const suffix = `:.*${LINE_BREAK_PATTERN}`;
      const expression = deprecated.join(`${suffix}|`) + suffix;
      const regex = new RegExp(expression, "g");
      return regex;
    },
    isMatch: function(text, config) {
      return this.getPattern(config).test(text);
    },
    run: function(text, config) {
      return text.replace(this.getPattern(config), "");
    }
  },

  {
    id: "replaceMetadata",
    description: "Replace metadata values defined in config.",
    getPattern: (token, old) => new RegExp(`${token}: ?${old}`),
    isMatch: function(text, config) {
      const { replacements } = config.metadata;
      let count = 0;
      const rule = this;
      replacements.forEach(({ token, oldValue }) => {
        if (rule.getPattern(token, oldValue).test(text)) {
          count++;
        }
      });
      return !!count;
    },
    run: function(text, config) {
      const { replacements } = config.metadata;
      const rule = this;
      replacements.forEach(({ token, oldValue, newValue }) => {
        text = text.replace(
          rule.getPattern(token, oldValue),
          `${token}: ${newValue}`
        );
      });
      return text;
    }
  },

  {
    id: "removeDefaultAuthor",
    description: "Remove default author",
    getPattern: (token, value) => {
      return new RegExp(`${token}: ?${value}.*${LINE_BREAK_PATTERN}`);
    },
    isMatch: function (text, config) {
      const { github, alias } = config.metadata.defaultAuthor;
      return (
        this.getPattern("author", github).test(text) || 
        this.getPattern("ms.author", alias).test(text)
      );
    },
    run: function (text, config) {
      const { github, alias } = config.metadata.defaultAuthor;
      text = text.replace(this.getPattern("author", github), "");
      text = text.replace(this.getPattern("ms.author", alias), "");
      return text;
    }
  },
  {
    id: "removeIfEmpty",
    description: "Remove metadata if it's empty",
    getPattern: config => {
      const { ifEmpty } = config.metadata;
      const suffix = `:.\s*${LINE_BREAK_PATTERN}`;
      const expression = ifEmpty.join(`${suffix}|`) + suffix;
      const regex = new RegExp(expression, "g");
      return regex;
    },
    isMatch: function(text, config) {
      return this.getPattern(config).test(text);
    },
    run: function(text, config) {
      return text.replace(this.getPattern(config), "");
    }
  },
];

const get = ruleName => {
  let rules;

  const runAllRules = !ruleName || /all/.test(ruleName);

  if (runAllRules) {
    rules = _rules;
  } else {
    rules = _rules.filter(r => r.id === ruleName);
  }

  return rules;
};

module.exports = { get };
