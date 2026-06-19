import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const EMAIL_DESTINO  = Deno.env.get('EMAIL_DESTINO')!;

function gerarICS(ag: any): string {
  const dtStr = ag.data.replace(/-/g, '');
  const inicio = ag.turno?.includes('Manhã') ? '080000' : '133000';
  const fim    = ag.turno?.includes('Manhã') ? '120000' : '180000';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cia Pet//Agendamento//PT',
    'BEGIN:VEVENT',
    `UID:${ag.id}@ciapet`,
    `DTSTAMP:${dtStr}T${inicio}Z`,
    `DTSTART;TZID=America/Sao_Paulo:${dtStr}T${inicio}`,
    `DTEND;TZID=America/Sao_Paulo:${dtStr}T${fim}`,
    `SUMMARY:${ag.setor} — ${ag.pet_nome}`,
    `DESCRIPTION:Tutor: ${ag.tutor_nome}\\nTelefone: ${ag.tutor_telefone}\\nTurno: ${ag.turno}`,
    'LOCATION:Cia Pet — R. Rio Grande do Sul, Jardim Cruzeiro, Lençóis Paulista/SP',
    'STATUS:TENTATIVE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function dataBR(iso: string) {
  return iso.split('-').reverse().join('/');
}

serve(async (req) => {
  try {
    const payload = await req.json();
    const ag = payload.record;

    if (!ag) {
      return new Response('Sem dados', { status: 400 });
    }

    const icsContent = gerarICS(ag);
    const icsBase64  = btoa(unescape(encodeURIComponent(icsContent)));

    const emailBody = {
      from: 'Cia Pet <onboarding@resend.dev>',
      to:   [EMAIL_DESTINO],
      subject: `📅 Novo agendamento — ${ag.pet_nome} (${ag.setor})`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;border:1px solid #e4ece8;border-radius:14px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1c6f54,#2a9d78);padding:24px 28px;">
            <h2 style="color:#fff;margin:0;font-size:1.2rem;">🐾 Novo agendamento — Cia Pet</h2>
          </div>
          <div style="padding:24px 28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#5f6f69;width:140px;">Pet</td><td style="font-weight:700;color:#1a2e27;">${ag.pet_nome}</td></tr>
              <tr><td style="padding:8px 0;color:#5f6f69;">Tutor</td><td style="color:#1a2e27;">${ag.tutor_nome}</td></tr>
              <tr><td style="padding:8px 0;color:#5f6f69;">Telefone</td><td style="color:#1a2e27;">${ag.tutor_telefone}</td></tr>
              <tr><td style="padding:8px 0;color:#5f6f69;">Setor</td><td style="color:#1a2e27;">${ag.setor}</td></tr>
              <tr><td style="padding:8px 0;color:#5f6f69;">Data</td><td style="font-weight:700;color:#2a9d78;">${dataBR(ag.data)}</td></tr>
              <tr><td style="padding:8px 0;color:#5f6f69;">Turno</td><td style="color:#1a2e27;">${ag.turno}</td></tr>
            </table>
            <div style="margin-top:20px;padding:14px;background:#e3f3eb;border-radius:10px;color:#1c6f54;font-size:.9rem;">
              📎 O arquivo <strong>.ics</strong> em anexo permite adicionar este agendamento diretamente ao seu calendário (Google, Outlook, etc.)
            </div>
          </div>
          <div style="padding:16px 28px;background:#f4f8f6;font-size:.8rem;color:#5f6f69;text-align:center;">
            Cia Pet · R. Rio Grande do Sul, Jardim Cruzeiro, Lençóis Paulista/SP
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `agendamento-${ag.pet_nome.toLowerCase().replace(/\s/g, '-')}.ics`,
          content:  icsBase64,
        },
      ],
    };

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
