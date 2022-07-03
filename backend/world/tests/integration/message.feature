Feature: Generated scenario

Scenario: Test on GET http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=a
Given I have the api gateway hosted on "http://localhost:8081"
  And I have the path "/getMessage"
  And I have the method "GET"
  And the header contains "Content-Type" as "application/json"
  And the query parameter contains "coordinate_latitude" as "0"
  And the query parameter contains "coordinate_longitude" as "a"
When I run the API
Then I should receive a response with the status 500
  And the response body should be equal to:
  """
"Coordinate longitude is not a number"
  """




Scenario: Test on GET http://localhost:8081/getMessage?coordinate_latitude=0&coordinate_longitude=270
Given I have the api gateway hosted on "http://localhost:8081"
  And I have the path "/getMessage"
  And I have the method "GET"
  And the header contains "Content-Type" as "application/json"
  And the query parameter contains "coordinate_latitude" as "0"
  And the query parameter contains "coordinate_longitude" as "270"
When I run the API
Then I should receive a response with the status 500
  And the response body should be equal to:
  """
"Coordinate longitude is not between -180 and 180"
  """




