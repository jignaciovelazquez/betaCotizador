// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//Variables Globales
let clientTable = [];
let productTable = [];
let rotar = 0;
let mensaje = "";
let motivo = "";
let FORMATO = "";
let tipoTKT = "";

//Star
window.addEventListener("DOMContentLoaded", () => {
  //alert("Se cargo la pagina");

  google.script.run
  .withSuccessHandler(function (output) {
    document.getElementById("USUARIO").value = "Hola, " + output;
    if (output != "Desconocido"){
    document.getElementById("seller").value = output;
    }
  })
  .BuscarUser();


  google.script.run
  .withSuccessHandler(function (clientTableOutput) {
    const ContenedorPadre = document.getElementById("list_client");
    clientTableOutput.forEach(function(client){
      if (!client[0].includes("#")){
      let option = document.createElement('option');
      option.value = `${client[0]} - ${client[2]}`;
      ContenedorPadre.appendChild(option);
      }
    });
    clientTable = clientTableOutput;
    console.log(clientTable);
  })
  .BuscarClient();

  google.script.run
  .withSuccessHandler(function (productTableOutput) {

    var selectElement = document.querySelectorAll('input[name="Product"]');

    //************* se eliminan los desabilitados *******
    let habilitatedProduct = [];
    productTableOutput.forEach(function(item){
      if ((!item[0].includes("#")) && (item[0] != "NO")){
        habilitatedProduct.push(item);
      }
    })
    productTableOutput = habilitatedProduct;

    //************* se eliminan los duplicados de los products *******
    let listProduct = [];
    productTableOutput.forEach(function(item){
      listProduct.push(item[2]);
    })
    listProduct = listProduct.filter((item,index)=>{
    return listProduct.indexOf(item) === index;
    })

    //************* se agregan las option en cada renglon del html *******
    for (i=1;i<=selectElement.length;i++){
    const ContenedorPadre = document.getElementById(`list_product_${i-1}`);
      listProduct.forEach(function(item){
      let option = document.createElement('option');
      option.value = `${item}`;
      ContenedorPadre.appendChild(option);
    });
    }

    productTable = productTableOutput;
    console.log(productTable);
  })
  .BuscarProduct();



/*
    ModoInicio();

    const toast = new bootstrap.Toast(document.getElementById("liveToast"));
    toast.show();
    */

  ShowDate();
  SetNroQuotation();

  
});

//Event
function ShowDate() {
  const date = new Date();
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : toString(date.getMonth());
  const year = date.getFullYear();
  document.getElementById("date").value = year + "-" + month + "-" + day;
}

function SetClient() {
  document.getElementById("clientText").value = "";
  let clientSelected = document.getElementById("client").value
  let guion = clientSelected.indexOf("-");
  let empresa = clientSelected.slice(0,guion-1);
  let contacto = clientSelected.slice(guion+2);
  clientTable.forEach(function(client){
    if ((client[0] == empresa) && (client[2] == contacto)){
      document.getElementById("clientText").value = `${client[0]}\n${client[2]} ${client[1]}\nTelf: ${client[3]}\nMail: ${client[4]}`;
    }
  });
  clientForNroQuotation  = "_" + clientSelected.slice(0,guion).replace(" ", "")
  return clientForNroQuotation;
}

function SetNroQuotation() {
  let date = document.getElementById("date").value;
  let client = document.getElementById("client").value != "" ? SetClient() : "";
  
  let country = document.getElementById("country").value;
  let codCountry = "";
  let codAditional =
    document.getElementById("codAditional").value != "" ? "_" + document.getElementById("codAditional").value : "";
  switch (country) {
    case "USA - Houston":
    case "USA - Miami":
      codCountry = "US";
      break;

    case "Argentina":
      codCountry = "AR";
      break;

    case "Colombia":
      codCountry = "CO";
      break;

    case "Uruguay":
      codCountry = "UR";
      break;
    default:
      codCountry = country.slice(0,2)
      break;
  }
  const day = date.slice(8, 10);
  const month = date.slice(5, 7);
  const year = date.slice(2, 4);
  let fecha = year + "" + month + "" + day;
  document.getElementById("nroQuotation").value = "QT" + codCountry + fecha + client + codAditional;
}
//******************************************************************************
function SetOptionPackage {

  var selectElement = document.querySelectorAll('input[name="Product"]');
  for (i=1;i<=selectElement.length;i++){
    if(document.getElementById(`list_product_${i-1}`).value != ""){
      document.getElementById(`unitPrice_${i-1}`)= 555,55;
      //productTable
    }
    /*
    const ContenedorPadre = document.getElementById(`list_product_${i-1}`);
    listProduct.forEach(function(item){
    let option = document.createElement('option');
    option.value = `${item}`;
    ContenedorPadre.appendChild(option);
    */
}

}

