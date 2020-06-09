/*
const NextcloudImporter = require(_$+`helpers/nextcloud/importer`)

module.exports = {
    happyPath(){
        let importer = new NextcloudImporter('123'); // userid 123,
    
        // deep clone members so we do't pollute across tests (mocha does not isolate) 
        importer.profileLogic = Object.assign({}, importer.profileLogic);
        importer.httputils = Object.assign({}, importer.httputils);
        importer.log = Object.assign({}, importer.log);


        // replace profile logic, return an object with valid nextcloud source
        importer.mockProfile = { sources : { nextcloud : { 
            indexes : [],
        }}};
        importer.profileLogic.getById =()=>{ return importer.mockProfile }
        importer.profileLogic.update =(profile )=>{ importer.mockProfile = profile }

        // default status code is success
        importer.mockPostResponse = { 
            raw : { 
                statusCode : 200 
            } 
        };
        importer.httputils.post =()=>{ return importer.mockPostResponse };

        importer.mockPostUrlStringResponse = {};
        importer.httputils.postUrlString =()=>{ return importer.mockPostUrlStringResponse };

        // kill logging, it's not important
        importer.log.create =()=>{}; 
        return importer;
    }
}
*/