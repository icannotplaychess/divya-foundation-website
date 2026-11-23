# Saving website forms to a Google Sheet

The website is a set of plain pages (on Vercel), so it can't store anything itself. This setup sends every form to a Google Sheet owned by the foundation's own Google account. Nobody else can see the sheet unless you share it.

It takes about 10 minutes and is free. Do it while signed in to the foundation's Google account (divyafoundation.nsk@gmail.com), so the data belongs to the foundation.

## 1. Create the sheet

1. Go to **sheets.new** and name the sheet, for example *Divya Foundation – Website forms*.
2. You don't need to add any columns. The script creates three tabs and their columns automatically on the first submission:
   - **Applications** (from *Apply for Support*), with extra columns for the team: Status, Received by, Verified by, Verification notes, Decision, Assistance given, Follow-up date
   - **Donation enquiries** (from the *Donate Now* pop-up)
   - **Contact messages** (from the *Contact* page)

## 2. Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete everything in the editor, then paste the whole of `google-apps-script.gs`.
3. If alerts should go to a different email, change `NOTIFY_EMAIL` at the top.
4. Click **Save**.

## 3. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
   ("Anyone" only lets the website *send* forms in. It does not let anyone read the sheet.)
4. Click **Deploy**, then **Authorize access**, and pick the foundation's Google account.
   If you see "Google hasn't verified this app", click **Advanced → Go to (project name)**. This is normal for your own scripts.
5. Copy the **Web app URL** (it ends in `/exec`).

## 4. Connect the website

1. Open `site-config.js` in the website's GitHub repo and click the pencil icon to edit.
2. Paste the URL between the quotes:
   ```js
   formEndpoint: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
3. Click **Commit changes**. Vercel redeploys automatically.

## 5. Test it

Submit the Contact form on the live site. A new row should appear in the sheet within a few seconds, and an alert email should arrive.

## Good practice for applicant data

- Share the sheet only with the people who review applications.
- Turn on 2-step verification for the foundation's Google account.
- The online form doesn't ask for ID numbers. Check original documents in person during verification.
- Use the **Status** column (New → Verified → Approved / Not approved) to track each application.

## If you change the script later

Use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL, so the website keeps working.
