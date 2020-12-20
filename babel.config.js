module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {

        "targets": {
          // "edge": 70,
          "ie": 10,
          "chrome": 67
        },
        "useBuiltIns": "usage",
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