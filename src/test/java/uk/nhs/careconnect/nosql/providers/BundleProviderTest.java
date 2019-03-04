package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.instance.model.api.IIdType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import uk.nhs.careconnect.nosql.dao.IBundle;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.when;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundle;


@RunWith(MockitoJUnitRunner.class)
public class BundleProviderTest {

    private static final Bundle BUNDLE = aBundle();
    private static final Boolean CREATED = true;
    private static final Boolean UPDATED = false;

    private static final String ID = "id-1";
    private static final String OPERATION_OUTCOME_ID = "operation-outcome-id-1";

    private static final OperationOutcome OPERATION_OUTCOME = anOperationOutcome();

    @Mock
    FhirContext fhirContext;

    @Mock
    IBundle bundleDao;

    @InjectMocks
    private BundleProvider bundleProvider;

    @Test
    public void createTest() {
        //setup
        MethodOutcome expectedMethodOutcome = aMethodOutcome(CREATED);

        when(bundleDao.create(fhirContext, BUNDLE, null, null)).thenReturn(aBundleWithOperationOutcome());

        //when
        MethodOutcome actualMethodOutcome = bundleProvider.create(BUNDLE);

        //then
        assertThatMethodOutcomeIsEqual(actualMethodOutcome, expectedMethodOutcome);
    }

    @Test
    public void updateTest() {
        //setup
        IdType bundleId = new IdType().setValue(ID);
        String conditional = "true";

        MethodOutcome expectedMethodOutcome = aMethodOutcome(UPDATED);
        when(bundleDao.update(fhirContext, BUNDLE, bundleId, conditional)).thenReturn(aBundleWithOperationOutcome());

        //when
        MethodOutcome actualMethodOutcome = bundleProvider.update(BUNDLE, bundleId, conditional);

        //then
        assertThatMethodOutcomeIsEqual(actualMethodOutcome, expectedMethodOutcome);
    }

    private Bundle aBundleWithOperationOutcome() {
        return new Bundle()
                .addEntry(new Bundle.BundleEntryComponent().setResource(OPERATION_OUTCOME))
                .addEntry(new Bundle.BundleEntryComponent().setResource(BUNDLE));
    }

    private MethodOutcome aMethodOutcome(Boolean created) {
        return new MethodOutcome()
                .setCreated(created)
                .setId(aIIdType())
                .setOperationOutcome(OPERATION_OUTCOME)
                .setResource(BUNDLE);
    }

    private static IIdType aIIdType() {
        return new IdType()
                .setValue(ID);
    }

    private static OperationOutcome anOperationOutcome() {
        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId(OPERATION_OUTCOME_ID);
        return operationOutcome;
    }

    private void assertThatMethodOutcomeIsEqual(MethodOutcome actual, MethodOutcome expected) {
        assertThat(actual.getCreated(), is(expected.getCreated()));
        assertThat(actual.getOperationOutcome(), is(expected.getOperationOutcome()));
        assertThat(actual.getOperationOutcome().getIdElement(), is(expected.getOperationOutcome().getIdElement()));
        assertThat(actual.getResource(), is(expected.getResource()));
    }

}