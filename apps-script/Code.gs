/**
 * SatyaCheck Google Apps Script Web App
 * Handles waitlist signups and bank/telco pilot requests.
 *
 * HOW IT WORKS:
 * 1. Creates/uses two tabs in your Google Sheet: "Waitlist" and "Pilots"
 * 2. Parses incoming POST requests (supports text/plain to avoid preflight CORS issues)
 * 3. Appends formatted submissions with server timestamps
 * 4. Returns JSON response
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!sheet) {
      return createJsonResponse({ status: 'error', message: 'No active spreadsheet found' }, 500);
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var type = data.type || 'waitlist';
    var serverTimestamp = new Date();

    if (type === 'pilot') {
      // Handle Bank & Telco Pilot Submission
      var pilotSheet = getOrCreateSheet(sheet, 'Pilots', [
        'Timestamp',
        'Name',
        'Organisation',
        'Role',
        'Email',
        'Client Timestamp'
      ]);

      pilotSheet.appendRow([
        serverTimestamp,
        data.name || '',
        data.organisation || '',
        data.role || '',
        data.email || '',
        data.timestamp || ''
      ]);

      return createJsonResponse({ status: 'success', type: 'pilot', message: 'Pilot request saved' }, 200);

    } else {
      // Default: Handle Waitlist Submission
      var waitlistSheet = getOrCreateSheet(sheet, 'Waitlist', [
        'Timestamp',
        'Name',
        'Contact (Phone / Email)',
        'City',
        'Role / Identity',
        'Personal Story',
        'Client Timestamp'
      ]);

      waitlistSheet.appendRow([
        serverTimestamp,
        data.name || '',
        data.contact || '',
        data.city || '',
        data.role || '',
        data.story || '',
        data.timestamp || ''
      ]);

      return createJsonResponse({ status: 'success', type: 'waitlist', message: 'Waitlist signup saved' }, 200);
    }

  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper to get or initialize a sheet tab with headers
 */
function getOrCreateSheet(spreadsheet, sheetName, headers) {
  var targetSheet = spreadsheet.getSheetByName(sheetName);
  if (!targetSheet) {
    targetSheet = spreadsheet.insertSheet(sheetName);
    targetSheet.appendRow(headers);
    // Format header row
    var headerRange = targetSheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#FDFAE7');
    headerRange.setFontColor('#1E2BFA');
  }
  return targetSheet;
}

/**
 * Returns formatted JSON output
 */
function createJsonResponse(outputObject, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(outputObject))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle GET for health-check testing
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'active', message: 'SatyaCheck Apps Script Endpoint is running.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
