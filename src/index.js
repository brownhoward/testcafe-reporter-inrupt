const report = require("./report");
const envs = require("envs");
const { strictEqual } = require("assert");

module.exports = function () {

    const reporterCreatedTime = Date.now();

    return {

        noColors: true,

        // Executed prior to the start of the test run
        reportTaskStart (startTime, userAgents, testCount) {

            // Create the new Report
            this.report = new report();

            this.startTime = startTime;
            this.testCount = testCount;

            // Output header
            this.report.addMessage(`Date/Time: ${startTime}`);
            this.report.addMessage(`Environment: ${userAgents}`);
            if (this.includeHeader) {

                // Output the Report header
                this.report.addMessage(`Against: ${envs('ENV', 'No env specified')}`);
                this.report.addMessage(``);
                this.report.addMessage(`CI Job: ${envs('CI_JOB_URL', '')}`);
                this.report.addMessage(`Merge Request: ${envs('CI_MERGE_REQUEST_PROJECT_URL', '')}`);
                this.report.addMessage(`User: @${envs('GITHUB_USER_LOGIN', 'No One')}`);
                this.report.addMessage(``);
                this.report.addMessage(`Startup time (${this.fmtTime(startTime - reporterCreatedTime)})`);
            }
        },


        // Executed prior to a Fixture starting
        reportFixtureStart (name, path, meta) {
            this.fixtureStartTime =  Date.now();
            this.report.addMessage("");
            this.currentFixtureName = name;
            this.report.addMessage(this.currentFixtureName);
        },


        // Executed when an individual Test has ended
        reportTestDone (name, testRunInfo, meta) {

            // Test Duration
            const durationStr = this.fmtTime(testRunInfo.durationMs);

            // Errors? Warnings?
            let resultIcon = "";
            if (testRunInfo.errs.length > 0)
                resultIcon = ":red_circle:";
            else if (testRunInfo.skippedCount > 0)
                resultIcon = ":white_circle:";
            else if (((testRunInfo.warnings !== null) && 
                     (testRunInfo.warnings !== undefined) && 
                     (testRunInfo.warnings.length > 0)) ||
                     (testRunInfo.unstable))
                resultIcon = ":large_yellow_circle:";
            else
                resultIcon = ":large_green_circle:";

            // Test Result
            let message = resultIcon + " " + name + " (" + durationStr + ")";

            // Unstable?
            if (testRunInfo.unstable)
                message += " (unstable)";

            // Append to Report
            this.report.addMessage(message);

            // Any errors to display?
            if (0 < testRunInfo.errs.length) {
        
                // Build the error text
                let errorStr = "";
                let separator = "";
                testRunInfo. errs.forEach((err, idx) => {
                    errorStr += separator + this.formatError(err, `${idx + 1}) `);
                    separator = "\n";
                });

                this.report.addErrors(errorStr);
            }
        },


        // Executed when all of the tests have been executed
        reportTaskDone (endTime, passed, warnings, result) {

            const durationMs  = endTime - this.startTime;
            const durationStr = this.fmtTime(durationMs);
            let footer = result.failedCount ?
                `${result.failedCount}/${this.testCount} failed` :
                `${result.passedCount} passed`;

            footer += ` (Duration: ${durationStr})`;
            footer += ` (Skipped: ${result.skippedCount})`;
            footer += ` (Warnings: ${warnings.length})`;

            this.report.addMessage("");
            this.report.addMessage(footer);
            this.report.sendTaskReport(this.testCount - passed);
        },


        // Format Duration
        fmtTime(duration) {
            if (duration < 10 * 1000) {
              const seconds = duration / 1000
              return seconds.toFixed(2) + 's'
            }
      
            return this.moment.duration(duration).format('h[h] mm[m] ss[s]')
          }
    }
}
