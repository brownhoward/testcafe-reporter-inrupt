# TestCafe Reporter Inrupt

This package is a modification of [the original slack reporter](https://www.npmjs.com/package/testcafe-reporter-slack).

### testcafe-reporter-inrupt

This is a reporter for [TestCafe](http://devexpress.github.io/testcafe). It sends the output of the test to the console and/or Slack.

## Purpose
Once configured based on a .env file from the folder the tests are run from, the reporter:
- Sends test results to the Console and/or Slack.
- Send the report in pieces or as a whole.
- Optionally includes errors.

## Setup instructions
Follow the instructions below to configure this plugin.
	
First install this package globaly to the machine you would like to run your tests on and then:

## Testing
Running TestCafe with `testcafe-reporter-inrupt`.

In order to use this TestCafe reporter plugin it is necessary to define some `.env` variables in your test project, hence the folder from where your call TestCafe.

- cd into your test project.
- Edit or create the `.env` file by adding the following required variables:

```
TESTCAFE_SLACK_WEBHOOK=https://hooks.slack.com/services/*****
TESTCAFE_SLACK_CHANNEL='#testcafe'
TESTCAFE_SLACK_USERNAME=testcafebot
TESTCAFE_SLACK_DISPLAYMODE='MERGED'
TESTCAFE_REPORT_SHOWERRORS=true
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
