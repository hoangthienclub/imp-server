const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANIES,
    "moduleName": "Company",
    "fields": [{
            "label": "Basic Info",
            "inputType": "tab",
            "id": "companyInfo"
        }, {
            "label": "Name",
            "attr": "name",
            "slug": true,
            "inputType": "text"
        }, {
            "label": "Alias Name",
            "attr": "aliasName",
            "inputType": "text",
            "required": false
        }, {
            "label": "Company url",
            "attr": "url",
            "inputType": "url"
        }, {
            "label": "Company Category",
            "attr": "companyCategoryId",
            "inputType": "select_lookup",
            "preload": false,
            "multi": true,
            "lookupFrom": collectionConst.COMPANYCATEGORIES
        }, {
            "label": "Tax Number",
            "attr": "taxNumber",
            "inputType": "number"
        }, {
            "label": "Set Store in Privileges",
            "attr": "isStore",
            "inputType": "checkbox"
        }, {
            "label": "Description",
            "attr": "desc",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "map"
        }, {
            "label": "Industrial Park",
            "attr": "industrialParkId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.INDUSTRIALPARKS,
            "required": false,
            "preload": false
        }, {
            "label": "Association",
            "attr": "associationId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.ASSOCIATIONS,
            "required": false,
            "preload": false
        }, {
            "label": "Phone Number",
            "attr": "phoneNumber",
            "inputType": "tel",
            "required": false
        }, {
            "label": "Fax",
            "attr": "fax",
            "inputType": "tel",
            "required": false
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email",
            "required": false
        }, {
            "label": "Website",
            "attr": "website",
            "inputType": "single",
            "required": false
        }, {
            "label": "Company Tag Code",
            "attr": "codeTagIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.CODETAGS,
            "multi": true,
            "required": false,
            "preload": false
        }, {
            "label": "Logo Image",
            "attr": "logoImageId",
            "inputType": "file",
            "setFeature": true
        }, {
            "label": "Banner Image",
            "attr": "bannerImageId",
            "inputType": "file",
            "required": false
        }, {
            "label": "Gallery Images",
            "attr": "galleryImageIds",
            "inputType": "file",
            "required": false,
            "multi": true
        }, {
            "label": "Registration Info",
            "inputType": "tab",
            "id": "regInfo"
        }, {
            "label": "Registration Number",
            "attr": "registrationNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Registration Date",
            "attr": "registrationDate",
            "inputType": "date",
            "required": false
        }, {
            "label": "Tax Number",
            "attr": "taxNumber",
            "inputType": "number"
        }, {
            "label": "Registered Capital",
            "attr": "registeredCapital",
            "inputType": "number",
            "required": false
        }, {
            "label": "Investerment Number",
            "attr": "investermentNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Total Invested Capital",
            "attr": "totalInvestedCapital",
            "inputType": "number",
            "required": false
        }, {
            "label": "Legal Representative",
            "attr": "legalRepresentative",
            "inputType": "text",
            "required": false
        }, {
            "label": "ID Number",
            "attr": "idLegalRepresentative",
            "inputType": "number",
            "required": false
        }, {
            "label": "Issued on",
            "attr": "issuedOn",
            "inputType": "date",
            "required": false
        }, {
            "label": "Issued Place",
            "attr": "issuedPlace",
            "inputType": "text",
            "required": false
        }, {
            "label": "Business Info",
            "inputType": "tab",
            "id": "businessIntro"
        }, {
            "label": "Legal Structure",
            "attr": "companyLegalStructureId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYLEGALSTRUCTURES,
            "required": false
        }, {
            "label": "Type of Company",
            "attr": "companyTypeId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYTYPES,
            "required": false
        }, {
            "label": "Type of Business",
            "attr": "companyBusinessTypeId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYBUSINESSTYPES,
            "required": false
        }, {
            "label": "Area (m2)",
            "attr": "area",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Trademarks/Brands",
            "attr": "trademarks",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "Original Nationality",
            "attr": "originalNationalityId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPCOUNTRIES,
            "required": false
        }, {
            "label": "Speaking Languages",
            "attr": "speakingLanguages",
            "inputType": "text",
            "required": false
        }, {
            "label": "Employee Size",
            "attr": "employeeSize",
            "inputType": "number",
            "required": false
        }, {
            "label": "Manager Number",
            "attr": "managerNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Office Number",
            "attr": "officeNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Worker Number",
            "attr": "workerNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Female Number",
            "attr": "femaleNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Facebook",
            "attr": "facebook",
            "inputType": "single",
            "required": false
        }, {
            "label": "Twitter",
            "attr": "twitter",
            "inputType": "single",
            "required": false
        }, {
            "label": "Google+",
            "attr": "google",
            "inputType": "single",
            "required": false
        }, {
            "label": "Linkedin",
            "attr": "linkedin",
            "inputType": "single",
            "multi": false,
            "required": false
        }, {
            "label": "Code",
            "inputType": "tab",
            "id": "code"
        }, {
            "label": "VN",
            "attr": "codeVnIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.CODEVNS,
            "required": false,
            "multi": true,
            "preload": false
        }, {
            "label": "NAICS",
            "attr": "codeNaicsIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.CODENAICS,
            "required": false,
            "multi": true,
            "preload": false
        }, {
            "label": "SIC",
            "attr": "codeSicIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.CODESICS,
            "required": false,
            "multi": true,
            "preload": false
        }, {
            "label": "NSO",
            "attr": "codeNsoIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.CODENSOS,
            "required": false,
            "multi": true,
            "preload": false
        }
    ],
    "displayType": "tab",
    "childCollections": [
        collectionConst.COMPANYPRODUCTS, collectionConst.COMPANYCONTACTS,  collectionConst.COMPANYSHAREHOLDERS, collectionConst.COMPANYCERTIFICATES, collectionConst.COMPANYPURCHASINGS, collectionConst.COMPANYSALES,
        collectionConst.COMPANYCUSTOMERS, collectionConst.COMPANYSUPPLIERS, collectionConst.COMPANYFACILITIES, collectionConst.COMPANYMACHINES
    ],
    "editRoute": "index.company.edit",
    "quickChecks": [{
        "label": "Logo",
        "attr": "isCheckLogo"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}