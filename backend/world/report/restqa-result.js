window.RESTQA_RESULT = {
  "id": "335f85df-4fe0-4ab7-a12a-9cb3c2f17279",
  "startTime": "2022-07-02T21:07:58-07:00",
  "name": "app",
  "key": "APP",
  "env": "local",
  "duration": null,
  "durationFormat": "Invalid date",
  "timestamp": "2022-07-02T21:07:58-07:00",
  "type": "testSuite",
  "total": 1,
  "success": true,
  "passed": 1,
  "failed": 0,
  "skipped": 0,
  "scenarios": {
    "passed": 2,
    "failed": 0,
    "skipped": 0,
    "undefined": 0
  },
  "features": [
    {
      "description": "",
      "elements": [
        {
          "description": "",
          "id": "generated-scenario;test-on-get-http://localhost:8081/getmessage?coordinate_latitude=0&coordinate_longitude=a",
          "keyword": "Scenario",
          "line": 3,
          "name": "Test on GET http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=a",
          "steps": [
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 4,
              "name": "I have the api gateway hosted on \"http://localhost:8081\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 5,
              "name": "I have the path \"/getMessage\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 6,
              "name": "I have the method \"GET\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 7,
              "name": "the header contains \"Content-Type\" as \"application/json\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 8,
              "name": "the query parameter contains \"coordinate_latitude\" as \"0\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 9,
              "name": "the query parameter contains \"coordinate_longitude\" as \"a\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 10,
              "name": "I run the API",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 3100000000
              },
              "embeddings": [
                {
                  "data": "curl -X GET -H \"Content-Type: application/json\" --url http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=a",
                  "mime_type": "text/plain"
                }
              ]
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 11,
              "name": "I should receive a response with the status 500",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [
                {
                  "content": "\"Coordinate longitude is not a number\"",
                  "line": 13
                }
              ],
              "keyword": "And ",
              "line": 12,
              "name": "the response body should be equal to:",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "keyword": "After",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              },
              "embeddings": [
                {
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET -H \\\"Content-Type: application/json\\\" --url http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=a\",\"request\":{\"hostname\":\"localhost\",\"port\":\"8081\",\"protocol\":\"http:\",\"pathname\":\"/getMessage\",\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"Content-Type\":\"application/json\",\"x-correlation-id\":\"test-e2e-get-458-1656821272399\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"searchParams\":{\"coordinate_latitude\":\"0\",\"coordinate_longitude\":\"a\"},\"responseType\":\"json\"},\"response\":{\"body\":\"Coordinate longitude is not a number\",\"timing\":3,\"headers\":{\"x-powered-by\":\"Express\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"36\",\"etag\":\"W/\\\"24-D4kTvZoIH4SKJmvee3SNX/+HZ4Q\\\"\",\"date\":\"Sun, 03 Jul 2022 04:07:55 GMT\",\"connection\":\"close\"},\"statusCode\":500,\"request\":{\"path\":\"/getMessage\",\"method\":\"get\",\"prefix\":\"[GET /getMessage?coordinate_latitude=0&coordinate_longitude=a]\"}}}]}",
                  "mime_type": "application/json"
                }
              ]
            }
          ],
          "tags": [],
          "type": "scenario",
          "step_passed": 12,
          "step_failed": 0,
          "step_skipped": 0,
          "step_undefined": 0,
          "result": true,
          "status": "passed",
          "duration": 3.106,
          "timestamp": "2022-07-02T21:07:58-07:00",
          "metadata": {
            "id": "335f85df-4fe0-4ab7-a12a-9cb3c2f17279",
            "startTime": "2022-07-02T21:07:58-07:00",
            "name": "app",
            "key": "APP",
            "env": "local",
            "duration": null,
            "durationFormat": "Invalid date"
          }
        },
        {
          "description": "",
          "id": "generated-scenario;test-on-get-http://localhost:8081/getmessage?coordinate_latitude=0&coordinate_longitude=270",
          "keyword": "Scenario",
          "line": 20,
          "name": "Test on GET http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=270",
          "steps": [
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 21,
              "name": "I have the api gateway hosted on \"http://localhost:8081\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 22,
              "name": "I have the path \"/getMessage\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 23,
              "name": "I have the method \"GET\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 24,
              "name": "the header contains \"Content-Type\" as \"application/json\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 25,
              "name": "the query parameter contains \"coordinate_latitude\" as \"0\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 26,
              "name": "the query parameter contains \"coordinate_longitude\" as \"270\"",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 27,
              "name": "I run the API",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 3139000000
              },
              "embeddings": [
                {
                  "data": "curl -X GET -H \"Content-Type: application/json\" --url http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=270",
                  "mime_type": "text/plain"
                }
              ]
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 28,
              "name": "I should receive a response with the status 500",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [
                {
                  "content": "\"Coordinate longitude is not between -180 and 180\"",
                  "line": 30
                }
              ],
              "keyword": "And ",
              "line": 29,
              "name": "the response body should be equal to:",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "keyword": "After",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              },
              "embeddings": [
                {
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET -H \\\"Content-Type: application/json\\\" --url http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=270\",\"request\":{\"hostname\":\"localhost\",\"port\":\"8081\",\"protocol\":\"http:\",\"pathname\":\"/getMessage\",\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"Content-Type\":\"application/json\",\"x-correlation-id\":\"test-e2e-get-431-1656821275513\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"searchParams\":{\"coordinate_latitude\":\"0\",\"coordinate_longitude\":\"270\"},\"responseType\":\"json\"},\"response\":{\"body\":\"Coordinate longitude is not between -180 and 180\",\"timing\":4,\"headers\":{\"x-powered-by\":\"Express\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"48\",\"etag\":\"W/\\\"30-8JMIy09XA7OUvGKOfx8e0+bHU6A\\\"\",\"date\":\"Sun, 03 Jul 2022 04:07:58 GMT\",\"connection\":\"close\"},\"statusCode\":500,\"request\":{\"path\":\"/getMessage\",\"method\":\"get\",\"prefix\":\"[GET /getMessage?coordinate_latitude=0&coordinate_longitude=270]\"}}}]}",
                  "mime_type": "application/json"
                }
              ]
            }
          ],
          "tags": [],
          "type": "scenario",
          "step_passed": 12,
          "step_failed": 0,
          "step_skipped": 0,
          "step_undefined": 0,
          "result": true,
          "status": "passed",
          "duration": 3.142,
          "timestamp": "2022-07-02T21:07:58-07:00",
          "metadata": {
            "id": "335f85df-4fe0-4ab7-a12a-9cb3c2f17279",
            "startTime": "2022-07-02T21:07:58-07:00",
            "name": "app",
            "key": "APP",
            "env": "local",
            "duration": null,
            "durationFormat": "Invalid date"
          }
        }
      ],
      "id": "generated-scenario",
      "line": 1,
      "keyword": "Feature",
      "tags": [],
      "uri": "D:\\Users\\Akshat Hari\\Desktop\\GitHub\\CPEN321-final-project\\backend\\world\\tests\\integration\\message.feature",
      "total": 2,
      "passed": 2,
      "failed": 0,
      "skipped": 0,
      "undefined": 0,
      "result": true,
      "duration": 6.247999999999999,
      "timestamp": "2022-07-02T21:07:58-07:00",
      "type": "feature",
      "feature_name": "Generated scenario",
      "metadata": {
        "id": "335f85df-4fe0-4ab7-a12a-9cb3c2f17279",
        "startTime": "2022-07-02T21:07:58-07:00",
        "name": "app",
        "key": "APP",
        "env": "local",
        "duration": null,
        "durationFormat": "Invalid date"
      }
    }
  ]
}