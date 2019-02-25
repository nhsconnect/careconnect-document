package uk.nhs.careconnect.nosql.util;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.DBObject;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Resource;

import java.util.Optional;

public class BundleUtils {

    private BundleUtils(){

    }

    public static <T extends Resource> Optional<T> extractFirstResourceOfType(Class<T> resourceType, Bundle bundle) {
        return bundle.getEntry().stream()
                .filter(entry ->  resourceType.isInstance(entry.getResource()))
                .map(resource -> (T)resource.getResource())
                .findFirst();
    }

    public static <T extends Resource> T bsonToFhirResource(FhirContext ctx, DBObject bsonBundle, Class<T> resourceType) {
        return ctx.newJsonParser().parseResource(resourceType, bsonBundle.toString());
    }

    public static Bundle bsonBundleToBundle(FhirContext ctx, DBObject bsonBundle) {
        return bsonToFhirResource(ctx, bsonBundle, Bundle.class);
    }

}
