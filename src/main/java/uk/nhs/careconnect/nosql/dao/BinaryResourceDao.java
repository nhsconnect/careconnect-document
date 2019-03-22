package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.exceptions.InternalErrorException;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.IdType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public class BinaryResourceDao implements IBinaryResource {

    @Autowired
    protected MongoTemplate mongoTemplate;


    private static final Logger log = LoggerFactory.getLogger(BinaryResourceDao.class);


    @Override
    public Binary save(FhirContext ctx, Binary binary) {

        GridFS gridFS = new GridFS(mongoTemplate.getDb());


        GridFSInputFile gridFSInputFile = gridFS.createFile(binary.getContent());
        gridFSInputFile.setContentType(binary.getContentType());
        gridFSInputFile.save();

        Binary savedBinary = new Binary()
                .setContentType(gridFSInputFile.getContentType());
        savedBinary.setId(gridFSInputFile.get("_id").toString());

        return savedBinary;
    }

    @Override
    public Binary read(FhirContext ctx, IdType theId) {

        GridFS gridFS = new GridFS(mongoTemplate.getDb());
        GridFSDBFile gridFSDBFile = null;
        try {
            gridFSDBFile = gridFS.find(new ObjectId(theId.getIdPart()));
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Document " + theId.getIdPart() + " Not found");
        }

        Binary binary = null;
        if (gridFSDBFile != null) {
            try {
                binary = new Binary();
                binary.setContentType(gridFSDBFile.getContentType());
                binary.setContent(IOUtils.toByteArray(gridFSDBFile.getInputStream()));
            } catch (
                    Exception ex) {
                log.info(ex.getMessage());
                throw new InternalErrorException(ex.getMessage());
            }
        }
        return binary;
    }
}
