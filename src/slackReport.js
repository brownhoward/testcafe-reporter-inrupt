require('dotenv').config();

const envs = require('envs');

module.exports = class slackReport {

    constructor() {

        // Get parameters
        this.mergeReport = ("TRUE" == envs("TESTCAFE_REPORT_SLACK_MERGE", "TRUE").toUpperCase());
        this.showErrors = ("TRUE" == envs("TESTCAFE_REPORT_SLACK_SHOWERRORS", "FALSE").toUpperCase());
        this.includeHeader = ("TRUE" == envs("TESTCAFE_REPORT_SLACK_INCLUDEHEADER", "FALSE").toUpperCase());
        this.includeFooter = ("TRUE" == envs("TESTCAFE_REPORT_SLACK_INCLUDEFOOTER", "TRUE").toUpperCase());

        this.slackWebhook = envs('TESTCAFE_SLACK_WEBHOOK', 'http://example.com');
        this.slackChannel = envs('TESTCAFE_SLACK_CHANNEL', '#testcafe');
        this.slackBot = envs('TESTCAFE_SLACK_BOT', 'testcafebot');

        let slackNode = require('slack-node');
        this.slack = new slackNode();
        this.slack.setWebhook(this.slackWebhook);    

        // Initialize the report
        const report = [];
    }


    showErrors() {
        return this.showErrors;
    }

    
    // Append a message
    addMessage(message) {
        this.report.push(message);
        if (!this.mergeReport) {
            this.sendMessage(this.report.join("\n"));
            this.report = [];
        }
    }


    sendMessage(reportStr, slackProperties = null) {

        this.slack.webhook(Object.assign({
            channel: this.slackChannel,
            username: this.slackBot,
            text: reportStr
        }, slackProperties), function (err, response) {
            if (err) {
                console.log('Unable to send a message to Slack');
                console.log(response);
            }
        })
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
        const textStr = (nrFailedTests > 1)  ? " tests failed" : " test";
        this.sendMessage(reportStr, nrFailedTests > 0
            ? {
                "attachments": [{
                    color: "danger",
                    text: textStr
                }]
            }
            : null
        )
    }
}