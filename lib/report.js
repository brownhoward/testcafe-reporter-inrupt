require('dotenv').config();

const consoleReport = require("./consoleReport");

const slackReport = require("./slackReport");

const envs = require('envs');

module.exports = class report {
  constructor() {
    // Configuration Flags
    // Output to Console?
    this.toConsole = "TRUE" == envs("TESTCAFE_REPORT_TOCONSOLE", "TRUE").toUpperCase();

    if (this.toConsole) {
      this.consoleReport = new consoleReport();
    } // Output to Slack?


    this.toSlack = "TRUE" == envs("TESTCAFE_REPORT_TOSLACK", "FALSE").toUpperCase();

    if (this.toSlack) {
      this.slackReport = new slackReport();
    }
  } // Add a message


  addMessage(message) {
    if (this.toConsole) this.consoleReport.addMessage(message);
    if (this.toSlack) this.slackReport.addMessage(message);
  } // Add Errors


  addErrors(errorStr) {
    if (this.toConsole && this.consoleReport.showErrors()) this.consoleReport.addMessage(errorStr);
    if (this.toSlack && this.slackReport.showErrors()) this.slackReport.addMessage(errorStr);
  }

  sendMessage(reportStr, slackProperties = null) {
    if (this.toConsole) this.consoleReport.sendMessage(reportStr);
    if (this.toSlack) this.slackReport.sendMessage(reportStr, slackProperties);
  }

  sendFixtureReport() {
    if (this.toConsole) this.consoleReport.sendFixtureReport();
    if (this.toSlack) this.slackReport.sendFixtureReport();
  }

  sendTaskReport(nrFailedTests) {
    if (this.toConsole) this.consoleReport.sendTaskReport(nrFailedTests);
    if (this.toSlack) this.slackReport.sendTaskReport(nrFailedTests);
  }

};