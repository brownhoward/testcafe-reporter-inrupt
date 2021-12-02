require('dotenv').config();

const chalk = require('chalk');

const envs = require('envs');

module.exports = class consoleReport {
  constructor() {
    // Store parameters
    this.mergeReport = "TRUE" == envs("TESTCAFE_REPORT_CONSOLE_MERGE", "FALSE").toUpperCase();
    this.showErrors = "TRUE" == envs("TESTCAFE_REPORT_CONSOLE_SHOWERRORS", "TRUE").toUpperCase();
    this.includeHeader = "TRUE" == envs("TESTCAFE_REPORT_CONSOLE_INCLUDEHEADER", "FALSE").toUpperCase();
    this.includeFooter = "TRUE" == envs("TESTCAFE_REPORT_CONSOLE_INCLUDEFOOTER", "TRUE").toUpperCase(); // Blank Report

    this.report = [];
  }

  showErrors() {
    return this.showErrors;
  } // Append a message


  addMessage(message) {
    this.report.push(message);

    if (!this.mergeReport) {
      this.sendMessage(this.report.join("\n"));
      this.report = [];
    }
  }

  sendMessage(reportStr) {
    // Set icons
    let consoleReportStr = reportStr.replace(/:red_circle:/g, chalk.red("X"));
    consoleReportStr = consoleReportStr.replace(/:white_circle:/g, "-");
    consoleReportStr = consoleReportStr.replace(/:large_yellow_circle:/g, chalk.yellow("?"));
    consoleReportStr = consoleReportStr.replace(/:large_green_circle:/g, chalk.green("√")); // Output

    console.log(consoleReportStr);
  }

  sendFixtureReport() {
    if (!this.mergeReport && this.report.length > 0) {
      const reportStr = this.report.join("\n");
      this.sendMessage(reportStr);
      this.report = [];
      this.errorReport = [];
    }
  }

  sendTaskReport(nrFailedTests) {
    const reportStr = this.report.join("\n");
    const textStr = nrFailedTests > 1 ? " tests failed" : " test";
    this.sendMessage(reportStr, nrFailedTests > 0 ? {
      "attachments": [{
        color: "danger",
        text: textStr
      }]
    } : null);
  }

};