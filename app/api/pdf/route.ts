// app/api/pdf/route.ts

import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const x = searchParams.get('x') || '0';
  const o = searchParams.get('o') || '0';
  const winner = searchParams.get('winner') || 'draw';
  const avatar = winner === 'X' ? '/father_robot.jpg' : winner === 'O' ? '/asmaa_robot.jpg' : null;

  const origin = req.headers.get('origin') || 'http://localhost:3000';

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
            height: 100vh;
            background: url("${origin}${avatar}") no-repeat center center;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-shadow: 2px 2px 5px black;
          }
          .container {
            background: rgba(0, 0, 0, 0.5);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
          }
          h1 {
            font-size: 48px;
            margin-bottom: 16px;
          }
          p {
            font-size: 24px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎉 Birthday Game Result 🎉</h1>
          <p><strong>Dr. Mohamed</strong>: ${x}</p>
          <p><strong>Asmaa</strong>: ${o}</p>
          <p style="margin-top:20px; font-size: 28px;">
            ${winner === 'draw' ? "😅 It's a Draw!" : `🏆 Winner: <strong>${winner === 'X' ? 'Dr. Mohamed' : 'Asmaa'}</strong>`}
          </p>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,

    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  // 👇 FIX: Ensure it's typed correctly
  return new Response(pdfBuffer as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="birthday-game.pdf"',
    },
  });
}
