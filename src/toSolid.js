require('dotenv').config();
const envs = require('envs');

module.exports = class toSolid {

    constructor() {

        // Output Dictionary
        this.output = {};
        this.output["header"] = {};
        this.output["fixtures"] = {};
        this.output["footer"] = {};
    }


    // Append a Header element
    addHeaderElement(message, value) {
        const header = this.output["header"];
        header[message] = value;
    }


    // Append a Footer element
    addFooterElement(message, value) {
        const footer = this.output["footer"];
        footer[message] = value;
    }


    // Add Test Results
    addTestResults(fixtureName, testName, testResult, durationStr) {

        const fixtures = this.output["fixtures"];

        // Get Fixture
        if (false == (fixtureName in fixtures)) {
            fixtures[fixtureName] = {};
        }
        const fixture = fixtures[fixtureName];

        // Store the test results
        const test = {};
        test["result"] = testResult;
        test["duration"] = durationStr;
        fixture[testName] = test;
    }


    // Write the output to a Solid Pod
    write() {

        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", "https://broker.pod.inrupt.com/token", false, clientID, clientSecret);
        // xmr.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         var myArr = JSON.parse(this.responseText);
        //         myFunction(myArr);
        //     }
        // };
        // # Get the Access Token
        // try:
        //     response = requests.post(tokenEndpoint, data = {"grant_type": "client_credentials"}, auth = (clientID, clientSecret)).json()
        //     return response["access_token"]
        // except:
        //     raise SolidClientError(403, "Failed to get Access Token from IdP Broker")

        // //Send the proper header information along with the request
        // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        // xhr.send(params);

        // var data = `{
        // "Id": 78912,
        // "Customer": "Jason Sweet",
        // "Quantity": 1,
        // "Price": 18.00
        // }`;

        // xhr.send(data);
        // // Log into Pod

        // Write
        const myJSON = JSON.stringify(this.output);
        console.log(myJSON);

    }
}