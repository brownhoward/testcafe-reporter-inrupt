'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('dotenv').config();
var chalk = require('chalk');
var envs = require('envs');

var report = (function () {
    function report() {
        var toConsole = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        var toSlack = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var mergeReport = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        _classCallCheck(this, report);

        // Store parameters
        this.toConsole = toConsole;
        this.toSlack = toSlack;
        this.mergeReport = mergeReport;

        // Configure Slack
        this.slack = null;
        if (toSlack) {
            var slackNode = require('slack-node');
            this.slack = new slackNode();
            this.slack.setWebhook(envs('TESTCAFE_SLACK_WEBHOOK', 'http://example.com'));
        }

        // Blank Reports
        this.report = [];
        //this.errorReport = [];
    }

    // Append a message

    _createClass(report, [{
        key: 'addMessage',
        value: function addMessage(message) {
            var hold = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            this.report.push(message);
            if (!hold && !this.mergeReport) {
                this.sendMessage(this.report.join("\n"));
                this.report = [];
            }
        }

        // Append an error
        //addError(message, hold=false) {
        //    this.errorReport.push(message);
        //    if (!hold && !this.mergeReport) {
        //        this.sendMessage(this.errorReport.join("\n\n"));
        //        this.errorReport = [];
        //    }
        //}

    }, {
        key: 'sendMessage',
        value: function sendMessage(reportStr) {
            var slackProperties = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            // Output to Console?
            if (this.toConsole) {

                // Set icons
                var consoleReportStr = reportStr.replace(/:red_circle:/g, chalk.red("X"));
                consoleReportStr = consoleReportStr.replace(/:large_yellow_circle:/g, chalk.yellow("?"));
                consoleReportStr = consoleReportStr.replace(/:large_green_circle:/g, chalk.green("√"));

                // Output
                console.log(consoleReportStr);
            }

            // Output to Slack?
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
    }, {
        key: 'sendFixtureReport',
        value: function sendFixtureReport() {
            if (!this.mergeReport && this.report.length > 0) {
                var reportStr = this.report.join("\n");
                this.sendMessage(reportStr);
                this.report = [];
                this.errorReport = [];
            }
        }
    }, {
        key: 'sendTaskReport',
        value: function sendTaskReport(nrFailedTests) {
            var reportStr = this.report.join("\n");
            var textStr = nrFailedTests > 1 ? " tests failed" : " test";
            this.sendMessage(reportStr, nrFailedTests > 0 ? {
                "attachments": [{
                    color: "danger",
                    text: "${nrFailedTests}" + textStr
                }]
            } : null);
        }

        //getErrorMessage() {
        //    return this.errorMessage.join("\n\n");
        //}
    }]);

    return report;
})();

exports['default'] = report;
module.exports = exports['default'];