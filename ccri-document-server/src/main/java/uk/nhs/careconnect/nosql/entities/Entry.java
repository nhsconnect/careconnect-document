package uk.nhs.careconnect.nosql.entities;


public class Entry {

    String fullUrl;

    com.mongodb.DBRef object;

    String objectId;

    String originalId;

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getFullUrl() {
        return fullUrl;
    }

    public void setFullUrl(String fullUrl) {
        this.fullUrl = fullUrl;
    }

    public com.mongodb.DBRef getObject() {
        return object;
    }

    public void setObject(com.mongodb.DBRef object) {
        this.object = object;
    }

    public String getOriginalId() {
        return originalId;
    }

    public void setOriginalId(String originalId) {
        this.originalId = originalId;
    }
}
