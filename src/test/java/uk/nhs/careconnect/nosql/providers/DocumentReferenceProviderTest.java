package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.Bundle;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import uk.nhs.careconnect.nosql.dao.IDocumentReference;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.nhs.careconnect.nosql.providers.support.testdata.CompositionTestData.VALID_ID;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundleWithDocumentReference;

@RunWith(MockitoJUnitRunner.class)
public class DocumentReferenceProviderTest {

    @Mock
    IDocumentReference documentReferenceDao;

    @InjectMocks
    DocumentReferenceProvider documentReferenceProvider;

    @Test
    public void givenASearchRequestIsMade_withAValidRequest_shouldDelegateToDao() {
        //setup
        Bundle expectedBundle = aBundleWithDocumentReference();

        TokenParam resid = new TokenParam(VALID_ID);
        TokenParam identifier = new TokenParam();
        ReferenceParam patient = new ReferenceParam();
        DateRangeParam date = new DateRangeParam();
        TokenOrListParam type = new TokenOrListParam();
        TokenOrListParam setting = new TokenOrListParam();
        DateRangeParam period = new DateRangeParam();

        when(documentReferenceDao.search(resid, identifier, patient, date, type, setting, period)).thenReturn(expectedBundle);

        //when
        Bundle response = documentReferenceProvider.search(resid, identifier, patient, date, type, setting, period);

        //then
        verify(documentReferenceDao).search(any(TokenParam.class), any(TokenParam.class), any(ReferenceParam.class),
                any(DateRangeParam.class), any(TokenOrListParam.class), any(TokenOrListParam.class), any(DateRangeParam.class));
    }

}
