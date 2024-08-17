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
let prioridad = "";
let rotar = 0;
let mensaje = "";
let motivo = "";
let FORMATO = "";
let tipoTKT = "";

//Star
window.addEventListener("DOMContentLoaded", () => {
  //alert("Se cargo la pagina");
  /*
  google.script.run
    .withSuccessHandler(function (output) {
      document.getElementById("USUARIO").value = "Hola, " + output;
    })
    .BuscarUser();


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

function SetNroQuotation() {
  let date = document.getElementById("date").value;
  let client = document.getElementById("client").value != "" ? "_" + document.getElementById("client").value : "";
  let country = document.getElementById("country").value;
  let codCountry = "";
  let codAditional =
    document.getElementById("codAditional").value != "" ? "_" + document.getElementById("codAditional").value : "";
  switch (country) {
    case "Houston":
    case "Miami":
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
      break;
  }
  const day = date.slice(8, 10);
  const month = date.slice(5, 7);
  const year = date.slice(2, 4);
  let fecha = year + "" + month + "" + day;
  document.getElementById("nroQuotation").value = "QT" + codCountry + fecha + client + codAditional;
}

function SetTotal() {
  st0 = 0;
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

document.getElementById("BUSCAR").addEventListener("click", () => {
  if (document.getElementById("ID").value == "") {
    window.alert("Debes ingresar un numero de ID");
    return;
  }
  document.getElementById("BUSCAR").disabled = true;
  document.getElementById("BUSCAR").textContent = "BUSCANDO...";

  let ID = document.getElementById("ID").value;

  google.script.run
    .withSuccessHandler(function (output) {
      document.getElementById("BUSCAR").disabled = false;
      document.getElementById("BUSCAR").textContent = "BUSCAR";

      if (output[1] == "" && output[0] == "") {
        window.alert(`El ID: ${ID} no fue ubicado dentro de la Planilla de Produccion`);
        return;
      }

      document.getElementById("DIRECCION").value = output[1];
      document.getElementById("NODO").value = output[0];
      document.getElementById("ObservacionEnConsulta").href =
        "http://crm.telecentro.local//Edificio/Gt_Edificio/DatosComercialesNew.aspx?GtEdificioId=" + output[2];
    })
    .buscarID(ID);
});

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

document.getElementById("COPIAR1").addEventListener("click", () => {
  var codigoACopiar1 = document.getElementById("TEXTO");
  codigoACopiar1.select();
  codigoACopiar1.setSelectionRange(0, 99999);

  document.execCommand("copy");
});

document.getElementById("TIPOTKT").addEventListener("change", () => {
  document.getElementById("TKTSALIDA").rows = 2;
  document.getElementById("TKTSALIDA").value = `Ticket generado en Moica: ${
    document.getElementById("TKT").value
  } motivo ${document.getElementById("TIPOTKT").value}.`;
});

document.getElementById("COPIAR2").addEventListener("click", () => {
  if (document.getElementById("TKT").value == "" || document.getElementById("TKTSALIDA").value == "") {
    alert("Debe ingresar el Nro y Tipo de TKT solicitado");
    return;
  } else {
    var codigoACopiar1 = document.getElementById("TKTSALIDA");
    codigoACopiar1.select();
    codigoACopiar1.setSelectionRange(0, 99999);

    document.execCommand("copy");

    document.getElementById("COPIAR2").disabled = true;
    document.getElementById("COPIAR2").textContent = "COPIANDO...";

    let datoID = document.getElementById("ID").value;
    let datoTKT = document.getElementById("TKT").value;
    let datoNODO = document.getElementById("NODO").value;
    let datoDIRECCION = document.getElementById("DIRECCION").value;
    let datoAGENDADO = document.getElementById("AGENDADO").value;
    let datoFECHA = document.getElementById("FECHA").value;
    let datoTEXTO = document.getElementById("TEXTO").value;
    let datoTIPO = document.getElementById("ACTIVIDAD").value;
    let datoPRIORIDAD = prioridad;

    if (datoTIPO != "Diseño online") {
      datoTIPO = "";
    }

    let datoUSUARIO = document.getElementById("USUARIO").value.slice(6);
    let datoHORA = new Date().toLocaleString();

    if (datoAGENDADO == "SI") {
      let Fecha = datoFECHA.split("-");
      datoFECHA = Fecha[2] + "/" + Fecha[1] + "/" + Fecha[0];
    } else {
      datoFECHA = "NO";
    }

    google.script.run
      .withSuccessHandler((resultado) => {
        document.getElementById("COPIAR2").disabled = false;
        document.getElementById("COPIAR2").textContent = "COPIAR";

        console.log(resultado);
        MostrarAlerta(resultado);
        CerrarAlerta();
      })
      .Escribir(
        datoHORA,
        datoID,
        datoTKT,
        datoPRIORIDAD,
        datoFECHA,
        datoNODO,
        datoDIRECCION,
        datoTEXTO,
        datoUSUARIO,
        datoTIPO
      );
  }
});

document.getElementById("AGENDADO").addEventListener("change", () => {
  if (document.getElementById("AGENDADO").value == "SI") {
    ActivarFECHA();
  } else {
    DesactivarFECHA();
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
