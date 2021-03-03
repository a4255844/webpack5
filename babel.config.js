module.exports = function (api) {
  api.cache(true); //缓存处理,提高性能

  const presets = [
    [
      '@babel/preset-env',
      {

        "targets": {
          // "edge": 70,
          "ie": 10,
          "chrome": 67
        },
        "useBuiltIns": "usage",  //不用直接引入polyfill, 它会按需引入
        "corejs": 2,
      }

    ]
  ];
  const plugins = ["@babel/plugin-transform-runtime"];

  return {
    presets,
    plugins
  };
}