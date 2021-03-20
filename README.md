# TestCafe Reporter Slack

This package is a modification of [the updated Slack reporter](https://www.npmjs.com/package/@trint/testcafe-reporter-slack) which was forked from [the original slack reporter](https://www.npmjs.com/package/testcafe-reporter-slack).

We don't think there's much value on sending the error message to slack, as it polutes the channel and we won't be debugging the code there.

We also changed the emojis - from `:heavy_check_mark:` and `:heavy_multiplication_x:` to `:white_check_mark:` and `:red_circle:`. Reason being that it's imediately noticable which tests failed and which tests passed.

More variables: we show which environment the tests are running against, and we also show a link to the gitlab pipeline that trigger the tests to run.

### testcafe-reporter-slack

This is a reporter for [TestCafe](http://devexpress.github.io/testcafe). It sends the output of the test to slack.

## Purpose
Once configured the repoter sends test results to Slack depending on a .env file from the folder the tests are run from

## Setup instructions
Follow the instructions bellow to configure this plugin.
	
First install this package globaly to the machine you would like to run your tests on and then:

## Testing
Running TestCafe with `testcafe-reporter-slack`.

In order to use this TestCafe reporter plugin it is necessary to define some `.env` variables in your test project, hence the folder from where your call TestCafe.

- cd into your test project.
- Edit or create the `.env` file by adding the following required variables:

```
TESTCAFE_SLACK_WEBHOOK=https://hooks.slack.com/services/*****
TESTCAFE_SLACK_CHANNEL='#testcafe'
TESTCAFE_SLACK_USERNAME=testcafebot
TESTCAFE_SLACK_DISPLAYMODE='MERGED'
```

When you use TestCafe API, you can pass the reporter name to the `reporter()` method:

```js
const slack = require('@kevin-inrupt/testcafe-reporter-slack')

testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter(slack) // <-
    .run();
```

## Further Documentation
[TestCafe Reporter Plugins](https://devexpress.github.io/testcafe/documentation/extending-testcafe/reporter-plugin/)
