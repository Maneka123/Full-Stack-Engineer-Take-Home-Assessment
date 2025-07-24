export default {
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  }
};
