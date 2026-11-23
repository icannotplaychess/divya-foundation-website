/* =====================================================================
   DIVYA FOUNDATION — SITE SETTINGS (the only file you need to edit)
   =====================================================================

   1) ANNOUNCEMENT RIBBON (the strip at the very top of every page)
      - Add, change or delete lines inside `announcements`.
      - Each line has:  text  (what people read)
                        link  (optional: page or web address to open)
                        label (optional: small tag shown before the text)
      - To hide the ribbon completely, leave the list empty:  announcements: []

   2) WHERE FORM SUBMISSIONS GO
      - Paste the Google Apps Script "Web app URL" between the quotes
        in `formEndpoint` (see SETUP-google-sheet.md).
      - While it is empty, forms open the visitor's email app instead,
        addressed to `orgEmail`.
   ===================================================================== */

window.DF_CONFIG = {
  announcements: [
    { label: "Volunteers wanted", text: "Join us for teaching, events and logistics in Nashik", link: "get-involved.html" },
    { label: "Need support?", text: "Apply online for medical, educational or other assistance", link: "apply.html" },
    // Example of an upcoming event — copy this line, remove the two slashes and edit it:
    // { label: "Upcoming", text: "Blood Donation Camp · 26 January · Janakalyan Blood Centre, Nashik", link: "events.html" },
  ],

  formEndpoint: "",

  orgEmail: "divyafoundation.nsk@gmail.com",
};
