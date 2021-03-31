require('dotenv').config();

const chalk = require('chalk');

const envs = require('envs');

module.exports = class report {
  constructor(mergeReport = true, toConsole = true, toSlack = false) {
    // Store parameters
    this.toConsole = toConsole;
    this.toSlack = toSlack;
    this.mergeReport = mergeReport; // Configure Slack

    this.slack = null;

    if (toSlack) {
      let slackNode = require('slack-node');

      this.slack = new slackNode();
      this.slack.setWebhook(envs('TESTCAFE_SLACK_WEBHOOK', 'http://example.com'));
    } // Blank Reports


    this.report = [];
  } // Append a message


  addMessage(message, hold = false) {
    this.report.push(message);

    if (!hold && !this.mergeReport) {
      this.sendMessage(this.report.join("\n"));
      this.report = [];
    }
  }

  sendMessage(reportStr, slackProperties = null) {
    // Output to Console?
    if (this.toConsole) {
      // Set icons
      let consoleReportStr = reportStr.replace(/:red_circle:/g, chalk.red("X"));
      consoleReportStr = consoleReportStr.replace(/:large_yellow_circle:/g, chalk.yellow("?"));
      consoleReportStr = consoleReportStr.replace(/:large_green_circle:/g, chalk.green("√")); // Output

      console.log(consoleReportStr);
    } // Output to Slack?


    if (this.toSlack) {
      this.slack.webhook(Object.assign({
        channel: envs('TESTCAFE_SLACK_CHANNEL', '#testcafe'),
        username: envs('TESTCAFE_SLACK_BOT', 'testcafebot'),
        text: reportStr
      }, slackProperties), function (err, response) {
        if (err) {
          console.log('Unable to send a message to Slack');
          console.log(response);
        }
      });
    }
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
        text: "${nrFailedTests}" + textStr
      }]
    } : null);
  }

};