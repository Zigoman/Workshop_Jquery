var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

function intialSetup () {
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    scriptProp.setProperty('key', activeSpreadsheet.getId());
}


function doGet(e) {

    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
        var sheet = doc.getSheetByName(sheetName);

        var range = sheet.getDataRange();
        var data = range.getValues();

        var ID = e.parameter.id;
        var userInfo = 'no Data';

        for(var i = 0; i<data.length;i++){
            if(ID && data[i][6] === ID){
                userInfo = data[i];
            }
        }

        var output = JSON.stringify({
            status: 'success',
            message: 'It worked',
            data: userInfo
        });

        return ContentService.createTextOutput(output)
            .setMimeType(ContentService.MimeType.JSON);
    }
    catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON)
    }
    finally {
        lock.releaseLock()
    }
}


function doPost (e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
        var sheet = doc.getSheetByName(sheetName);
        // Get all the data from the sheet
        var data = sheet.getDataRange().getValues();

        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var nextRow = sheet.getLastRow() + 1;
        var IDIndex = headers.indexOf('ID');
        var newRow = headers.map(function(header) {
            return header = e.parameter[header]
        });


        var sheetRow = null;
        // Iterate data, look for the correct row checking the ldap, start from 1 as 0==headers
        for( var i = 1 ; i < data.length; i++ ) {
            var row = data[i];
            if(row[IDIndex] === newRow[IDIndex])
            {
                // You have found the correct row, set + 1 because Sheet range starts from 1, not 0
                sheetRow = i +1;
                // We have found the row, no need to iterate further
                break;
            }
        }

        if (sheetRow) {
            sheet.getRange(sheetRow, 1, 1, newRow.length).setValues([newRow]);
        } else {
            sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
        }

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'old_row': row, 'new_row': newRow, 'place': sheetRow }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    catch (e) {
        return ContentService

            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    finally {
        lock.releaseLock()
    }
}
