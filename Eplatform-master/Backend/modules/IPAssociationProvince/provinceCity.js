const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.PROVINCECITIES,
    "moduleName": "Province City",
    "fields": [
        {
            "label": "Name",
            "attr": "name",
            "inputType": "text",
            "slug" : true
        }, {
            "label": "Url",
            "attr": "url",
            "inputType": "url"
        }, {
            "label": "Total Area (km2)",
            "attr": "totalArea",
            "inputType": "decimal"
        }, {
            "label": "Province",
            "attr": "provinceId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPPROVINCES
        }, {
            "label": "Website",
            "attr": "website",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Agricultural Production Land (km2/ha)",
            "attr": "agriculturalProductionLand",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Foresty Land (km2/ha)",
            "attr": "forestyLand",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Specially Used Land (km2/ha)",
            "attr": "speciallyUsedLand",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Homestead Land (km2/ha)",
            "attr": "homesteadLand",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Coastline",
            "attr": "coastline",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Borders",
            "attr": "borders",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Climate",
            "attr": "climate",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Natural Resources",
            "attr": "naturalResources",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Environmental Issues",
            "attr": "environmentalIssues",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Region",
            "attr": "RegionId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPREGIONS
        }, {
            "label": "Economic Structures",
            "attr": "economicStructures",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Total GDP",
            "attr": "totalGDP",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "GDP Rank",
            "attr": "gdpRank",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "GDP Per Capital",
            "attr": "gdpPerCapital",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "GDP Growth Rate",
            "attr": "gdpGrowthRate",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "GDP By Selector",
            "attr": "gdpBySelector",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Inflation",
            "attr": "inflation",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Population",
            "attr": "population",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Average Population",
            "attr": "averagePopulation",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Population By Sex",
            "attr": "populationBySex",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Population By Residence",
            "attr": "populationByResidence",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Natural Increase Rate Of Population",
            "attr": "naturalIncreaseRateOfPopulation",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Inmigration Rate",
            "attr": "inmigrationRate",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Emmigration Rate",
            "attr": "emmigrationRate",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Labor Force",
            "attr": "laborForce",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Labour Force At 15 Years Of Age And Above",
            "attr": "labourForceAt15YearsOfAgeAndAbove",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "unemployment",
            "attr": "unemployment",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "mainIndustries",
            "attr": "mainIndustries",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Total Export Earnings",
            "attr": "totalExport",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Export Goods",
            "attr": "exportGoods",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "Total Import Earnings",
            "attr": "totalImport",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Import Goods",
            "attr": "importGoods",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Number of Active Enterprises",
            "attr": "numberOfActingEnterprises",
            "inputType": "number",
            "required": false
        }, {
            "label": "Size of Employees",
            "attr": "sizeOfEmployees",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Size Of Capital",
            "attr": "sizeOfCapital",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Annual Average Capital Of Enterprises",
            "attr": "annualAverageCapitalOfEnterprises",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Net Turnover",
            "attr": "netTurnover",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Profit Before Taxes",
            "attr": "profitBeforeTaxes",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Profit Rate",
            "attr": "profitRate",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "FDI",
            "attr": "FDI",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Number Of Project",
            "attr": "numberOfProject",
            "inputType": "number",
            "required": false
        }, {
            "label": "Total Registered Capital",
            "attr": "totalRegisteredCapital",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "PCI",
            "attr": "PCI",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "IIP",
            "attr": "IIP",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Energy",
            "attr": "energy",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Transportation",
            "attr": "transportation",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Telecommunications",
            "attr": "telecommunications",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Water Supply",
            "attr": "waterSupply",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Electric Supply",
            "attr": "electricSupply",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Provincial Party Commitee",
            "attr": "provincialPartyCommitee",
            "inputType": "text",
            "required": false
        }, {
            "label": "Peoples Council",
            "attr": "peoplesCouncil",
            "inputType": "text",
            "required": false
        }, {
            "label": "Peoples Commitee",
            "attr": "peoplesCommitee",
            "inputType": "text",
            "required": false
        }, {
            "label": "Relevant Government Departments",
            "attr": "relevantGovernmentDepartments",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Headquarters Committee",
            "attr": "headquartersCommittee",
            "inputType": "text",
            "required": false
        }, {
            "label": "Tourism",
            "attr": "tourism",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Ethnic",
            "attr": "ethnic",
            "inputType": "text",
            "required": false
        }, {
            "label": "Language",
            "attr": "language",
            "inputType": "text",
            "required": false
        }, {
            "label": "Education",
            "attr": "education",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Science And Technology",
            "attr": "scienceAndTechnology",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Hospital And Medical Centres",
            "attr": "hospitalAndMedicalCentres",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Fine Arts",
            "attr": "fineArts",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Housing",
            "attr": "housing",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Marriage (%)",
            "attr": "marriage",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Divorce (%)",
            "attr": "divorce",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Logo",
            "attr": "logoImageId",
            "inputType": "file",
            "required": false
        }, {
            "label": "Gallery Image",
            "attr": "imageIds",
            "inputType": "file",
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}