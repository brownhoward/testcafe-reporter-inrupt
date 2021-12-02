require('dotenv').config();

const consoleReport = require("./consoleReport");

const slackReport = require("./slackReport");

const chalk = require('chalk');

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


  addErrors(testRunInfo) {
    if (false == this.consoleReport.showErrors() && false == this.slackReport.showErrors()) return; // Any errors to display?

    if (0 == testRunInfo.errs.length) return; // Build the error text

    let errorStr = "";
    let separator = "";
    testRunInfo.errs.forEach((err, idx) => {
      errorStr += separator + this.formatError(err, `${idx + 1}) `);
      separator = "\n";
    });
    if (this.toConsole && this.consoleReport.showErrors()) this.consoleReport.addErrors(message);
    if (this.toSlack && this.slackReport.showErrors()) this.slackReport.addError(message);
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