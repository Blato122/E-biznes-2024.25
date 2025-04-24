const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
        
    },
    baseUrl: 'https://www.saucedemo.com',
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 5000,
    viewportWidth: 1280,
    viewportHeight: 720
  },
});