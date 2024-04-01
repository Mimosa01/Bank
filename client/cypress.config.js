/* eslint-disable no-undef */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  waitForAnimations: false,
  animationDistanceThreshold: 50,

  e2e: {
    // eslint-disable-next-line no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
