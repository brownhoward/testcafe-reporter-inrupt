import report from './report';
const envs = require('envs');

export default function () {

    const reporterCreatedTime = Date.now();

    return {

        noColors: true,

        reportTaskStart (startTime, userAgents, testCount) {

            this.toConsole = ("true" == envs("TESTCAFE_REPORT_TOCONSOLE", "true"));
            this.toSlack = ("true" == envs("TESTCAFE_REPORT_TOSLACK", "false"));
            this.mergeReport = ("MERGED" === envs("TESTCAFE_REPORT_DISPLAYMODE", "MERGED"));
            this.showErrors = ("true" === envs("TESTCAFE_REPORT_SHOWERRORS", "false"));

            console.log("");
            console.log("TestCafe_Report_Slack");
            console.log("  Output to Console: " + this.toConsole.toString());
            console.log("  Output to Slack: " + this.toSlack.toString());
            console.log("  Merged Report? " + this.mergeReport);
            console.log("");

            this.report = new report(this.toConsole, this.toSlack, this.mergeReport);

            this.startTime = startTime;
            this.testCount = testCount;

            // Output the Report header
            this.report.addMessage(`Date/Time: ${startTime}`, true);
            this.report.addMessage(`Environment: ${userAgents}`, true);
            this.report.addMessage(`Against: ${envs('ENV', 'No env specified')}`, true);
            this.report.addMessage(``, true);
            this.report.addMessage(`CI Job: ${envs('CI_JOB_URL', '')}`, true);
            this.report.addMessage(`Merge Request: ${envs('CI_MERGE_REQUEST_PROJECT_URL', '')}`, true);
            this.report.addMessage(`User: @${envs('GITHUB_USER_LOGIN', 'No One')}`, true);
            this.report.addMessage(``, true);
            this.report.addMessage(`Startup time (${this.fmtTime(startTime - reporterCreatedTime)})`, true);
        },

        reportFixtureStart (name, path) {
            this.fixtureStartTime =  Date.now();
            this.report.addMessage("", true);
            this.currentFixtureName = name;
            this.report.addMessage(this.currentFixtureName, true);
        },

        reportTestDone (name, testRunInfo) {

            // Errors? Warnings?
            let resultIcon = "";
            if (testRunInfo.errs.length > 0)
                resultIcon = ":red_circle:";
            else if ((testRunInfo.warnings !== null) && (testRunInfo.warnings !== undefined) && (testRunInfo.warnings.length > 0))
                resultIcon = ":large_yellow_circle:";
            else
                resultIcon = ":large_green_circle:";

            // Test Duration
            const durationStr = this.fmtTime(testRunInfo.durationMs);

            let message = resultIcon + " " + name + " (" + durationStr + ")";

            // Unstable?
            if (testRunInfo.unstable)
                message += " (Unstable)";

            this.report.addMessage(message);
            if (this.showErrors && (testRunInfo.errs.length > 0)) {
                let errorStr = "";
                let separator = "";
                testRunInfo. errs.forEach((err, idx) => {
                    errorStr += separator + this.formatError(err, `${idx + 1}) `);
                    separator = "\n";
                });
                this.report.addMessage(errorStr);
            }
        },

        reportTaskDone (endTime, passed, warnings) {

            const durationMs  = endTime - this.startTime;
            const durationStr = this.fmtTime(durationMs);
            let footer = passed === this.testCount ?
                `${this.testCount} passed` :
                `${this.testCount - passed}/${this.testCount} failed`;

            footer = `*${footer}* (Duration: ${durationStr})`;

            this.report.addMessage("", true);
            this.report.addMessage(footer, true);
            
            this.report.sendTaskReport(this.testCount - passed);
        },

        fmtTime(duration) {
            if (duration < 10 * 1000) {
              const seconds = duration / 1000
              return seconds.toFixed(2) + 's'
            }
      
            return this.moment.duration(duration).format('h[h] mm[m] ss[s]')
          }
    }
}
