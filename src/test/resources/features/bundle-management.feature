Feature: Managing Bundles

  Background:
    Given a clean mongo database
    And a fhir client connected to the document service

  Scenario: Should be possible to create a bundle including patient, document reference and binary
    Given a bundle ready to update
    When I create a bundle
    Then a new bundle is created
    And a response including the created bundle is returned to the client

  Scenario: Should be possible to update a bundle including patient and document reference
    Given a number of bundles in mongo
    When I update a bundle
    Then only the corresponding bundle is updated
    And a response including the updated bundle is returned to the client

