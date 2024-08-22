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
/*
let rotar = 0;
let mensaje = "";
let motivo = "";
let FORMATO = "";
let tipoTKT = "";
*/
let dataToSend = {
  client: "",
  company: "",
  clienttelf: "",
  clientmail: "",
  country: "",
  date: "",
  nroQuotation: "",
  product0: "",
  qt0: "",
  package0: "",
  up0: "",
  st0: "",
  product1: "",
  qt1: "",
  package1: "",
  up1: "",
  st1: "",
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
  total: "",
  packages: "",
  paymentterms: "",
  delivery: "",
  deliverytime: "",
  offervalidity: "",
  seller: "",
  sellermail: "",
};

//Star
window.addEventListener("DOMContentLoaded", () => {
  //alert("Se cargo la pagina");
  google.script.run
    .withSuccessHandler(function (output) {
      document.getElementById("USUARIO").value = "Hola, " + output[0];
      if (output[0] != "Desconocido") {
        dataToSend.seller = output[0];
        dataToSend.sellermail = output[1];
        document.getElementById("seller").value = output[0];
      }
    })
    .BuscarUser();

  google.script.run
    .withSuccessHandler(function (clientTableOutput) {
      const ContenedorPadre = document.getElementById("list_client");
      clientTableOutput.forEach(function (client) {
        if (!client[0].includes("#")) {
          let option = document.createElement("option");
          option.value = `${client[0]} - ${client[2]}`;
          ContenedorPadre.appendChild(option);
        }
      });
      clientTable = clientTableOutput;
    })
    .BuscarClient();

  google.script.run
    .withSuccessHandler(function (productTableOutput) {
      var selectElement = document.querySelectorAll('input[name="Product"]');

      //************* se eliminan los desabilitados *******
      let habilitatedProduct = [];
      productTableOutput.forEach(function (item) {
        if (!item[0].includes("#") && item[0] != "NO") {
          habilitatedProduct.push(item);
        }
      });
      productTableOutput = habilitatedProduct;

      //************* se eliminan los duplicados de los products *******
      let listProduct = [];
      productTableOutput.forEach(function (item) {
        listProduct.push(item[2]);
      });
      listProduct = listProduct.filter((item, index) => {
        return listProduct.indexOf(item) === index;
      });

      //************* se agregan las option en cada renglon del html *******
      for (i = 1; i <= selectElement.length; i++) {
        const ContenedorPadre = document.getElementById(`list_product_${i - 1}`);
        listProduct.forEach(function (item) {
          let option = document.createElement("option");
          option.value = `${item}`;
          ContenedorPadre.appendChild(option);
        });
      }
      productTable = productTableOutput;
    })
    .BuscarProduct();

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
  let clientSelected = document.getElementById("client").value;
  let guion = clientSelected.indexOf("-");
  let empresa = clientSelected.slice(0, guion - 1);
  let contacto = clientSelected.slice(guion + 2);
  clientTable.forEach(function (client) {
    if (client[0] == empresa && client[2] == contacto) {
      document.getElementById(
        "clientText"
      ).value = `${client[0]}\n${client[2]} ${client[1]}\nTelf: ${client[3]}\nMail: ${client[4]}`;
      dataToSend.client = `${client[2]} ${client[1]}`;
      dataToSend.company = client[0];
      dataToSend.clienttelf = client[3];
      dataToSend.clientmail = client[4];
    }
  });
  clientForNroQuotation = "_" + clientSelected.slice(0, guion).replace(" ", "");
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
      codCountry = country.slice(0, 2);
      break;
  }
  const day = date.slice(8, 10);
  const month = date.slice(5, 7);
  const year = date.slice(2, 4);
  let fecha = year + "" + month + "" + day;
  document.getElementById("nroQuotation").value = "QT" + codCountry + fecha + client + codAditional;
}
//******************************************************************************
function SetOptionPackage() {
  let selectElement = document.querySelectorAll('input[name="Product"]');
  for (i = 1; i <= selectElement.length; i++) {
    let selectProduct = document.getElementById(`product_${i - 1}`).value;

    if (selectProduct != "") {
      let listPackage = [];
      productTable.forEach(function (item) {
        if (selectProduct.includes(item[2])) {
          listPackage.push(item[3]);
        }
      });

      if (document.getElementById(`package_${i - 1}`).value == "") {
        if (listPackage.length == 1) {
          document.getElementById(`package_${i - 1}`).value = listPackage[0];
        }

        const ContenedorPadre = document.getElementById(`list_package_${i - 1}`);
        ContenedorPadre.innerHTML = "";
        listPackage.forEach(function (item) {
          let option = document.createElement("option");
          option.value = `${item}`;
          ContenedorPadre.appendChild(option);
        });
      }

      let selectPackage = document.getElementById(`package_${i - 1}`).value;
      productTable.forEach(function (item) {
        if (selectProduct.includes(item[2]) && selectPackage.includes(item[3])) {
          if (document.getElementById(`unitPrice_${i - 1}`).value == "") {
            let formatPrice = item[4].replace(",", ".");
            document.getElementById(`unitPrice_${i - 1}`).value = Number.parseFloat(formatPrice);
          }
        }
      });
    }
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
  if (st0 != 0 || st1 != 0 || st2 != 0 || st3 != 0) {
    let total = st0 + st1 + st2 + st3;
    document.getElementById("total").value = total.toFixed(2);
  }
}

//Event

document.getElementById("defineNroQuotation").addEventListener("change", () => {
  SetNroQuotation();
});

document.getElementById("calculations").addEventListener("change", (e) => {
  if (e.target.name == "Product") {
    let fila = e.target.id.slice(-1);
    document.getElementById(`package_${fila}`).value = "";
    document.getElementById(`quantity_${fila}`).value = "";
    document.getElementById(`unitPrice_${fila}`).value = "";
  }
  SetTotal();
});

//**************************************************************************/

document.getElementById("FORMULARIO").addEventListener("submit", (e) => {
  //console.log(e.submitter.id);
  if (validarCampos()) {
    alert("Debe completar todos los campos");
    return;
  } else {
    EnableSpinner();
    if (e.submitter.id == "CREATEANDSEND") {
      document.getElementById("CREATEANDSEND").textContent = "GENERANDO...";
      document.getElementById("CREATEANDSEND").disabled = true;
      document.getElementById("GENERAR").disabled = true;
      document.getElementById("BORRAR").disabled = true;
    } else {
      document.getElementById("GENERAR").textContent = "GENERANDO...";
      document.getElementById("GENERAR").disabled = true;
      document.getElementById("CREATEANDSEND").disabled = true;
      document.getElementById("BORRAR").disabled = true;
    }

    let Fecha = document.getElementById("date").value.split("-");
    let FechaInvr = Fecha[2] + "/" + Fecha[1] + "/" + Fecha[0];
    dataToSend.date = FechaInvr;

    dataToSend.country = document.getElementById("country").value;
    dataToSend.nroQuotation = document.getElementById("nroQuotation").value;
    dataToSend.product0 = document.getElementById("product_0").value;
    dataToSend.qt0 = document.getElementById("quantity_0").value;
    dataToSend.package0 = document.getElementById("package_0").value;
    dataToSend.up0 = document.getElementById("unitPrice_0").value;
    dataToSend.st0 = document.getElementById("subtotal_0").value;
    dataToSend.product1 = document.getElementById("product_1").value;
    dataToSend.qt1 = document.getElementById("quantity_1").value;
    dataToSend.package1 = document.getElementById("package_1").value;
    dataToSend.up1 = document.getElementById("unitPrice_1").value;
    dataToSend.st1 = document.getElementById("subtotal_1").value;
    dataToSend.product2 = document.getElementById("product_2").value;
    dataToSend.qt2 = document.getElementById("quantity_2").value;
    dataToSend.package2 = document.getElementById("package_2").value;
    dataToSend.up2 = document.getElementById("unitPrice_2").value;
    dataToSend.st2 = document.getElementById("subtotal_2").value;
    dataToSend.product3 = document.getElementById("product_3").value;
    dataToSend.qt3 = document.getElementById("quantity_3").value;
    dataToSend.package3 = document.getElementById("package_3").value;
    dataToSend.up3 = document.getElementById("unitPrice_3").value;
    dataToSend.st3 = document.getElementById("subtotal_3").value;
    dataToSend.total = document.getElementById("total").value;
    dataToSend.packages = document.getElementById("nPackages").value;
    dataToSend.paymentterms = document.getElementById("payTerms").value;
    dataToSend.delivery = document.getElementById("delivery").value;
    dataToSend.deliverytime = document.getElementById("deliveryTime").value;
    dataToSend.offervalidity = document.getElementById("offerValidity").value;

    if (e.submitter.id == "CREATEANDSEND") {
      google.script.run
        .withSuccessHandler(function (idDoc) {
          DisableSpinner();
          document.getElementById("GENERAR").disabled = false;
          document.getElementById("GENERAR").textContent = "GENERAR";
          document.getElementById("CREATEANDSEND").disabled = false;
          document.getElementById("CREATEANDSEND").textContent = "GENERAR Y ENVIAR";
          document.getElementById("BORRAR").disabled = false;
          let url = "https://drive.google.com/uc?id=" + idDoc[1] + "&export=download";
          let win = window.open(url, "_blank");
          MostrarAlerta("La cotizacion se genero y envio correctamente");
        })
        .WriteDocumentAndSend(dataToSend);
    } else {
      google.script.run
        .withSuccessHandler(function (idDoc) {
          DisableSpinner();
          document.getElementById("GENERAR").disabled = false;
          document.getElementById("GENERAR").textContent = "GENERAR";
          document.getElementById("CREATEANDSEND").disabled = false;
          document.getElementById("CREATEANDSEND").textContent = "GENERAR Y ENVIAR";
          document.getElementById("BORRAR").disabled = false;
          let url = "https://drive.google.com/uc?id=" + idDoc[1] + "&export=download";
          let win = window.open(url, "_blank");
          MostrarAlerta("La cotizacion se genero correctamente");
        })
        .WriteDocument(dataToSend);
    }
  }
});

document.getElementById("BORRAR").addEventListener("click", () => {
  Limpiar();
});

//Funciones

const Recargar = () => {
  Limpiar();
  google.script.run
    .withSuccessHandler(function () {
      window.open("https://script.google.com/macros/s/AKfycbw4eYelnMnPg4yiuAEUMX5XT1qRT0dSa2pzsYn-Jzo/dev", "_top");
    })
    .getScriptURL();
};

const Limpiar = () => {
  document.getElementById("country").value = "";
  document.getElementById("nroQuotation").value = "";
  document.getElementById("client").value = "";
  document.getElementById("clientText").value = "";
  document.getElementById("product_0").value = "";
  document.getElementById("quantity_0").value = "";
  document.getElementById("package_0").value = "";
  document.getElementById("unitPrice_0").value = "";
  document.getElementById("subtotal_0").value = "";
  document.getElementById("product_1").value = "";
  document.getElementById("quantity_1").value = "";
  document.getElementById("package_1").value = "";
  document.getElementById("unitPrice_1").value = "";
  document.getElementById("subtotal_1").value = "";
  document.getElementById("product_2").value = "";
  document.getElementById("quantity_2").value = "";
  document.getElementById("package_2").value = "";
  document.getElementById("unitPrice_2").value = "";
  document.getElementById("subtotal_2").value = "";
  document.getElementById("product_3").value = "";
  document.getElementById("quantity_3").value = "";
  document.getElementById("package_3").value = "";
  document.getElementById("unitPrice_3").value = "";
  document.getElementById("subtotal_3").value = "";
  document.getElementById("total").value = "";
  document.getElementById("nPackages").value = "";
  document.getElementById("payTerms").value = "";
  document.getElementById("delivery").value = "";
  document.getElementById("deliveryTime").value = "";
  document.getElementById("offerValidity").value = "";
};

function validarCampos() {
  if (
    document.getElementById("country").value == "" ||
    document.getElementById("nroQuotation").value == "" ||
    document.getElementById("client").value == "" ||
    document.getElementById("product_0").value == "" ||
    document.getElementById("quantity_0").value == "" ||
    document.getElementById("package_0").value == "" ||
    document.getElementById("unitPrice_0").value == "" ||
    document.getElementById("nPackages").value == "" ||
    document.getElementById("payTerms").value == "" ||
    document.getElementById("delivery").value == "" ||
    document.getElementById("deliveryTime").value == "" ||
    document.getElementById("offerValidity").value == "" ||
    document.getElementById("seller").value == ""
  ) {
    return true;
  } else {
    return false;
  }
}

function MostrarAlerta(mensaje) {
  const ContenedorPadre = document.getElementById("ALERTA");
  ContenedorPadre.innerHTML = "";
  const alertaNueva = document.createElement("DIV");
  alertaNueva.innerHTML = `<div id="alert" class="alert alert-success alert-dismissible fade show" role="alert">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
  <span>${mensaje}</span>
  <button type="button" class="btn btn-secondary close" data-dismiss="alert" aria-label="Close" onclick="Recargar()">
      <span aria-hidden="true">&times;</span>
    </button>
</div>`;
  ContenedorPadre.append(alertaNueva);
}

function CerrarAlerta() {
  setTimeout(function () {
    // Closing the alert
    $("#alert").alert("close");
  }, 8000);
}

//********** NO ENTER SUBMIT ***********/
function noenter() {
  return !(window.event && window.event.keyCode == 13);
}

//******************* Spinner de carga al generar ********************
const EnableSpinner = () => {
  document.getElementById("LOADER").classList.add("d-block");
  document.getElementById("LOADER").classList.remove("d-none");
};

const DisableSpinner = () => {
  document.getElementById("LOADER").classList.add("d-none");
  document.getElementById("LOADER").classList.remove("d-block");
};
