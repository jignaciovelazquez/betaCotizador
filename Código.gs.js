//-------------------------------- Variables -------------------------------------------------
const libro = SpreadsheetApp.openById("1lGZx1rXnp87Q-r3lu-rjZvxNOarVLMJH2ezpyYAnpI0");
const hojaProduct = libro.getSheetByName("Product_Base");
const hojaSeller = libro.getSheetByName("Seller_Config");
const hojaClient = libro.getSheetByName("Client_Config");

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

/*

function Escribir(HORA,ID,TKT,PRIORIDAD,FECHA,NODO,DIRECCION,TEXTO,ANALISTA,TIPO) {
  let resultado = "";
  let UltimaFila3 = TKTDISENO.getLastRow();
  let listaTKT = TKTDISENO.getRange(2,2,UltimaFila3-1,1).getDisplayValues().map(user => user[0].toString());
  let listaID = TKTDISENO.getRange(2,6,UltimaFila3-1,1).getDisplayValues().map(user => user[0].toString());

  //let UltimoDiseno = DISENO.getLastRow();
  


  if (listaID.indexOf(ID) == -1){
    if (listaTKT.indexOf(TKT) == -1){
      insertar1 = [[HORA,TKT,PRIORIDAD,FECHA,ANALISTA,ID,NODO,DIRECCION,TEXTO]]
      TKTDISENO.getRange(`a${UltimaFila3+1}:i${UltimaFila3+1}`).setValues(insertar1);

      //insertar2 = [[TKT,PRIORIDAD,FECHA,ANALISTA,ID,NODO,DIRECCION,TIPO]]
      //DISENO.getRange(`a${UltimoDiseno+1}:h${UltimoDiseno+1}`).setValues(insertar2);

      resultado = "Registro creado satisfactoriamente";

    }else{resultado = "Ya existe un registro con ese numero de TKT, por favor verificar..."}
  }else{resultado = "Ya existe un registro con ese numero de ID, por favor verificar..."}

  return resultado
}

*/
function getScriptURL() {
  return ScriptApp.getService().getUrl();
}
