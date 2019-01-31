package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.exceptions.InvalidRequestException;
import org.hl7.fhir.dstu3.model.Resource;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import uk.nhs.careconnect.nosql.dao.IComposition;

import java.util.List;

import static org.mockito.Mockito.when;
import static uk.nhs.careconnect.nosql.providers.support.assertions.ResourceAssertions.assertResourceListIsEqual;
import static uk.nhs.careconnect.nosql.providers.support.testdata.CompositionTestData.*;

@RunWith(MockitoJUnitRunner.class)
public class CompositionProviderTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    FhirContext fhirContext;

    @Mock
    IComposition compositionDao;

    @InjectMocks
    CompositionProvider compositionProvider;

    @Test
    public void givenASearchRequestIsMade_withAValidId_shouldReturnAResponse() {
        //setup
        List<Resource> expectedCompositionResourceList = aCompositionList();

        TokenParam resid = new TokenParam(VALID_ID);
        TokenParam identifier = null;
        ReferenceParam patient = null;

        when(compositionDao.search(fhirContext, resid, identifier, patient, null, null)).thenReturn(expectedCompositionResourceList);

        //when
        List<Resource> response = compositionProvider.searchComposition(resid, identifier, patient, null, null);

        //then
        assertResourceListIsEqual(response, expectedCompositionResourceList);
    }

    @Test
    public void givenASearchRequestIsMade_withAnInvalidId_shouldThrowInvalidRequestException() {
        expectedException.expect(InvalidRequestException.class);
        expectedException.expectMessage("_id must be 24 characters");

        TokenParam resid = new TokenParam(INVALID_ID);
        TokenParam identifier = null;

        ReferenceParam patient = null;

        //when
        compositionProvider.searchComposition(resid, identifier, patient, null, null);
    }

}
