package uk.nhs.careconnect.nosql.providers;

import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import uk.nhs.careconnect.nosql.dao.IDocumentReference;

@RunWith(MockitoJUnitRunner.class)
public class DocumentReferenceProviderTest {

    @Mock
    IDocumentReference documentReferenceDao;

    @InjectMocks
    DocumentReferenceProvider documentReferenceProvider;


    /*

    TODO 16/JUNE/2019
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
        List<Resource> resources = documentReferenceProvider.search(resid, identifier, patient, date, type, setting, period);

        //then
        verify(documentReferenceDao).search(any(TokenParam.class), any(TokenParam.class), any(ReferenceParam.class),
                any(DateRangeParam.class), any(TokenOrListParam.class), any(TokenOrListParam.class), any(DateRangeParam.class));
    }

     */

}
