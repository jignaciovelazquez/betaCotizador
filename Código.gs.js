//-------------------------------- Variables -------------------------------------------------
const libro = SpreadsheetApp.openById("1lGZx1rXnp87Q-r3lu-rjZvxNOarVLMJH2ezpyYAnpI0");
const hojaProduct = libro.getSheetByName("Product_Base");
const hojaSeller = libro.getSheetByName("Seller_Config");
const hojaClient = libro.getSheetByName("Client_Config");

const quotationBase = DriveApp.getFileById("1riBnrlgm10XOjxFG9yzPDMbW_Nw3lihSu0bSyK8XW18");

const folderPDF = DriveApp.getFolderById("1cjJFbMPz1vyEO8NhcRm7mvd5bUL0Usjp");
const folderDocs = DriveApp.getFolderById("1E6s7AY3l4vvm7ffBWS2oOVIi35PRHwgM");

//------------------------------- Funciones --------------------------------------------------
function doGet() {
  var html = HtmlService.createTemplateFromFile("Index.html")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("COTIZADOR BETA")
    .setFaviconUrl("https://cdn.iconscout.com/icon/free/png-512/r-characters-character-alphabet-letter-36029.png");
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function BuscarUser() {
  let userActivo = Session.getActiveUser().getEmail();

  let UltimaFila = hojaSeller.getLastRow();

  for (i = 5; i <= UltimaFila; i++) {
    let elemento = hojaSeller.getRange(i, 3).getValue();
    if (elemento != "####") {
      if (elemento == userActivo) {
        userActivo = hojaSeller.getRange(i, 2).getValue();
        break;
      }
    } else {
      userActivo = "Desconocido";
      break;
    }
  }
  let mailActivo = Session.getActiveUser().getEmail();
  return [userActivo, mailActivo];
}

function BuscarClient() {
  let UltimaFila = hojaClient.getLastRow();
  let tablaHojaClient = hojaClient.getRange(5, 1, UltimaFila - 4, 5).getDisplayValues();
  return tablaHojaClient;
}

function BuscarProduct() {
  let UltimaFila = hojaProduct.getLastRow();
  let tablahojaProduct = hojaProduct.getRange(5, 1, UltimaFila - 4, 5).getDisplayValues();
  return tablahojaProduct;
}

function WriteDocument(dataToPrint) {
  let quotationName;
  let quotationNew;
  let idQuotationNew;
  let docQuotationNew;

  //------------ crea una copia de informe test y reemplaza los campos ------------------

  quotationName = dataToPrint.nroQuotation.trim();

  quotationNew = quotationBase.makeCopy(quotationName);
  idQuotationNew = quotationNew.getId();
  docQuotationNew = DocumentApp.openById(idQuotationNew).getBody();
  switch (dataToPrint.country) {
    case "USA - Houston":
    case "USA - Miami":
      docQuotationNew.replaceText("<<NAME>>", "Quotation");
      docQuotationNew.replaceText("<<NROQUO>>", "No. Quotation");
      docQuotationNew.replaceText(
        "<<BODY>>",
        "We are pleased to quote the following products according to your requirement:"
      );
      docQuotationNew.replaceText("<<NOTE>>", "Note:");
      docQuotationNew.replaceText("<<CURRENCY>>", "Values expressed in US dollars.");
      docQuotationNew.replaceText("<<FAREWELL>>", "Regards");
      break;
    case "Argentina":
    case "Colombia":
    case "Uruguay":
      docQuotationNew.replaceText("<<NAME>>", "Cotización");
      docQuotationNew.replaceText("<<NROQUO>>", "No. Quotation");
      docQuotationNew.replaceText("<<BODY>>", "Nos complace cotizar los siguientes productos según sus necesidades.:");
      docQuotationNew.replaceText("<<NOTE>>", "Nota:");
      docQuotationNew.replaceText("<<CURRENCY>>", "Valores expresados ​​en dólares estadounidenses.");
      docQuotationNew.replaceText("<<FAREWELL>>", "Saludos");
      break;
    default:
      break;
  }

  docQuotationNew.replaceText("<<client>>", dataToPrint.client);
  docQuotationNew.replaceText("<<company>>", dataToPrint.company);
  docQuotationNew.replaceText("<<clienttelf>>", dataToPrint.clienttelf);
  docQuotationNew.replaceText("<<clientmail>>", dataToPrint.clientmail);
  docQuotationNew.replaceText("<<country>>", dataToPrint.country);
  docQuotationNew.replaceText("<<date>>", dataToPrint.date);
  docQuotationNew.replaceText("<<nquotation>>", dataToPrint.nroQuotation);
  docQuotationNew.replaceText("<<product0>>", dataToPrint.product0);
  docQuotationNew.replaceText("<<qt0>>", dataToPrint.qt0);
  docQuotationNew.replaceText("<<package0>>", dataToPrint.package0);
  docQuotationNew.replaceText("<<up0>>", dataToPrint.up0);
  docQuotationNew.replaceText("<<st0>>", dataToPrint.st0);
  docQuotationNew.replaceText("<<product1>>", dataToPrint.product1);
  docQuotationNew.replaceText("<<qt1>>", dataToPrint.qt1);
  docQuotationNew.replaceText("<<package1>>", dataToPrint.package1);
  docQuotationNew.replaceText("<<up1>>", dataToPrint.up1);
  docQuotationNew.replaceText("<<st1>>", dataToPrint.st1);
  docQuotationNew.replaceText("<<product2>>", dataToPrint.product2);
  docQuotationNew.replaceText("<<qt2>>", dataToPrint.qt2);
  docQuotationNew.replaceText("<<package2>>", dataToPrint.package2);
  docQuotationNew.replaceText("<<up2>>", dataToPrint.up2);
  docQuotationNew.replaceText("<<st2>>", dataToPrint.st2);
  docQuotationNew.replaceText("<<product3>>", dataToPrint.product3);
  docQuotationNew.replaceText("<<qt3>>", dataToPrint.qt3);
  docQuotationNew.replaceText("<<package3>>", dataToPrint.package3);
  docQuotationNew.replaceText("<<up3>>", dataToPrint.up3);
  docQuotationNew.replaceText("<<st3>>", dataToPrint.st3);
  docQuotationNew.replaceText("<<total>>", dataToPrint.total);
  docQuotationNew.replaceText("<<packages>>", dataToPrint.packages);
  docQuotationNew.replaceText("<<paymentterms>>", dataToPrint.paymentterms);
  docQuotationNew.replaceText("<<delivery>>", dataToPrint.delivery);
  docQuotationNew.replaceText("<<deliverytime>>", dataToPrint.deliverytime);
  docQuotationNew.replaceText("<<offervalidity>>", dataToPrint.offervalidity);
  docQuotationNew.replaceText("<<seller>>", dataToPrint.seller);
  docQuotationNew.replaceText("<<sellermail>>", dataToPrint.sellermail);

  if (dataToPrint.product0 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(1).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }
  if (dataToPrint.product1 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(2).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }
  if (dataToPrint.product2 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(3).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }
  if (dataToPrint.product3 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(4).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }

  /* //por cada product0 pintar la fila de gris

  if (dataToPrint.product0 != ""){
    console.log("intenta pintar en: ",dataToPrint.product0);
    for(i=0;i<5;i++){
    //console.log("Atributos antes",docQuotationNew.getChild(5).asTable().getRow(0).getCell(0).getAttributes());
    docQuotationNew.getChild(5).asTable().getRow(1).getCell(i).setBackgroundColor("#f3f3f3"); 
    //console.log("Atributos despues",docQuotationNew.getChild(5).asTable().getRow(0).getCell(0).getAttributes());
    //child.asTable().getRow(ri).getCell(ci).editAsText().getText();
    //console.log(child.asTable().getAttributes()); //BACKGROUND_COLOR: '#ffffff',
    }
  }
  */

  /*
  //recorrer filas y celdas de tablas en Google Docs \

  var numChildren=docQuotationNew.getNumChildren();
  console.log("Numero de hijos: ",numChildren);

  for(var i=0;i<numChildren;i++) { 

    var child=docQuotationNew.getChild(i);

    

    
    if((child.getType()==DocumentApp.ElementType.TABLE) && (child.asTable().getNumRows() > 0) && (child.asTable().getRow(0).getNumCells() == 5)) {

      console.log("Nro de hijo: ",i);
      console.log(child.asTable().getAttributes()); //BACKGROUND_COLOR: '#ffffff',
      //console.log("Tipo de hijo: ",child.getType());
      //console.log("hijo: ",child," Nro: ",i);

      var numRows=child.asTable().getNumRows();
      //console.log("Numero de filas: ",numRows," del hijo: ",child," Nro: ",i);
      console.log("Numero de filas: ",numRows," del hijo Nro: ",i);

      for(var ri=0;ri<numRows;ri++) {

        var numCells=child.asTable().getRow(ri).getNumCells();
        //console.log("Numero de celdas: ",numCells," del hijo: ",child," Nro: ",i);
        console.log("Numero de celdas: ",numCells," del hijo: Nro: ",i);

        for(var ci=0;ci<numCells;ci++) {

          var cellText=child.asTable().getRow(ri).getCell(ci).editAsText().getText();
          console.log("Contenido celdas: ",cellText);
        }

      }

    }

  }
  */

  const formatType = DocumentApp.openById(idQuotationNew).getAs(MimeType.PDF);
  DocumentApp.openById(idQuotationNew).saveAndClose();
  const pdf = folderPDF.createFile(formatType).setName(dataToPrint.nroQuotation + ".pdf");
  const idQuotationPdf = pdf.getId();
  return [idQuotationNew, idQuotationPdf];
}

//******************** recarga la pagina desde el boton borrar */
function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

function WriteDocumentAndSend(dataToPrint) {
  let quotationName;
  let quotationNew;
  let idQuotationNew;
  let docQuotationNew;

  //------------ crea una copia de informe test y reemplaza los campos ------------------

  quotationName = dataToPrint.nroQuotation.trim();

  quotationNew = quotationBase.makeCopy(quotationName);
  idQuotationNew = quotationNew.getId();
  docQuotationNew = DocumentApp.openById(idQuotationNew).getBody();
  switch (dataToPrint.country) {
    case "USA - Houston":
    case "USA - Miami":
      docQuotationNew.replaceText("<<NAME>>", "Quotation");
      docQuotationNew.replaceText("<<NROQUO>>", "No. Quotation");
      docQuotationNew.replaceText(
        "<<BODY>>",
        "We are pleased to quote the following products according to your requirement:"
      );
      docQuotationNew.replaceText("<<NOTE>>", "Note:");
      docQuotationNew.replaceText("<<CURRENCY>>", "Values expressed in US dollars.");
      docQuotationNew.replaceText("<<FAREWELL>>", "Regards");
      break;
    case "Argentina":
    case "Colombia":
    case "Uruguay":
      docQuotationNew.replaceText("<<NAME>>", "Cotización");
      docQuotationNew.replaceText("<<NROQUO>>", "No. Quotation");
      docQuotationNew.replaceText("<<BODY>>", "Nos complace cotizar los siguientes productos según sus necesidades.:");
      docQuotationNew.replaceText("<<NOTE>>", "Nota:");
      docQuotationNew.replaceText("<<CURRENCY>>", "Valores expresados ​​en dólares estadounidenses.");
      docQuotationNew.replaceText("<<FAREWELL>>", "Saludos");
      break;
    default:
      break;
  }

  docQuotationNew.replaceText("<<client>>", dataToPrint.client);
  docQuotationNew.replaceText("<<company>>", dataToPrint.company);
  docQuotationNew.replaceText("<<clienttelf>>", dataToPrint.clienttelf);
  docQuotationNew.replaceText("<<clientmail>>", dataToPrint.clientmail);
  docQuotationNew.replaceText("<<country>>", dataToPrint.country);
  docQuotationNew.replaceText("<<date>>", dataToPrint.date);
  docQuotationNew.replaceText("<<nquotation>>", dataToPrint.nroQuotation);
  docQuotationNew.replaceText("<<product0>>", dataToPrint.product0);
  docQuotationNew.replaceText("<<qt0>>", dataToPrint.qt0);
  docQuotationNew.replaceText("<<package0>>", dataToPrint.package0);
  docQuotationNew.replaceText("<<up0>>", dataToPrint.up0);
  docQuotationNew.replaceText("<<st0>>", dataToPrint.st0);
  docQuotationNew.replaceText("<<product1>>", dataToPrint.product1);
  docQuotationNew.replaceText("<<qt1>>", dataToPrint.qt1);
  docQuotationNew.replaceText("<<package1>>", dataToPrint.package1);
  docQuotationNew.replaceText("<<up1>>", dataToPrint.up1);
  docQuotationNew.replaceText("<<st1>>", dataToPrint.st1);
  docQuotationNew.replaceText("<<product2>>", dataToPrint.product2);
  docQuotationNew.replaceText("<<qt2>>", dataToPrint.qt2);
  docQuotationNew.replaceText("<<package2>>", dataToPrint.package2);
  docQuotationNew.replaceText("<<up2>>", dataToPrint.up2);
  docQuotationNew.replaceText("<<st2>>", dataToPrint.st2);
  docQuotationNew.replaceText("<<product3>>", dataToPrint.product3);
  docQuotationNew.replaceText("<<qt3>>", dataToPrint.qt3);
  docQuotationNew.replaceText("<<package3>>", dataToPrint.package3);
  docQuotationNew.replaceText("<<up3>>", dataToPrint.up3);
  docQuotationNew.replaceText("<<st3>>", dataToPrint.st3);
  docQuotationNew.replaceText("<<total>>", dataToPrint.total);
  docQuotationNew.replaceText("<<packages>>", dataToPrint.packages);
  docQuotationNew.replaceText("<<paymentterms>>", dataToPrint.paymentterms);
  docQuotationNew.replaceText("<<delivery>>", dataToPrint.delivery);
  docQuotationNew.replaceText("<<deliverytime>>", dataToPrint.deliverytime);
  docQuotationNew.replaceText("<<offervalidity>>", dataToPrint.offervalidity);
  docQuotationNew.replaceText("<<seller>>", dataToPrint.seller);
  docQuotationNew.replaceText("<<sellermail>>", dataToPrint.sellermail);

  if (dataToPrint.product0 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(1).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }
  if (dataToPrint.product1 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(2).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }
  if (dataToPrint.product2 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(3).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }
  if (dataToPrint.product3 != "") {
    for (i = 0; i < 5; i++) {
      docQuotationNew.getChild(5).asTable().getRow(4).getCell(i).setBackgroundColor("#f3f3f3");
    }
  }

  const formatType = DocumentApp.openById(idQuotationNew).getAs(MimeType.PDF);
  DocumentApp.openById(idQuotationNew).saveAndClose();
  const pdf = folderPDF.createFile(formatType).setName(dataToPrint.nroQuotation + ".pdf");
  const idQuotationPdf = pdf.getId();

  //*************** Enviar a Mail */
  const email = dataToPrint.clientmail;
  const subject = "Nro QUOTATION: " + dataToPrint.nroQuotation;
  const messageBody =
    "Greetings, please receive the attached quote from us.  Nro QUOTATION: " + dataToPrint.nroQuotation + ". \nRegards";
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: messageBody,
    attachments: [formatType.getAs(MimeType.PDF)],
  });
  //quotationNew.setTrashed(true); // Mueve el documento a la papelera
  return [idQuotationNew, idQuotationPdf];
}
