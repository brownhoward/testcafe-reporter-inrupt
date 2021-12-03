require('dotenv').config();

const chalk = require('chalk');
const envs = require('envs');

module.exports = class consoleReport {

    constructor() {

        // Store parameters
        this.mergeReport = ("TRUE" == envs("TESTCAFE_REPORT_CONSOLE_MERGE", "FALSE").toUpperCase());
        this.includeErrors = ("TRUE" == envs("TESTCAFE_REPORT_CONSOLE_SHOWERRORS", "TRUE").toUpperCase());
        this.includeHeader = ("TRUE" == envs("TESTCAFE_REPORT_CONSOLE_INCLUDEHEADER", "FALSE").toUpperCase());

        // Blank Report
        this.report = [];
    }


    showErrors() {
        return this.includeErrors;
    }

    
    // Append a message
    addMessage(message) {
        this.report.push(message);
        if (!this.mergeReport) {
            this.sendMessage(this.report.join("\n"));
            this.report = [];
        }
    }


    // Add Errors
    addErrors(testRunInfo) {

        if (false == this.includeErrors)
            return;

        // Any errors to display?
        if (0 == testRunInfo.errs.length)
            return;
            
        // Build the error text
        let errorStr = "";
        let separator = "";
        testRunInfo. errs.forEach((err, idx) => {
            errorStr += separator + this.formatError(err, `${idx + 1}) `);
            separator = "\n";
        });
            
        this.addMessage(errorStr);
    }


    sendMessage(reportStr) {

        // Set icons
        let consoleReportStr = reportStr.replace(/:red_circle:/g, chalk.red("X"));
        consoleReportStr = consoleReportStr.replace(/:white_circle:/g, "-");
        consoleReportStr = consoleReportStr.replace(/:large_yellow_circle:/g, chalk.yellow("?"));
        consoleReportStr = consoleReportStr.replace(/:large_green_circle:/g, chalk.green("√"));

        // Output
        console.log(consoleReportStr);
    }


    sendFixtureReport() {
        if (!this.mergeReport && this.report.length > 0) {
            const reportStr = this.report.join("\n");
            this.sendMessage(reportStr);
            this.report = [];
        }
    }


    sendTaskReport(nrFailedTests) {
        const reportStr = this.report.join("\n");
        const textStr = (nrFailedTests > 1)  ? " tests failed" : " test failed";
        this.sendMessage(reportStr);
        // this.sendMessage(reportStr, nrFailedTests > 0
        //     ? {
        //         "attachments": [{
        //             color: "danger",
        //             text: textStr
        //         }]
        //     }
        //     : null
        // )
    }
}