Feature: Document Service

  Background:
    Given a clean mongo database
    And a fhir client connected to the document service

  Scenario: Should be possible to update a bundle including patient and document reference
    Given a number of bundles in mongo
    When I update a bundle
    Then only the corresponding bundle is updated
    And a response including the updated bundle is returned to the client

