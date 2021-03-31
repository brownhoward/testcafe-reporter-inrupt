# TestCafe Reporter Inrupt

This package is a modification of the original [TestCafe Slack reporter](https://www.npmjs.com/package/testcafe-reporter-slack). 

This [TestCafe](http://devexpress.github.io/testcafe) reporter is configurable to:

- Sends test results to the Console and/or Slack.
- Send the report in pieces or as a whole.
- Optionally includes errors.

## Installation

NOTE: This reporter is not yet deployed to npm. To manually install:

1. If necessary, create a `\testcafe-reporter-inrupt` folder in the `\node_modules` folder within the TestCafe project.
2. Copy the `\lib` folder to the `\testcafe-reporter-inrupt` folder.

To install this reporter via npm to your TestCafe project, execute:
```
npm i testcafe-reporter-inrupt
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
| TESTCAFE_REPORT_TOSLACK    | No | false | Should the report be sent to Slack? |
| TESTCAFE_REPORT_INCLUDEHEADER | No | true | Include Header information in report? |
| TESTCAFE_REPORT_INCLUDEFOOTER | No | true | Include Footer information in report? |
| TESTCAFE_REPORT_MERGE | No | false | Should the test results be merged into a single report, or output individually? |
| TESTCAFE_REPORT_SHOWERRORS | No | false | Should detailed error messages be displayed in the report? |
| TESTCAFE_SLACK_WEBHOOK | Yes if reporting to Slack, No otherwise |-| Slack Webhook URL |
| TESTCAFE_SLACK_CHANNEL | No | #testcafe | Name of the Slack channel to which report will be sent |
| TESTCAFE_SLACK_USERNAME | No | testcafebot | Name of the Slack user under which the report will be posted |


An example `.env` file is shown below:
```
TESTCAFE_REPORT_MERGE=true
TESTCAFE_REPORT_SHOWERRORS=true
TESTCAFE_REPORT_TOCONSOLE=true
TESTCAFE_REPORT_TOSLACK=true
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
