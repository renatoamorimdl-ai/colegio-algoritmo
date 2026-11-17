/**
 * @OnlyCurrentDoc
 * Colégio Algoritmo — Leads LP Matrículas 2027
 * Script vinculado à planilha (Extensões > Apps Script).
 * Manifesto (appsscript.json): oauthScopes = ["https://www.googleapis.com/auth/spreadsheets.currentonly"]
 */
const SHEET_NAME = 'Página1';
const HEADERS = ['Data/Hora','Origem','Nome','WhatsApp','E-mail','Segmento','Série 2027',
  'utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid/gclid','Página'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    // honeypot anti-spam
    if (p.website) return json({ ok: true });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);

    const clean = v => String(v || '').replace(/^[=+\-@]/, "'").slice(0, 300);
    sh.appendRow([
      Utilities.formatDate(new Date(), 'America/Fortaleza', 'dd/MM/yyyy HH:mm:ss'),
      clean(p.origem), clean(p.nome), clean(p.telefone), clean(p.email),
      clean(p.segmento), clean(p.serie),
      clean(p.utm_source), clean(p.utm_medium), clean(p.utm_campaign),
      clean(p.utm_term), clean(p.utm_content), clean(p.click_id), clean(p.pagina)
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return json({ ok: true, status: 'online' }); }

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
