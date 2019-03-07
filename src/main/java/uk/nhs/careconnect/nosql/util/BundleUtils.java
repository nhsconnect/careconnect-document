package uk.nhs.careconnect.nosql.util;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.Document;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Bundle.BundleEntryComponent;
import org.hl7.fhir.dstu3.model.Resource;

import java.util.Optional;
import java.util.function.Predicate;

public class BundleUtils {

    private BundleUtils(){

    }

    public static <T extends Resource> Optional<T> extractFirstResourceOfType(Class<T> resourceType, Bundle bundle) {
        return bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(resourceType))
                .map(resourceType::cast)
                .findFirst();
    }

    public static <T extends Resource> T bsonToFhirResource(FhirContext ctx, DBObject bsonBundle, Class<T> resourceType) {
        return ctx.newJsonParser().parseResource(resourceType, bsonBundle.toString());
    }

    public static Bundle bsonBundleToBundle(FhirContext ctx, DBObject bsonBundle) {
        return bsonToFhirResource(ctx, bsonBundle, Bundle.class);
    }

    public static <T> Predicate<? super Resource> resourceOfType(Class<T> resourceClass) {
        return resourceClass::isInstance;
    }

    public static DBObject fhirResourceToDBObject(FhirContext ctx, Resource resource) {
        String resourceJson = filterOutComments(ctx.newJsonParser().encodeResourceToString(resource));

        Document doc = Document.parse(resourceJson);
        DBObject mObj = new BasicDBObject(doc);
        mObj.removeField("id");
        return mObj;
    }

    private static String filterOutComments(String resourceJson) {
        return resourceJson.replaceAll("(?s)<!--.*?-->", "");
    }
}
