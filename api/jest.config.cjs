module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!some-esm-package|another-esm-package)/",
  ],
};