function SetTotal() {
  SetOptionPackage();
  let st0 = 0;
  let st1 = 0;
  let st2 = 0;
  let st3 = 0;
  let qt0 = document.getElementById("quantity_0").value != "" ? document.getElementById("quantity_0").value : 0;
  let qt1 = document.getElementById("quantity_1").value != "" ? document.getElementById("quantity_1").value : 0;
  let qt2 = document.getElementById("quantity_2").value != "" ? document.getElementById("quantity_2").value : 0;
  let qt3 = document.getElementById("quantity_3").value != "" ? document.getElementById("quantity_3").value : 0;
  let up0 = document.getElementById("unitPrice_0").value != "" ? document.getElementById("unitPrice_0").value : 0;
  let up1 = document.getElementById("unitPrice_1").value != "" ? document.getElementById("unitPrice_1").value : 0;
  let up2 = document.getElementById("unitPrice_2").value != "" ? document.getElementById("unitPrice_2").value : 0;
  let up3 = document.getElementById("unitPrice_3").value != "" ? document.getElementById("unitPrice_3").value : 0;
  if (qt0 != 0 && up0 != 0) {
    st0 = qt0 * up0;
    document.getElementById("subtotal_0").value = st0.toFixed(2);
  }
  if (qt1 != 0 && up1 != 0) {
    st1 = qt1 * up1;
    document.getElementById("subtotal_1").value = st1.toFixed(2);
  }
  if (qt2 != 0 && up2 != 0) {
    st2 = qt2 * up2;
    document.getElementById("subtotal_2").value = st2.toFixed(2);
  }
  if (qt3 != 0 && up3 != 0) {
    st3 = qt3 * up3;
    document.getElementById("subtotal_3").value = st3.toFixed(2);
  }
  console.log(st0);
  console.log(st1);
  console.log(st2);
  console.log(st3);
  console.log(st0 + st1 + st2 + st3);

  if (st0 != 0 || st1 != 0 || st2 != 0 || st3 != 0) {
    let total = st0 + st1 + st2 + st3;
    document.getElementById("total").value = total.toFixed(2);
  }
}

//Event

document.getElementById("defineNroQuotation").addEventListener("change", () => {
  SetNroQuotation();
});

document.getElementById("calculations").addEventListener("change", () => {
  SetTotal();
});

//**************************************************************************/


document.getElementById("FORMULARIO").addEventListener("submit", () => {
  if (validarCampos()) {
    alert("Debe completar todos los campos");
    return;
  } else {
    document.getElementById("GENERAR").disabled = true;

    let agendamiento = "";

    let datoID = document.getElementById("ID").value;
    let datoNODO = document.getElementById("NODO").value;
    let datoDIRECCION = document.getElementById("DIRECCION").value;
    let datoTGESTION = document.getElementById("TGESTION").value;
    let datoTECNOLOGIA = document.getElementById("TECNOLOGIA").value;
    let datoVTRELEVAMIENTO = document.getElementById("VTRELEVAMIENTO").value;
    let datoAGENDADO = document.getElementById("AGENDADO").value;
    let datoFECHA = document.getElementById("FECHA").value;
    let datoLINKRELEVO = document.getElementById("LINKRELEVO").value;
    let datoOBS = document.getElementById("OBS").value;
    let datoACTIVIDAD = document.getElementById("ACTIVIDAD").value;

    if (datoAGENDADO == "SI") {
      let Fecha = datoFECHA.split("-");
      let FechaInvr = Fecha[2] + "/" + Fecha[1] + "/" + Fecha[0];
      agendamiento = `SI - ${FechaInvr}`;
    } else {
      agendamiento = `NO`;
    }

    FORMATO = `ID: ${datoID}\nNODO: ${datoNODO}\nDIRECCIÓN: ${datoDIRECCION}\nTIPO DE GESTION: ${datoTGESTION}\nNodo FTTH Habilitado: ${datoTECNOLOGIA}\nPOSEE AGENDA: ${agendamiento}\nVT de Relevamiento: ${datoVTRELEVAMIENTO}\nENLACE RELEVAMIENTO: ${datoLINKRELEVO}\nOBSERVACIONES: ${datoOBS}\n`;

    document.getElementById("TEXTO").value = FORMATO;

    prioridad = "Menor";
    if (datoACTIVIDAD == "Diseño online" || datoACTIVIDAD == "Diseño prioridad") {
      prioridad = "Critica";
    }
    if (datoACTIVIDAD == "Diseño Normal" && datoFECHA != "") {
      prioridad = "Mayor";
    }
    if (datoACTIVIDAD == "Diseño Normal" && datoFECHA == "") {
      prioridad = "Menor";
    }
    mensajePrioridad(prioridad);

    document.getElementById("GENERAR").disabled = false;
  }
});









