# TestCafe Reporter Inrupt

This package is a modification of the original [TestCafe Slack reporter](https://www.npmjs.com/package/testcafe-reporter-slack). 

This [TestCafe](http://devexpress.github.io/testcafe) reporter is configurable to:

- Sends test results to the Console and/or Slack.
- Send the report in pieces or as a whole.
- Optionally includes errors.

## Installation

To install this reporter via npm to your TestCafe project, execute:
```
npm install --save-dev testcafe-reporter-inrupt
```

## Setup
In order to use this TestCafe reporter plugin, it is necessary to add it as your reporter to your TestCafe `.testcaferc.json` configuration file:
```
{
  "reporter": [
    {
      "name": "inrupt"
    }
  ]
}
```

## Configuration

In order to use this TestCafe reporter plugin it is necessary to define some `.env` variables in your test project (i.e., the folder from where your call TestCafe).

- cd into your test project.
- Create or edit the `.env` file by adding the following required variables:

| Variable | Required? | Default | Description |
| -------- | -------- | ------- | ----------- |
| TESTCAFE_REPORT_TOCONSOLE  | No | true | Should the report be sent to the Console? |
| TESTCAFE_REPORT_CONSOLE_INCLUDEHEADER | No | false | Include Header information in Console report? |
| TESTCAFE_REPORT_CONSOLE_MERGE | No | false | Should the test results be merged into a single Console report, or output individually? |
| TESTCAFE_REPORT_CONSOLE_SHOWERRORS | No | true | Should detailed error messages be displayed in the Console report? |
| TESTCAFE_REPORT_TOSLACK    | No | false | Should the report be sent to Slack? |
| TESTCAFE_REPORT_SLACK_INCLUDEHEADER | No | false | Include Header information in Slack report? |
| TESTCAFE_REPORT_SLACK_MERGE | No | true | Should the test results be merged into a single Slack report, or output individually? |
| TESTCAFE_REPORT_SLACK_SHOWERRORS | No | false | Should detailed error messages be displayed in the Slack report? |
| TESTCAFE_SLACK_WEBHOOK | Yes if reporting to Slack, No otherwise |-| Slack Webhook URL |
| TESTCAFE_SLACK_CHANNEL | No | #testcafe | Name of the Slack channel to which report will be sent |
| TESTCAFE_SLACK_USERNAME | No | testcafebot | Name of the Slack user under which the report will be posted |


An example `.env` file is shown below:
```
TESTCAFE_REPORT_TOCONSOLE = true
TESTCAFE_REPORT_CONSOLE_INCLUDEHEADER = true
TESTCAFE_REPORT_CONSOLE_MERGE = false
TESTCAFE_REPORT_CONSOLE_SHOWERRORS = true

TESTCAFE_REPORT_TOSLACK = true
TESTCAFE_REPORT_SLACK_INCLUDEHEADER = false
TESTCAFE_REPORT_SLACK_MERGE = true
TESTCAFE_REPORT_CONSOLE_SHOWERRORS = false
TESTCAFE_SLACK_WEBHOOK=https://hooks.slack.com/services/*****
TESTCAFE_SLACK_CHANNEL='#testcafe'
TESTCAFE_SLACK_USERNAME=testcafebot
```

When you use TestCafe API, you can pass the reporter name to the `reporter()` method:

```js
const inrupt = require('@kevin-inrupt/testcafe-reporter-inrupt')

testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter(inrupt) // <-
    .run();
```

## Further Documentation
[TestCafe Reporter Plugins](https://devexpress.github.io/testcafe/documentation/extending-testcafe/reporter-plugin/)
