const https = require('https');
const fs = require('fs');
const prompt = require('prompt-sync')();
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//Cat information
const accountId = 'caterpillar.us-1'
const apiKeyId = 'AACE7DA8-9751-4796-95D4-XXXXXXXXXX'
const apiKeySecret = '7PQ1N3uhflDq0vrSNqyDBpmrx--XXXXXXXXXXXXX'


main_init()

async function main_init(){
    var datasetId = 'global_impl'
    var segmentName = ''
    var fileType = 'json'
    var queryValueS = ''
    var queryValueN = ''
    var queryStructure = ''
    
    //-------------*-------------*-------------*-------------*-------------*-------------*-------------*-------------*-------------*-------------*

    console.log('------------*------------*------------*------------*------------*')
    console.log('############ CAT - INTERACTION STUDIO PERSONALIZATION PROJECT ############')
    console.log('Hello, welcome to USER download csv or json, please, read the instructions')
    console.log(`The account that you are working is: ${accountId}`)
    
    var datasetVal = ''
    do {
        console.log('------------*------------*------------*------------*------------*')
        datasetVal = prompt('Select the dataset: 1 -> Cat.com - QA | 2 -> PCC - QA | 3 -> Cat.com - Sandbox | 4 -> PCC - Sandbox :')    
    } while (datasetVal === '');
    
    var fileTypeVal = ''
    do {
        console.log('------------*------------*------------*------------*------------*')
        fileTypeVal = prompt('Dou you want a JSON file or a CSV file? 1 -> JSON | 2 -> CSV :')
    } while (fileTypeVal === '');

    var fileName = ''
    do {
        console.log('------------*------------*------------*------------*------------*')
        fileName = prompt('Name for you file: (Please just use letters and numbers): ')
    } while (fileName === '');

    var recordNumber = ''
    do {
        console.log('------------*------------*------------*------------*------------*')
        recordNumber = prompt('How many records do you want returned? 1-> All || Write the number you want: ')
    } while (recordNumber === '');

    var segmentVal = ''
    do {
        console.log('------------*------------*------------*------------*------------*')
        segmentVal = prompt('Doy you want the information of a segment? 1 -> YES | 2 -> NO: ')
    } while (segmentVal === '');
    
    
    //query structure: ?pageSize=val&filter=val
    if(parseInt(segmentVal) === 1){
        do {
            console.log('------------*------------*------------*------------*------------*')
            segmentName = prompt('Please type the ID of the segment: ')
        } while (segmentName = '');
        queryValueS = 'filter='+ segmentName
    }else if (parseInt(segmentVal) === 2){
        queryValueS = ''
    }
    

    //Dataset name
    if(parseInt(datasetVal) === 1){
        //CAT.COM - QA
        datasetId = 'global_impl'
    }else if(parseInt(datasetVal) === 2){
        //PCC - QA
        datasetId = 'pcc_qa2022'
    }else if ( parseInt(datasetVal) === 3){
        //CAT.COM - SANDBOX
        datasetId = 'cat_qa2020'
    }else if(parseInt(datasetVal) === 4){
        //PCC - SANDBOX
        datasetId = 'qaclone'
    }

    //File type
    if(parseInt(fileTypeVal) === 2){
        //JSON file
        fileType = 'csv'
    }
    
    //Number of records to return
    if(parseInt(recordNumber) === 1){
        queryValueN = ''
    }else{
        queryValueN = 'pageSize='+ parseInt(recordNumber)
    }
    
    
    //Join the query
    if(queryValueS.length > 1 && queryValueN.length > 1){
        queryStructure ='?' + queryValueN + '&' + queryValueS
    }else if (queryValueN.length > 1){
        queryStructure = '?' + queryValueN
    }else if(queryValueS.length > 1){
        queryStructure = '?' + queryValueS
    }
    
    //-------------*-------------*-------------*-------------*-------------*-------------*-------------*-------------*-------------*-------------*

    fetchEvergageData(accountId, datasetId, apiKeyId, apiKeySecret, fileName, fileType, queryStructure)
}

function fetchEvergageData(accountId, datasetId, apiKeyId, apiKeySecret, fileName, fileType, query) {
    var authorizationString = btoa(apiKeyId + ":" + apiKeySecret);
   
    //GET Call Structured 
    var resolution = {
        method: 'GET',
        host: accountId + '.evergage.com',
        port: 443,
        path: 'https://'+ accountId + '.evergage.com/api/dataset/' + datasetId + '/users.' + fileType + ''+ query,
        headers: {
            'Authorization': 'Basic ' + authorizationString,
        }
    }
    console.log(resolution)
    console.log('API Call start here')

    var req = https.request(resolution, function (res) {
        
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", () => {
            var body = Buffer.concat(chunks);
            downloadDocument(String(body), fileName, fileType)
        });

    });
    req.on("error", error => {
        console.error(error);
    });
 
    req.end();
    
}

const downloadDocument = function (data, fileName, fileType) {
    const folderName = 'GeneratedFiles'
    try {
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName);
        }
        fs.writeFile(folderName + '/' + fileName + '.' + fileType, data, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
            console.log('crtl+C to exit')
        });
    } catch (err) {
    console.error(err);
    }
      
    
}