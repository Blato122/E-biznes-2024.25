const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
        
    },
    baseUrl: 'https://www.saucedemo.com',
    defaultCommandTimeout: 5000,
    viewportWidth: 1280,
    viewportHeight: 720
  },
});