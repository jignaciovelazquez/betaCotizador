//-------------------------------- Variables -------------------------------------------------
const libro = SpreadsheetApp.openById("1lGZx1rXnp87Q-r3lu-rjZvxNOarVLMJH2ezpyYAnpI0");
const hojaProduct = libro.getSheetByName("Product_Base");
const hojaSeller = libro.getSheetByName("Seller_Config");
const hojaClient = libro.getSheetByName("Client_Config");

const quotationBase = DriveApp.getFileById("1riBnrlgm10XOjxFG9yzPDMbW_Nw3lihSu0bSyK8XW18");

//------------------------------- Funciones --------------------------------------------------
function doGet() {
  var html = HtmlService.createTemplateFromFile("Index.html")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("Generador TKT Diseño")
    .setFaviconUrl("https://cdn.iconscout.com/icon/free/png-512/r-characters-character-alphabet-letter-36029.png");
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
/*
function buscarID(id){
  
  let UltimaFila1 = GESTIONES.getLastRow();

  for(i=1;i<=UltimaFila1;i++){
    if (GESTIONES.getRange(i,1).getValue()==id){
      let dir = GESTIONES.getRange(i,3).getValue();
      let nod = GESTIONES.getRange(i,2).getValue();
      let idgestion = GESTIONES.getRange(i,4).getValue();
      return [nod,dir,idgestion];
    }
  }

  let UltimaFila2 = ONLINE.getLastRow();

  for(i=UltimaFila2;i>=1;i--){
    if (ONLINE.getRange(i,3).getValue()==id){
      let dir = ONLINE.getRange(i,5).getValue();
      let nod = ONLINE.getRange(i,4).getValue();
      let idgestion = "0";
      return [nod,dir,idgestion];
    }
  }
  return ["",""]
}
*/
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
  return userActivo;
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

function writeDocument() {
  const dataToPrint = {
    client: "Test",
    company: "Telecentro",
    clienttelf: "+11 2222 3333",
    clientmail: "mail@gmail.com",
    country: "Argentina",
    date: "20/08/2024",
    nroQuotation: "QTUS240810_Telecentro",
    product0: "Grasa Azul",
    qt0: "7",
    package0: "Balde 180KG",
    up0: "120,12",
    st0: "850,69",
    product1: "Grasa Alimenticia",
    qt1: "3",
    package1: "Caja 12 Tubos 300ml",
    up1: "356,85",
    st1: "1145,74",
    product2: "",
    qt2: "",
    package2: "",
    up2: "",
    st2: "",
    product3: "",
    qt3: "",
    package3: "",
    up3: "",
    st3: "",
    total: "7456,50",
    packages: "pallet 30x45x80",
    paymentterms: "3 cuotas sin interes",
    delivery: "Barco",
    deliverytime: "7 dias aprox",
    offervalidity: "30 dias",
    seller: "vendedor actual",
    sellermail: "vendedoractual@gmail.com",
  };

  let quotationName;
  let quotationNew;
  let idQuotationNew;
  let docQuotationNew;

  console.log("La data: ", dataToPrint);

  //------------ crea una copia de informe test y reemplaza los campos ------------------

  quotationName = `QuotationPrueba`;

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

  //reemplazar los datos \
  /*
  docQuotationNew.replaceText("<<client>>", dataToPrint.client);
  docQuotationNew.replaceText("<<company>>", dataToPrint.company);
  docQuotationNew.replaceText("<<clienttelf>>", dataToPrint.clienttelf);
  docQuotationNew.replaceText("<<clientmail>>", dataToPrint.clientmail);
  docQuotationNew.replaceText("<<country>>", dataToPrint.country);
  */

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

  /* //por cada product0 pintar la fila de gris

  propuestas.forEach((e) => {
    switch (e) {
      case "1":

        break;
    }
  });
  */

  console.log("Id: ", idQuotationNew);
  return idQuotationNew;
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}
