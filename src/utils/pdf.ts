import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export async function createAndShareAgreementPDF(opts: {
  scenario: string;
  body: string;
  signatureA?: string | null; // base64 (no prefix)
  signatureB?: string | null; // base64 (no prefix)
}) {
  const html = renderHtml(opts);
  const { uri } = await Print.printToFileAsync({ html });
  const dest = `${FileSystem.cacheDirectory}HotMessAgreement_${Date.now()}.pdf`;
  await FileSystem.moveAsync({ from: uri, to: dest });
  await Sharing.shareAsync(dest, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br/>');
}

function renderHtml({ scenario, body, signatureA, signatureB }: { scenario: string; body: string; signatureA?: string | null; signatureB?: string | null; }) {
  const imgA = signatureA ? `<img src="data:image/png;base64,${signatureA}" style="max-width:100%; max-height:100%;"/>` : '';
  const imgB = signatureB ? `<img src="data:image/png;base64,${signatureB}" style="max-width:100%; max-height:100%;"/>` : '';

  const issuedAt = new Date();
  const fmt = (d: Date) => d.toLocaleString();
  const envelopeId = `HM-${randBlock()}-${randBlock()}-${randBlock()}`;
  const documentId = `DOC-${randBlock()}`;
  const signerIp = `${rand(11, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(0, 255)}`;
  const ua = 'HotMessSign/1.0 (Totally Not DocuSign)';

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @page { size: A4; margin: 24mm 18mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #111; }
        .header { background: #0b5fff; color: #fff; padding: 14px 16px; border-radius: 6px; }
        .brand { font-weight: 800; letter-spacing: 0.5px; }
        .meta { font-size: 11px; opacity: 0.9; margin-top: 4px; }
        .doc { margin-top: 14px; border: 1px solid #e2e6ef; border-radius: 6px; padding: 18px; position: relative; }
        .title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .subtle { font-size: 12px; color: #555; }
        .body { line-height: 1.55; font-size: 12.5px; margin-top: 12px; }
        .row { display: flex; gap: 16px; margin-top: 28px; }
        .box { border: 1px dashed #8aa0ff; height: 120px; flex: 1; position: relative; }
        .label { position: absolute; top: -10px; left: 6px; background: #fff; padding: 0 6px; color: #0b5fff; font-size: 12px; font-weight: 700; }
        .sig { padding: 6px; width: 100%; height: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
        .sticker { position: absolute; top: -18px; right: -6px; background: #ffc107; color: #111; font-weight: 800; font-size: 11px; padding: 6px 8px; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); transform: rotate(6deg); }
        .footer { margin-top: 18px; font-size: 10px; color: #666; text-align: right; }
        .stamp { position: absolute; top: 18px; right: 18px; width: 100px; height: 100px; border: 3px solid #e53935; color: #e53935; border-radius: 999px; display:flex; align-items:center; justify-content:center; text-align:center; font-weight: 700; opacity: .85; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); opacity: 0.12; font-size: 46px; color: #e53935; white-space: nowrap; pointer-events:none; }
        .cert { page-break-before: always; }
        table { border-collapse: collapse; width: 100%; font-size: 12px; }
        th, td { border: 1px solid #e2e6ef; padding: 8px; text-align: left; }
        th { background: #f5f7fb; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">HotMessSign eSignature — Totally Not DocuSign</div>
        <div class="meta">Envelope ID: ${envelopeId} • Document ID: ${documentId} • Issued: ${escapeHtml(fmt(issuedAt))}</div>
      </div>
      <div class="doc">
        <div class="stamp">Certified<br/>Hot Mess<br/>Agreement</div>
        <div class="title">${escapeHtml(scenario)}</div>
        <div class="subtle">By e‑signing, you agree you are a consenting adult and that this is, like, totally a joke. Not legally binding.</div>
        <div class="body">${escapeHtml(body)}</div>
        <div class="row">
          <div class="box">
            <div class="label">Party A — Sign Here</div>
            <div class="sticker">SIGN HERE ▶</div>
            <div class="sig">${imgA}</div>
          </div>
          <div class="box">
            <div class="label">Party B — Sign Here</div>
            <div class="sticker">SIGN HERE ▶</div>
            <div class="sig">${imgB}</div>
          </div>
        </div>
        <div class="footer">Powered by HotMessSign — Watermark: Totally Not Legally Binding</div>
      </div>
      <div class="watermark">Totally Not Legally Binding</div>

      <div class="cert">
        <div class="title">Certificate of Completion (Parody)</div>
        <div class="subtle">This page mimics an e‑signature certificate for comedic effect only.</div>
        <table style="margin-top: 12px;">
          <tr><th>Envelope</th><td>${envelopeId}</td></tr>
          <tr><th>Document</th><td>${documentId}</td></tr>
          <tr><th>Completed</th><td>${escapeHtml(fmt(issuedAt))}</td></tr>
          <tr><th>IP Address</th><td>${signerIp}</td></tr>
          <tr><th>User Agent</th><td>${ua}</td></tr>
        </table>
        <div style="height: 10px"></div>
        <table>
          <tr><th>Event</th><th>Timestamp</th><th>Actor</th><th>Details</th></tr>
          <tr><td>Sent</td><td>${escapeHtml(fmt(new Date(issuedAt.getTime() - 1000 * 60 * 5)))}</td><td>HotMessSign</td><td>Envelope prepared</td></tr>
          <tr><td>Viewed</td><td>${escapeHtml(fmt(new Date(issuedAt.getTime() - 1000 * 60 * 3)))}</td><td>Party A</td><td>Opened on mobile</td></tr>
          <tr><td>Signed</td><td>${escapeHtml(fmt(issuedAt))}</td><td>Party A & Party B</td><td>Both signatures captured</td></tr>
        </table>
        <div class="footer">This certificate is fictional. For laughs only.</div>
      </div>
    </body>
  </html>`;
}

function randBlock() { return Math.random().toString(36).slice(2, 6).toUpperCase(); }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
