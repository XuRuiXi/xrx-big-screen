module.exports = {
  extends: '@ali-whale',
  rules: {
    'linebreak-style': ['off', 'windows'],
    'max-lines': ['error', 600],
    'max-len': ['error', 200],
    'react/require-default-props': ['off'],
    // 未使用的变量
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
  },
};
