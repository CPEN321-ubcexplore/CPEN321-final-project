Feature: Welcome to the RestQA community

Scenario: Get the list of useful RestQA resources
Given I have the api gateway hosted on "https://restqa.io"
  And I have the path "/welcome.json"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  """
{
  "documentation": {
    "description": "Access to the official documentation",
    "href": "https://docs.restqa.io"
  },
  "examples": {
    "description": "A series of RestQA implementation examples",
    "href": "https://github.com/restqa/restqa-example"
  },
  "message": "Thank you for installing RestQa, Let's continue our Test Automation together",
  "promotion": {
    "github": {
      "action": "Give us a a star",
      "href": "https://github.com/restqa/restqa"
    },
    "linkedin": {
      "action": "Follow us",
      "href": "https://www.linkedin.com/company/restqa"
    },
    "medium": {
      "action": "Follow us",
      "href": "https://medium.com/restqa"
    },
    "twitter": {
      "action": "Follow us",
      "href": "https://twitter.com/restqa"
    },
    "youtube": {
      "action": "Subscribe to the channel",
      "href": "https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q"
    }
  },
  "sources": {
    "description": "RestQa is Open Source, feel free to contribute",
    "href": "https://github.com/restqa"
  },
  "support": {
    "description": "Please ask and answer questions here.",
    "href": "https://discord.gg/q8pKfsyq67"
  }
}
  """