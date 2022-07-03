window.RESTQA_RESULT = {
  "id": "4870ea00-f3fd-4824-897b-ed1bae141163",
  "startTime": "2022-07-02T20:33:23-07:00",
  "name": "app",
  "key": "APP",
  "env": "local",
  "duration": null,
  "durationFormat": "Invalid date",
  "timestamp": "2022-07-02T20:33:23-07:00",
  "type": "testSuite",
  "total": 2,
  "success": true,
  "passed": 2,
  "failed": 0,
  "skipped": 0,
  "scenarios": {
    "passed": 3,
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
                "duration": 2000000
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
                "duration": 1000000
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
                "duration": 1000000
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
                "duration": 3193000000
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
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET -H \\\"Content-Type: application/json\\\" --url http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=a\",\"request\":{\"hostname\":\"localhost\",\"port\":\"8081\",\"protocol\":\"http:\",\"pathname\":\"/getMessage\",\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"Content-Type\":\"application/json\",\"x-correlation-id\":\"test-e2e-get-136-1656819197395\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"searchParams\":{\"coordinate_latitude\":\"0\",\"coordinate_longitude\":\"a\"},\"responseType\":\"json\"},\"response\":{\"body\":\"Coordinate longitude is not a number\",\"timing\":3,\"headers\":{\"x-powered-by\":\"Express\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"36\",\"etag\":\"W/\\\"24-D4kTvZoIH4SKJmvee3SNX/+HZ4Q\\\"\",\"date\":\"Sun, 03 Jul 2022 03:33:20 GMT\",\"connection\":\"close\"},\"statusCode\":500,\"request\":{\"path\":\"/getMessage\",\"method\":\"get\",\"prefix\":\"[GET /getMessage?coordinate_latitude=0&coordinate_longitude=a]\"}}}]}",
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
          "duration": 3.202,
          "timestamp": "2022-07-02T20:33:23-07:00",
          "metadata": {
            "id": "4870ea00-f3fd-4824-897b-ed1bae141163",
            "startTime": "2022-07-02T20:33:23-07:00",
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
                "duration": 1000000
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
                "duration": 1000000
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
                "duration": 0
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
                "duration": 3059000000
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
                "duration": 0
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
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET -H \\\"Content-Type: application/json\\\" --url http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=270\",\"request\":{\"hostname\":\"localhost\",\"port\":\"8081\",\"protocol\":\"http:\",\"pathname\":\"/getMessage\",\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"Content-Type\":\"application/json\",\"x-correlation-id\":\"test-e2e-get-642-1656819200594\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"searchParams\":{\"coordinate_latitude\":\"0\",\"coordinate_longitude\":\"270\"},\"responseType\":\"json\"},\"response\":{\"body\":\"Coordinate longitude is not between -180 and 180\",\"timing\":3,\"headers\":{\"x-powered-by\":\"Express\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"48\",\"etag\":\"W/\\\"30-8JMIy09XA7OUvGKOfx8e0+bHU6A\\\"\",\"date\":\"Sun, 03 Jul 2022 03:33:23 GMT\",\"connection\":\"close\"},\"statusCode\":500,\"request\":{\"path\":\"/getMessage\",\"method\":\"get\",\"prefix\":\"[GET /getMessage?coordinate_latitude=0&coordinate_longitude=270]\"}}}]}",
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
          "duration": 3.062,
          "timestamp": "2022-07-02T20:33:23-07:00",
          "metadata": {
            "id": "4870ea00-f3fd-4824-897b-ed1bae141163",
            "startTime": "2022-07-02T20:33:23-07:00",
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
      "duration": 6.263999999999999,
      "timestamp": "2022-07-02T20:33:23-07:00",
      "type": "feature",
      "feature_name": "Generated scenario",
      "metadata": {
        "id": "4870ea00-f3fd-4824-897b-ed1bae141163",
        "startTime": "2022-07-02T20:33:23-07:00",
        "name": "app",
        "key": "APP",
        "env": "local",
        "duration": null,
        "durationFormat": "Invalid date"
      }
    },
    {
      "description": "",
      "elements": [
        {
          "description": "",
          "id": "welcome-to-the-restqa-community;get-the-list-of-useful-restqa-resources",
          "keyword": "Scenario",
          "line": 3,
          "name": "Get the list of useful RestQA resources",
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
              "line": 4,
              "name": "I have the api gateway hosted on \"https://restqa.io\"",
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
              "line": 5,
              "name": "I have the path \"/welcome.json\"",
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
              "keyword": "When ",
              "line": 7,
              "name": "I run the API",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 99000000
              },
              "embeddings": [
                {
                  "data": "curl -X GET --url https://restqa.io/welcome.json",
                  "mime_type": "text/plain"
                }
              ]
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 8,
              "name": "I should receive a response with the status 200",
              "match": {
                "location": "..\\node_modules\\@restqa\\restqapi\\dist\\index.js:1"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [
                {
                  "content": "{\n\"documentation\": {\n  \"description\": \"Access to the official documentation\",\n  \"href\": \"https://docs.restqa.io\"\n},\n\"examples\": {\n  \"description\": \"A series of RestQA implementation examples\",\n  \"href\": \"https://github.com/restqa/restqa-example\"\n},\n\"message\": \"Thank you for installing RestQa, Let's continue our Test Automation together\",\n\"promotion\": {\n  \"github\": {\n    \"action\": \"Give us a a star\",\n    \"href\": \"https://github.com/restqa/restqa\"\n  },\n  \"linkedin\": {\n    \"action\": \"Follow us\",\n    \"href\": \"https://www.linkedin.com/company/restqa\"\n  },\n  \"medium\": {\n    \"action\": \"Follow us\",\n    \"href\": \"https://medium.com/restqa\"\n  },\n  \"twitter\": {\n    \"action\": \"Follow us\",\n    \"href\": \"https://twitter.com/restqa\"\n  },\n  \"youtube\": {\n    \"action\": \"Subscribe to the channel\",\n    \"href\": \"https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q\"\n  }\n},\n\"sources\": {\n  \"description\": \"RestQa is Open Source, feel free to contribute\",\n  \"href\": \"https://github.com/restqa\"\n},\n\"support\": {\n  \"description\": \"Please ask and answer questions here.\",\n  \"href\": \"https://discord.gg/q8pKfsyq67\"\n}\n}",
                  "line": 10
                }
              ],
              "keyword": "And ",
              "line": 9,
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
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET --url https://restqa.io/welcome.json\",\"request\":{\"hostname\":\"restqa.io\",\"port\":\"\",\"protocol\":\"https:\",\"pathname\":\"/welcome.json\",\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"x-correlation-id\":\"test-e2e-get-2-1656819203656\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"responseType\":\"json\"},\"response\":{\"body\":{\"documentation\":{\"description\":\"Access to the official documentation\",\"href\":\"https://docs.restqa.io\"},\"examples\":{\"description\":\"A series of RestQA implementation examples\",\"href\":\"https://github.com/restqa/restqa-example\"},\"message\":\"Thank you for installing RestQa, Let's continue our Test Automation together\",\"promotion\":{\"github\":{\"action\":\"Give us a a star\",\"href\":\"https://github.com/restqa/restqa\"},\"linkedin\":{\"action\":\"Follow us\",\"href\":\"https://www.linkedin.com/company/restqa\"},\"medium\":{\"action\":\"Follow us\",\"href\":\"https://medium.com/restqa\"},\"twitter\":{\"action\":\"Follow us\",\"href\":\"https://twitter.com/restqa\"},\"youtube\":{\"action\":\"Subscribe to the channel\",\"href\":\"https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q\"}},\"sources\":{\"description\":\"RestQa is Open Source, feel free to contribute\",\"href\":\"https://github.com/restqa\"},\"support\":{\"description\":\"Please ask and answer questions here.\",\"href\":\"https://discord.gg/q8pKfsyq67\"}},\"timing\":89,\"headers\":{\"server\":\"nginx/1.19.8\",\"date\":\"Sun, 03 Jul 2022 03:33:12 GMT\",\"content-type\":\"application/json; charset=utf-8\",\"content-length\":\"958\",\"connection\":\"close\",\"expires\":\"Sun, 03 Jul 2022 04:33:12 GMT\",\"cache-control\":\"max-age=3600\"},\"statusCode\":200,\"request\":{\"path\":\"/welcome.json\",\"method\":\"get\",\"prefix\":\"[GET /welcome.json]\"}}}]}",
                  "mime_type": "application/json"
                }
              ]
            }
          ],
          "tags": [],
          "type": "scenario",
          "step_passed": 9,
          "step_failed": 0,
          "step_skipped": 0,
          "step_undefined": 0,
          "result": true,
          "status": "passed",
          "duration": 0.099,
          "timestamp": "2022-07-02T20:33:23-07:00",
          "metadata": {
            "id": "4870ea00-f3fd-4824-897b-ed1bae141163",
            "startTime": "2022-07-02T20:33:23-07:00",
            "name": "app",
            "key": "APP",
            "env": "local",
            "duration": null,
            "durationFormat": "Invalid date"
          }
        }
      ],
      "id": "welcome-to-the-restqa-community",
      "line": 1,
      "keyword": "Feature",
      "tags": [],
      "uri": "D:\\Users\\Akshat Hari\\Desktop\\GitHub\\CPEN321-final-project\\backend\\world\\tests\\integration\\welcome-restqa.feature",
      "total": 1,
      "passed": 1,
      "failed": 0,
      "skipped": 0,
      "undefined": 0,
      "result": true,
      "duration": 0.099,
      "timestamp": "2022-07-02T20:33:23-07:00",
      "type": "feature",
      "feature_name": "Welcome to the RestQA community",
      "metadata": {
        "id": "4870ea00-f3fd-4824-897b-ed1bae141163",
        "startTime": "2022-07-02T20:33:23-07:00",
        "name": "app",
        "key": "APP",
        "env": "local",
        "duration": null,
        "durationFormat": "Invalid date"
      }
    }
  ]
}