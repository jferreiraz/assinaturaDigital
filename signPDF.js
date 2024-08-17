const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const forge = require('node-forge');

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

async function signPDF(inputPath, outputPath, privateKeyPem, certificatePem) {

  const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  //Posição da assinatura e o que vai ser assinado

  const dateTime = formatDateTime(new Date());
  signatureText = `Assinado digitalmente em ${dateTime}`;

  firstPage.drawText(signatureText, {
    x: 50,
    y: 55,
    size: 15,
    color: rgb(0, 0.53, 0.71),
  });


  const pdfBytes = await pdfDoc.save();
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const signature = forge.md.sha256.create().update(pdfBytes).digest().toHex();

  fs.writeFileSync(outputPath, pdfBytes);

  console.log('PDF assinado e salvo em:', outputPath);
  console.log('Assinatura:', signature);
}

const privateKeyPem = fs.readFileSync('C:/MeusProjetos/nodejs/assinaturaDigital/assinatura-digital/private.key', 'utf8');
const certificatePem = fs.readFileSync('C:/MeusProjetos/nodejs/assinaturaDigital/assinatura-digital/certificate.crt', 'utf8');

signPDF('input.pdf', 'signed.pdf', privateKeyPem, certificatePem);
