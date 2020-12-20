module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  // "extends": "eslint:all",  //开启所有的规则检查
  "extends": "eslint:recommended",  //开启推荐的规则检查
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "off"  //关闭此规则
  }
};