document.getElementById("BORRAR").addEventListener("click", () => {
  Limpiar();
});

//Funciones

const Limpiar = () => {
  google.script.run
    .withSuccessHandler(function () {
      window.open(
        "https://script.google.com/macros/s/AKfycbzJZ_rr8sXkc0jbGC3VmzOPoqYtY_uB2uZV32nr-jQnuDWy1O3pg-n_9MauziXcO2Zs/exec",
        "_top"
      );
    })
    .getScriptURL();
};

/*
const Limpiar = () => {
    document.getElementById("ID").value = "";
    document.getElementById("NODO").value = "";
    document.getElementById("DIRECCION").value = "";
    document.getElementById("TGESTION").value = "";
    document.getElementById("TECNOLOGIA").value = "";
    document.getElementById("VTRELEVAMIENTO").value = "";
    document.getElementById("OBS").value = "";
    document.getElementById("TEXTO").value = "";
    document.getElementById("TKTSALIDA").value = "";
}
*/

function validarCampos() {
  if (
    document.getElementById("ID").value == "" ||
    document.getElementById("NODO").value == "" ||
    document.getElementById("DIRECCION").value == "" ||
    document.getElementById("TGESTION").value == "" ||
    document.getElementById("TECNOLOGIA").value == "" ||
    document.getElementById("VTRELEVAMIENTO").value == "" ||
    document.getElementById("ACTIVIDAD").value == "" ||
    document.getElementById("AGENDADO").value == "" ||
    document.getElementById("LINKRELEVO").value == "" ||
    document.getElementById("OBS").value == ""
  ) {
    return true;
  }
  if (document.getElementById("AGENDADO").value == "SI" && document.getElementById("FECHA").value == "") {
    return true;
  } else {
    return false;
  }
}

function mensajePrioridad(prioridad) {
  let color = "";
  const ContenedorPadre = document.getElementById("PRIORIDAD");
  ContenedorPadre.innerHTML = "";

  if (prioridad != "") {
    if (prioridad == "Critica") {
      color = "bg-danger";
    }
    if (prioridad == "Mayor") {
      color = "bg-warning text-dark";
    }
    if (prioridad == "Menor") {
      color = "bg-info text-dark";
    }

    const GestionNueva = document.createElement("DIV");
    GestionNueva.classList.add("col-sm-10", "offset-sm-1", "d-grid", "gap-2", "pt-2");
    GestionNueva.innerHTML = `<span class="badge ${color}"><h2>  Prioridad del TKT: ${prioridad}  </h2></span>`;
    ContenedorPadre.append(GestionNueva);
  }
}

function MostrarAlerta(mensaje) {
  let color = "";
  const ContenedorPadre = document.getElementById("ALERTA");
  ContenedorPadre.innerHTML = "";

  if (mensaje == "Registro creado satisfactoriamente") {
    color = "alert-success";
  }
  if (mensaje == "Ya existe un registro con ese numero de TKT, por favor verificar...") {
    color = "alert-danger";
  }
  if (mensaje == "Ya existe un registro con ese numero de ID, por favor verificar...") {
    color = "alert-danger";
  }

  const alertaNueva = document.createElement("DIV");
  //alertaNueva.innerHTML = ` <div id="alert" class="alert ${color}">${mensaje}</div>`;
  alertaNueva.innerHTML = `<div id="alert" class="alert ${color} d-flex align-items-center" role="alert">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
  <div>${mensaje}</div>
</div>`;
  ContenedorPadre.append(alertaNueva);
}

function CerrarAlerta() {
  setTimeout(function () {
    // Closing the alert
    $("#alert").alert("close");
  }, 8000);
}

const ActivarFECHA = () => {
  document.getElementById("FECHA").classList.add("d-block");
  document.getElementById("FECHA").classList.remove("d-none");
  document.getElementById("FECHA").disabled = false;
};

const DesactivarFECHA = () => {
  document.getElementById("FECHA").classList.add("d-none");
  document.getElementById("FECHA").classList.remove("d-block");
  document.getElementById("FECHA").disabled = true;
};

//********** NO ENTER SUBMIT ***********/
function noenter() {
  return !(window.event && window.event.keyCode == 13);
}