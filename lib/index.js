'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _report = require('./report');

var _report2 = _interopRequireDefault(_report);

var envs = require('envs');

exports['default'] = function () {

    var reporterCreatedTime = Date.now();

    return {

        noColors: true,

        reportTaskStart: function reportTaskStart(startTime, userAgents, testCount) {

            this.toConsole = "true" == envs("TESTCAFE_REPORT_TOCONSOLE", "true");
            this.toSlack = "true" == envs("TESTCAFE_REPORT_TOSLACK", "false");
            this.mergeReport = "MERGED" === envs("TESTCAFE_REPORT_DISPLAYMODE", "MERGED");
            this.showErrors = "true" === envs("TESTCAFE_REPORT_SHOWERRORS", "false");

            console.log("");
            console.log("TestCafe_Report_Slack");
            console.log("  Output to Console: " + this.toConsole.toString());
            console.log("  Output to Slack: " + this.toSlack.toString());
            console.log("  Merged Report? " + this.mergeReport);
            console.log("");

            this.report = new _report2['default'](this.toConsole, this.toSlack, this.mergeReport);

            this.startTime = startTime;
            this.testCount = testCount;

            // Output the Report header
            this.report.addMessage('Date/Time: ' + startTime, true);
            this.report.addMessage('Environment: ' + userAgents, true);
            this.report.addMessage('Against: ' + envs('ENV', 'No env specified'), true);
            this.report.addMessage('', true);
            this.report.addMessage('CI Job: ' + envs('CI_JOB_URL', ''), true);
            this.report.addMessage('Merge Request: ' + envs('CI_MERGE_REQUEST_PROJECT_URL', ''), true);
            this.report.addMessage('User: @' + envs('GITHUB_USER_LOGIN', 'No One'), true);
            this.report.addMessage('', true);
            this.report.addMessage('Startup time (' + this.fmtTime(startTime - reporterCreatedTime) + ')', true);
        },

        reportFixtureStart: function reportFixtureStart(name, path) {
            this.fixtureStartTime = Date.now();
            this.report.addMessage("", true);
            this.currentFixtureName = name;
            this.report.addMessage(this.currentFixtureName, true);
        },

        reportTestDone: function reportTestDone(name, testRunInfo) {
            var _this = this;

            // Errors? Warnings?
            var resultIcon = "";
            if (testRunInfo.errs.length > 0) resultIcon = ":red_circle:";else if (testRunInfo.warnings !== null && testRunInfo.warnings !== undefined && testRunInfo.warnings.length > 0) resultIcon = ":large_yellow_circle:";else resultIcon = ":large_green_circle:";

            // Test Duration
            var durationStr = this.fmtTime(testRunInfo.durationMs);

            var message = resultIcon + " " + name + " (" + durationStr + ")";

            // Unstable?
            if (testRunInfo.unstable) message += " (Unstable)";

            this.report.addMessage(message);
            if (this.showErrors && testRunInfo.errs.length > 0) {
                (function () {
                    var errorStr = "";
                    var separator = "";
                    testRunInfo.errs.forEach(function (err, idx) {
                        errorStr += separator + _this.formatError(err, idx + 1 + ') ');
                        separator = "\n";
                    });
                    _this.report.addMessage(errorStr);
                })();
            }
        },

        reportTaskDone: function reportTaskDone(endTime, passed, warnings) {

            var durationMs = endTime - this.startTime;
            var durationStr = this.fmtTime(durationMs);
            var footer = passed === this.testCount ? this.testCount + ' passed' : this.testCount - passed + '/' + this.testCount + ' failed';

            footer = '*' + footer + '* (Duration: ' + durationStr + ')';

            this.report.addMessage("", true);
            this.report.addMessage(footer, true);

            this.report.sendTaskReport(this.testCount - passed);
        },

        fmtTime: function fmtTime(duration) {
            if (duration < 10 * 1000) {
                var seconds = duration / 1000;
                return seconds.toFixed(2) + 's';
            }

            return this.moment.duration(duration).format('h[h] mm[m] ss[s]');
        }
    };
};

module.exports = exports['default'];