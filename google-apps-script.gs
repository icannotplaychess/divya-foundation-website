/**
 * Divya Foundation — website form receiver (Google Apps Script)
 * ---------------------------------------------------------------
 * Saves every form sent from the website into this Google Sheet:
 *   - "Applications"       ← Apply for Support form
 *   - "Donation enquiries" ← Donate / Support Us pop-up
 *   - "Contact messages"   ← Contact page form
 * and emails a short alert (no sensitive details) to NOTIFY_EMAIL.
 *
 * Setup steps are in SETUP-google-sheet.md.
 */

var NOTIFY_EMAIL = "divyafoundation.nsk@gmail.com"; // who gets the "new submission" email ("" = no email)

var SHEETS = {
  application: "Applications",
  donation: "Donation enquiries",
  contact: "Contact messages",
};

// Extra columns added to the Applications sheet for the team's own use (office-use section of the paper form)
var OFFICE_COLUMNS = ["Status", "Received by", "Verified by", "Verification notes", "Decision", "Assistance given", "Follow-up date"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = (e && e.parameter) || {};
    if (p.website) return reply("ok"); // spam trap field filled in by bots

    var type = SHEETS[p.form] ? p.form : "contact";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEETS[type]) || ss.insertSheet(SHEETS[type]);

    // keys sent by the website, in a sensible order
    var keys = Object.keys(p).filter(function (k) { return k !== "form" && k !== "website"; });
    var first = ["applicationNo", "submittedAt"].filter(function (k) { return keys.indexOf(k) > -1; });
    keys = first.concat(keys.filter(function (k) { return first.indexOf(k) === -1; }));

    // header row: create on first use, add any new columns at the end
    var header = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (!header.length) {
      header = keys.slice();
      if (type === "application") header = header.concat(OFFICE_COLUMNS);
      sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold").setBackground("#e3edff");
      sheet.setFrozenRows(1);
    } else {
      keys.forEach(function (k) {
        if (header.indexOf(k) === -1) { header.push(k); sheet.getRange(1, header.length).setValue(k).setFontWeight("bold").setBackground("#e3edff"); }
      });
    }

    var row = header.map(function (h) {
      if (h === "Status" && type === "application") return "New";
      var v = p[h] == null ? "" : String(p[h]).slice(0, 5000);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // stop text being treated as a formula
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      var who = p.fullName || p.name || "Someone";
      var subject = type === "application"
        ? "New application " + (p.applicationNo || "") + " — " + who
        : (type === "donation" ? "New donation enquiry — " : "New contact message — ") + who;
      MailApp.sendEmail(NOTIFY_EMAIL, subject,
        "A new " + SHEETS[type].toLowerCase().replace(/s$/, "") + " was submitted on the website.\n\n" +
        (p.assistanceType ? "Assistance requested: " + p.assistanceType + "\n" : "") +
        "Open the sheet to see the full details:\n" + ss.getUrl());
    }
    return reply("ok");
  } catch (err) {
    return reply("error: " + err);
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return reply("Divya Foundation form receiver is running."); }

function reply(text) { return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT); }
