Feature: Managing Binary Resources

  Background:
    Given a clean mongo database
    And a fhir client connected to the document service

  Scenario: Should be possible to retrieve a binary resource
    Given a binary bundle saved in mongo
    When I request a binary
    Then a binary is returned

  Scenario: Should be possible to retrieve a fhir document as a binary resource
    Given a fhir document bundle saved in mongo
    When I request a binary
    Then a fhir document is returned

  @WIP
  Scenario: Should be possible to create a binary resource

