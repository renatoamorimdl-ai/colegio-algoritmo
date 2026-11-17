/**
 * Colégio Algoritmo — Recebimento de leads da LP Matrículas 2027
 * Planilha: https://docs.google.com/spreadsheets/d/169EJvHdtSXW0l1s9ZwxjvqTYl_ab8eRjQIQw5_pp94s
 *
 * Como publicar:
 * 1. Abra a planilha > Extensões > Apps Script. Cole este código e salve.
 * 2. Implantar > Nova implantação > Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 3. Autorize e copie a URL terminada em /exec.
 * 4. No index.html, cole a URL na constante SHEET_ENDPOINT.
 * Ao alterar o código depois: Implantar > Gerenciar implantações > Editar > Nova versão.
 */
const SPREADSHEET_ID = '169EJvHdtSXW0l1s9ZwxjvqTYl_ab8eRjQIQw5_pp94s';
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

    const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
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
