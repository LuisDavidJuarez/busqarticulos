import React, { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./busquedaArticulos.css";
import axios from "axios";
//import LogoImg from '@file://192.168.13.30/Imagenes/Articulos/default.png';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { DatePickerInput } from "rc-datepicker";
import "rc-datepicker/lib/style.css";

import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TablePagination,
  TextField,
} from "@material-ui/core";
import * as ImIcons from "react-icons/im";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";

/* Todo para el Carrito de compras */
import {
  shoppingReducer,
  shoppinInitialState,
} from "./reducers/shoppingReducer";
import { TYPES } from "./actions/shoppingActions";
/* Todo para el Carrito de compras */

export default function Articulos() {
  const baseUrl = "http://" + adquirirUrl() + ":81/api/BusquedaArticulos";
  const baseUrlCotizador = "http://" + adquirirUrl() + ":81/api/Cotizador";

  const [articulos, setArticulos] = useState([]);
  const [sugeridos, setSugeridos] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [autocompletar, setAutocompletar] = useState([]);
  const [GatewayData, setGatewayData] = useState([]);
  const [AgentesData, setAgentesData] = useState([]);
  const [AgentesData2, setAgentesData2] = useState([]);
  const [ClientesData, setClientesData] = useState([]);
  const [ClientesData2, setClientesData2] = useState([]);
  const [Cotizacion, setCotizacion] = useState([]);
  const [DatosBusqCotizacion, setDatosBusqCotizacion] = useState([]);
  const [Cotizaciones, setCotizaciones] = useState([]);

  const [verTabla, setVerTabla] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarMain, setMostrarMain] = useState(true);
  const [MostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarProgress, setMostrarProgress] = useState(false);
  const [CambiarTipo, setCambiarTipo] = useState(false);
  const [ModalArticulo, setModalArticulo] = useState(false);
  const [ModalSucursal, setModalSucursal] = useState(false);
  const [ModalCarrito, setModalCarrito] = useState(false);
  const [ModalCheckOut, setModalCheckOut] = useState(false);
  const [ModalDatosClienteAgente, setModalDatosClienteAgente] = useState(false);
  const [ModalImprimir, setModalImprimir] = useState(false);
  //const [ModalDetalleCotizacion, setModalDetalleCotizacion] = useState(false);
  const [ocultarAutoCompletar, setOcultarAutoCompletar] = useState(true);
  const [ocultarAutoComplAgente, setocultarAutoComplAgente] = useState(true);
  const [ocultarAutoComplCliente, setocultarAutoComplCliente] = useState(true);
  const [verSugeridosSucursales, setVerSugeridosSucursales] = useState(false);
  const [verPrecios, SetVerPrecios] = useState(false);
  const [verSustanciaActiva, setVerSustanciaActiva] = useState(false);

  const [Sucursal, setSucursal] = useState(0);
  const [TipoCambio, setTipoCambio] = useState(0);
  const [TipoBusqueda, setTipoBusqueda] = useState(1);
  const [FechaInicial, setFechaInicial] = useState(new Date());
  const [FechaFinal, setFechaFinal] = useState(new Date());

  const [Imagen, setImagen] = useState(
    `${process.env.PUBLIC_URL}/images/page/default.png`
  );
  const [TextoCompleto, setTextoCompleto] = useState("");
  const [TextoABuscar, setTextoABuscar] = useState("");
  const [AgenteABuscar, setAgenteABuscar] = useState("");
  const [NumAgente, setNumAgente] = useState("");
  const [NumCliente, setNumCliente] = useState("");
  const [ClienteABuscar, setClienteABuscar] = useState("");
  const [TextoSugerido, setTextoSugerido] = useState("");
  const [Getway, setGetway] = useState("");
  const [Conexion, setConexion] = useState("");
  const [TipoBusquedaAgenteCliente, setTipoBusquedaAgenteCliente] =
    useState("");
  const [articuloSeleccionado, setarticuloSeleccionado] = useState({
    Articulo: "",
    Codigo: "",
    Descripcion: "",
    Precio: "",
    Descuento: "",
    PrecioConDescuento: "",
    Existencia: "",
    Gen_Pat: "",
    Estatus: "",
    SustanciaActiva: "",
  });

  /**************************** Todo para el Carrito de compras *****************************/
  const [Monto, setMonto] = useState(0);
  const [Ahorro, setAhorro] = useState(0);
  const [QtyItems, setQtyItems] = useState(0);
  const [state, dispatch] = useReducer(shoppingReducer, shoppinInitialState);
  const { car } = state;

  const calcularMontos = () => {
    var monto = 0;
    var ahorro = 0;
    var qty = 0;

    car.map(
      (item) => (monto = monto + item.PrecioConDescuento * item.Cantidad)
    );

    car.map(
      (item) =>
        (ahorro =
          ahorro + (item.Precio - item.PrecioConDescuento) * item.Cantidad)
    );

    car.map((item) => (qty = qty + item.Cantidad));

    setMonto(monto);
    setAhorro(ahorro);
    setQtyItems(qty);
  };

  const handleChangeCar = (e) => {
    const { name, value } = e.target;

    //console.log(name, value);
    if (value !== null && value !== "") {
      let itemCar = name.replaceAll(" ", "");
      let articuloInCar = car.find((item) => item.Articulo === itemCar);

      var qtyAnt = articuloInCar.Cantidad;
      var qtyNew = parseInt(value);
      var Exist = articuloInCar.Existencia;
      var times = 0;

      if (qtyAnt < qtyNew) {
        if (qtyNew > Exist) {
          times = Exist - qtyAnt;
        } else {
          times = qtyNew - qtyAnt;
        }
        for (var i = 0; i < times; i++) {
          dispatch({ type: TYPES.ADD_TO_CAR, payload: articuloInCar });
        }
        setMonto(Monto + times * articuloInCar.PrecioConDescuento);
        setAhorro(
          Ahorro +
            times * (articuloInCar.Precio - articuloInCar.PrecioConDescuento)
        );
        setQtyItems(QtyItems + times);
      } else {
        if (qtyNew < 1) {
          qtyNew = 1;
        }
        times = qtyAnt - qtyNew;
        for (var indx = 0; indx < times; indx++) {
          dispatch({
            type: TYPES.REMOVE_ONE_FROM_CAR,
            payload: articuloInCar.Articulo,
          });
        }
        setMonto(Monto - times * articuloInCar.PrecioConDescuento);
        setAhorro(
          Ahorro -
            times * (articuloInCar.Precio - articuloInCar.PrecioConDescuento)
        );
        setQtyItems(QtyItems - times);
      }
    }
  };

  const addToCar = (articulo) => {
    var agregar = false;
    let itemInCar = null;
    let existe = false;
    if (car.length > 0) {
      itemInCar = car.find((items) =>
        items.Articulo === articulo.Articulo ? true : undefined
      );
    }
    if (itemInCar !== null && itemInCar !== undefined) {
      existe = true;
    } else {
      existe = false;
    }

    if (existe) {
      if (itemInCar.Existencia > itemInCar.Cantidad) {
        agregar = true;
      }
    } else {
      if (articulo.Existencia > 0) {
        agregar = true;
      }
    }
    if (agregar === true) {
      dispatch({ type: TYPES.ADD_TO_CAR, payload: articulo });
      setMonto(Monto + articulo.PrecioConDescuento);
      setAhorro(Ahorro + (articulo.Precio - articulo.PrecioConDescuento));
      setQtyItems(QtyItems + 1);
      agregar = false;
    }
  };

  const delFromCar = (Articulo, all = false) => {
    let articuloInCar = car.find((item) => item.Articulo === Articulo);

    if (all) {
      if (car.length === 1) {
        setModalCarrito();
      }
      dispatch({ type: TYPES.REMOVE_ALL_FROM_CAR, payload: Articulo });
      setMonto(
        Monto - articuloInCar.Cantidad * articuloInCar.PrecioConDescuento
      );
      setAhorro(
        Ahorro -
          (articuloInCar.Precio - articuloInCar.PrecioConDescuento) *
            articuloInCar.Cantidad
      );
      setQtyItems(QtyItems - articuloInCar.Cantidad);
    } else {
      dispatch({ type: TYPES.REMOVE_ONE_FROM_CAR, payload: Articulo });
      setMonto(Monto - articuloInCar.PrecioConDescuento);
      setAhorro(
        Ahorro - (articuloInCar.Precio - articuloInCar.PrecioConDescuento)
      );
      setQtyItems(QtyItems - 1);
    }
  };

  const clearCar = () => {
    dispatch({ type: TYPES.CLEAR_CAR });
    setModalCarrito();
    setMonto(0);
    setAhorro(0);
    setQtyItems(0);
  };

  const hancleChangeAgente = (e) => {
    setAgenteABuscar(e.target.value);
    if (e.target.value.length > 3) {
      peticionGetAgentes(1, e.target.value);
      peticionGetAgentes(2, e.target.value);
      setocultarAutoComplAgente(false);
    } else {
      setocultarAutoComplAgente(true);
      setNumAgente("");
    }
  };

  const asignarAgente = (numAg, nombAg) => {
    setNumAgente(numAg);
    setAgenteABuscar(nombAg);
    abrirCerrarModalAgenteCliente();
    setocultarAutoComplAgente(true);
    setCotizacion({
      ...Cotizacion,
      Agente: numAg,
    });
    console.log("Cotizacion: ", Cotizacion);
  };

  const asignarCliente = (numClie, nombClie) => {
    setNumCliente(numClie);
    setClienteABuscar(nombClie);
    abrirCerrarModalAgenteCliente();
    setocultarAutoComplCliente(true);
    setCotizacion({
      ...Cotizacion,
      Cliente: numClie,
    });
    console.log("Cotizacion: ", Cotizacion);
  };

  const hancleChangeAgente2 = (e) => {
    setAgenteABuscar(e.target.value);
    if (e.target.value.length > 3) {
      peticionGetAgentes(2, e.target.value);
      peticionGetAgentes(1, e.target.value);
    } else {
      //no mostrar
    }
  };

  const hancleChangeCliente = (e) => {
    setClienteABuscar(e.target.value);
    if (e.target.value.length > 3) {
      peticionGetClientes(1, e.target.value);
      peticionGetClientes(2, e.target.value);
      setocultarAutoComplCliente(false);
    } else {
      setocultarAutoComplCliente(true);
      setNumCliente("");
    }
  };

  const hancleChangeCliente2 = (e) => {
    setClienteABuscar(e.target.value);
    if (e.target.value.length > 3) {
      peticionGetClientes(2, e.target.value);
      peticionGetClientes(1, e.target.value);
    } else {
      //no mostrar
    }
  };

  const peticionGetAgentes = async (iTipo, agenteAbusc) => {
    var varLiga = baseUrlCotizador + "/Agentes/" + iTipo + "/" + agenteAbusc;
    console.log("Liga Agentes: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        iTipo === 1
          ? setAgentesData(response.data)
          : setAgentesData2(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionGetClientes = async (iTipo, clienteAbusc) => {
    var varLiga = baseUrlCotizador + "/Clientes/" + iTipo + "/" + clienteAbusc;
    console.log("Liga Clientes: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        iTipo === 1
          ? setClientesData(response.data)
          : setClientesData2(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarAgente = (e) => {
    setNumAgente(e.target.value);

    AgentesData.map(
      (agente) =>
        agente.Agente === e.target.value && setAgenteABuscar(agente.Nombre)
    );

    setCotizacion({
      ...Cotizacion,
      Agente: e.target.value,
    });
    console.log("Cotizacion: ", Cotizacion);
  };

  const seleccionarAgente2 = (e) => {
    setNumAgente(e.target.value);
    setocultarAutoComplAgente(true);

    AgentesData.map(
      (agente) =>
        agente.Agente === e.target.value && setAgenteABuscar(agente.Nombre)
    );

    setDatosBusqCotizacion({
      ...DatosBusqCotizacion,
      Agente: e.target.value,
      FechaInicial: formatDate(FechaInicial).toString(),
      FechaFinal: formatDate(FechaFinal).toString(),
    });
    console.log("DatosBusqCotizacion: ", DatosBusqCotizacion);
    buscarCotizaciones(DatosBusqCotizacion);
  };

  const seleccionarCliente = (e) => {
    setNumCliente(e.target.value);

    ClientesData.map(
      (cliente) =>
        cliente.Cliente === e.target.value && setClienteABuscar(cliente.Nombre)
    );

    setCotizacion({
      ...Cotizacion,
      Cliente: e.target.value,
    });
    console.log("Cotizacion: ", Cotizacion);
  };

  const seleccionarCliente2 = (e) => {
    setNumCliente(e.target.value);
    setocultarAutoComplCliente(true);

    ClientesData.map(
      (cliente) =>
        cliente.Cliente === e.target.value && setClienteABuscar(cliente.Nombre)
    );

    setDatosBusqCotizacion({
      ...DatosBusqCotizacion,
      Cliente: e.target.value,
    });
    console.log("DatosBusqCotizacion: ", DatosBusqCotizacion);
    buscarCotizaciones(DatosBusqCotizacion);
  };

  const GenerarCotizacion = () => {
    setCotizacion({
      ...Cotizacion,
      TipoCambio: TipoCambio,
      Sucursal: parseInt(Sucursal),
      CarritoD: car,
    });

    console.log("Cotizacion: ", Cotizacion);
  };

  const peticionGuardarCotizacion = async () => {
    console.log("Cotizacion: ", Cotizacion);
    var varLiga = baseUrlCotizador;
    console.log("Liga Guardar: " + varLiga);
    await axios
      .post(varLiga)
      .then((response) => {
        //setData(data.concat(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    ImprimirCotizacionGuardada();
    limpiarCotizacion();
  };

  const ImprimirCotizacionGuardada = () => {
    abrirCerrarModalCheckOut();
    abrirCerrarModalImprimir();
    window.print();
    abrirCerrarModalImprimir();
  };

  const limpiarCotizacion = () => {
    setNumAgente("");
    setNumCliente("");
    setAgenteABuscar("");
    setClienteABuscar("");
    clearCar();
    setCotizacion({
      ...Cotizacion,
      Agente: "",
      Cliente: "",
      TipoCambio: "",
      Sucursal: "",
      CarritoD: car,
    });
    abrirCerrarModalCarrito();
  };

  const buscarCotizaciones = async () => {
    console.log("DatosBusqCotizacion: " + DatosBusqCotizacion);
    var varLiga = baseUrlCotizador + DatosBusqCotizacion;
    console.log("Liga Buscar Cotizacion: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        setCotizaciones(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  /**************************** Todo para el Carrito de compras *****************************/

  const articuloLimpio = useState({
    Articulo: "",
    Codigo: "",
    Descripcion: "",
    Precio: "",
    Descuento: "",
    PrecioConDescuento: "",
    Existencia: "",
    Gen_Pat: "",
    Estatus: "",
    SustanciaActiva: "",
  });

  function validaCaracteres(textoaValidar) {
    var vTexto = textoaValidar;

    vTexto = vTexto.replaceAll("/", "%2f");
    vTexto = vTexto.replaceAll(" ", "%20");
    vTexto = vTexto.replaceAll(",", "%2c");
    vTexto = vTexto.replaceAll("?", "%3f");
    vTexto = vTexto.replaceAll("*", "");
    vTexto = vTexto.replaceAll("=", "%3d");

    return vTexto;
  }

  function adquirirUrl() {
    var vUrl = window.location.href;
    vUrl = vUrl.replaceAll("http:", "");
    vUrl = vUrl.replaceAll("/", "");
    vUrl = vUrl.replaceAll(":3000", "");

    return vUrl;
  }

  const getImage = () => {
    var vUrlImage = "";

    if (Conexion === "Local") {
      vUrlImage = "/images/page/default.png";
    } else {
      var img = articuloSeleccionado.Articulo;

      if (!verSugeridosSucursales) {
        vUrlImage = "/images/page/default.png";
      } else {
        vUrlImage = "http://192.168.13.30:82/Articulos/" + img + ".png";
      }
    }
    setImagen(vUrlImage);
  };

  function addDefaultSrc(ev) {
    ev.target.src = "/images/page/default.png";
  }

  function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [page2, setPage2] = React.useState(0);
  const [rowsPerPage2, setRowsPerPage2] = React.useState(5);

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(+event.target.value);
    setPage2(0);
  };

  const [page3, setPage3] = React.useState(0);
  const [rowsPerPage3, setRowsPerPage3] = React.useState(5);

  const handleChangePage3 = (event, newPage) => {
    setPage3(newPage);
  };

  const handleChangeRowsPerPage3 = (event) => {
    setRowsPerPage3(+event.target.value);
    setPage3(0);
  };

  const abrirCerrarModalArticulo = () => {
    setModalArticulo(!ModalArticulo);
  };

  const abrirCerrarModalSucursal = () => {
    setModalSucursal(!ModalSucursal);
  };

  const abrirCerrarMenu = () => {
    setMostrarMenu(!MostrarMenu);
  };

  const abrirCerrarModalCarrito = () => {
    calcularMontos();
    setModalCarrito(!ModalCarrito);
  };

  const abrirCerrarHistorial = () => {
    setMostrarMain(!mostrarMain);
    setMostrarHistorial(!mostrarHistorial);
  };

  const clickBusquedaCliente = () => {
    if (ClienteABuscar.length > 3) {
      setTipoBusquedaAgenteCliente("Cliente");
      abrirCerrarModalAgenteCliente();
    }
  };

  const clickBusquedaAgente = () => {
    if (AgenteABuscar.length > 3) {
      setTipoBusquedaAgenteCliente("Agente");
      abrirCerrarModalAgenteCliente();
    }
  };

  const abrirCerrarModalAgenteCliente = () => {
    setModalDatosClienteAgente(!ModalDatosClienteAgente);
  };

  const abrirCerrarModalImprimir = () => {
    setModalImprimir(!ModalImprimir);
  };

  const abrirCerrarModalCheckOut = () => {
    setModalCheckOut(!ModalCheckOut);
  };

  const imprimirTicket = () => {
    window.print();
    enviarAImprimir();
  };

  const enviarAImprimir = () => {
    abrirCerrarModalCarrito();
    abrirCerrarModalImprimir();
  };

  const enviarcheckout = () => {
    abrirCerrarModalCheckOut();
    abrirCerrarModalCarrito();
    GenerarCotizacion();
  };

  const seleccionarArticulo = (articulo, caso) => {
    setarticuloSeleccionado(articulo);
    SetVerPrecios(true);
    if (caso !== "Seleccionar") {
      abrirCerrarModalArticulo();
    }
    if (caso !== "Ver") {
      asignarSugerido(articulo.Articulo);
    }
  };

  const asignarSugerido = (textosugerido) => {
    setTextoSugerido(textosugerido);
    setVerSugeridosSucursales(true);
  };

  const OpcionesBusq = [
    {
      label: "Descripción",
      value: 1,
    },
    {
      label: "Sustancia Activa",
      value: 2,
    },
    {
      label: "Articulo",
      value: 3,
    },
  ];

  const IniciarValores = () => {
    peticionGetGatewayData();

    console.log("GatewayData: ", GatewayData);
    GuardarGateway();
  };

  const GuardarGateway = () => {
    if (GatewayData.length !== 0) {
      GatewayData.map((data) => setSucursal(data.Sucursal));
      GatewayData.map((data) => setGetway(data.IP));
      GatewayData.map((data) => setConexion(data.Conexion));
      GatewayData.map((data) => setTipoCambio(data.TipoCambio));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (TextoCompleto.length > 2) {
        setTextoABuscar(TextoCompleto);
        setOcultarAutoCompletar(true);
        setVerTabla(true);
        setTextoCompleto("");
        setVerSugeridosSucursales(false);
        setarticuloSeleccionado(articuloLimpio);
        SetVerPrecios(false);
        setMostrarTabla(false);
        setMostrarProgress(true);
        setImagen("/images/page/default.png");
        if (mostrarMain === false) {
          abrirCerrarHistorial();
        }
      }
      e.target.blur();
    }
  };

  const handleChange = (e) => {
    setVerTabla(false);
    const { name, value } = e.target;
    if (name === "tipo") {
      setTipoBusqueda(value);
      if (value === "2") {
        //console.log("ver sustancia activa on");
        setVerSustanciaActiva(true);
      } else {
        setVerSustanciaActiva(false);
      }
      setTextoCompleto("");
    } else {
      setOcultarAutoCompletar(false);
      setVerSugeridosSucursales(false);
      setTextoCompleto(value);
      //console.log("value", value);
    }
    setVerSugeridosSucursales(false);
    if (CambiarTipo) setCambiarTipo(false);
    SetVerPrecios(false);
  };

  const handleChangeSelect = (e) => {
    setTextoCompleto("");
    setTextoABuscar(e.target.value);
    if (mostrarMain === false) {
      abrirCerrarHistorial();
    }
    if (TipoBusqueda !== 2) {
      setTextoSugerido(e.target.value);
      setVerSugeridosSucursales(true);
      SetVerPrecios(false);
      setCambiarTipo(true);
      setMostrarTabla(false);
      setMostrarProgress(true);
      setImagen("/images/page/default.png");
      if (TipoBusqueda === 1) {
        setCambiarTipo(true);
      }
    }
    //console.log(datosBusqueda);
    setVerTabla(true);
    setOcultarAutoCompletar(true);
    setTextoCompleto("");
  };

  const peticionGetArticulo = async () => {
    var tipo;
    if (CambiarTipo) {
      if (!verSustanciaActiva) {
        tipo = 3;
        setVerSugeridosSucursales(true);
      } else {
        tipo = 2;
      }
    } else {
      tipo = TipoBusqueda;
    }
    var varLiga =
      baseUrl +
      "/" +
      Sucursal +
      "/" +
      tipo +
      "/" +
      validaCaracteres(TextoABuscar);
    console.log("Liga Articulos: " + varLiga + " => 0k");
    await axios
      .get(varLiga)
      .then((response) => {
        setArticulos(response.data);
        setPage(0);
        if (CambiarTipo) {
          if (tipo === 3) {
            if (Object.keys(response.data).length === 1) {
              setOcultarAutoCompletar(true);
              setVerTabla(true);
            }
          }
        }
        if (tipo === 2) {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setMostrarTabla(true);
    setMostrarProgress(false);
  };

  const peticionGetSugeridos = async () => {
    var varLiga = baseUrl + "/Sugeridos/" + Sucursal + "/" + TextoSugerido;
    console.log("Liga Sugeridos: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        setSugeridos(response.data);
        setPage2(0);
      })
      .catch((error) => {
        console.log(error);
      });
    getImage();
  };

  const peticionGetDisponibles = async () => {
    var varLiga = baseUrl + "/Disponibles/" + TextoSugerido;
    console.log("Liga Disponibles: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        setDisponibles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionGetAutocompletar = async (TextoCompleto) => {
    var varLiga = baseUrl + "/" + TipoBusqueda + "/" + TextoCompleto;
    console.log("Liga Autocompletar: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        setAutocompletar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (TextoCompleto !== "") {
      setOcultarAutoCompletar(false);
    } else {
      setOcultarAutoCompletar(true);
    }
  };

  const peticionGetGatewayData = async () => {
    var varLiga = baseUrl + "/Gateway";
    console.log("Liga GatewayData: " + varLiga);
    await axios
      .get(varLiga)
      .then((response) => {
        setGatewayData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //IniciarValores();
    GuardarGateway();

    if (TextoCompleto.length > 2) {
      //console.log("Mayor a 2");
      if (TipoBusqueda === "3") {
        //console.log("Tipo = 3");
        if (TextoCompleto.length > 4) {
          //console.log("Mayor a 4");
          peticionGetAutocompletar(TextoCompleto);
        }
      } else {
        peticionGetAutocompletar(TextoCompleto);
      }
    }

    if (verTabla) {
      peticionGetArticulo();
    } else {
      setOcultarAutoCompletar(true);
    }

    if (verSugeridosSucursales && TextoSugerido !== "") {
      peticionGetSugeridos();
      if (Conexion === "Linea") {
        peticionGetDisponibles();
      }
    }

    //eslint-disable-next-line
  }, [TextoCompleto, TextoSugerido, TipoBusqueda]);

  return (
    <div className="container-fluid" onLoad={() => IniciarValores()}>
      <section className="secHeader" align="center">
        <h5>Pantalla Busqueda por Descripción</h5>
      </section>

      <section className="secNavBar">
        <div className="d-flex flex-row">
          <div className="ContainerMenuIcon">
            <ImIcons.ImMenu
              className="MenuIcon border"
              onClick={abrirCerrarMenu}
            />
            <Dropdown className="ddMenuDrop" isOpen={MostrarMenu}>
              <DropdownMenu>
                <DropdownItem onClick={abrirCerrarHistorial}>
                  Historial de Cotizaciones
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="ContainerLogoIcon">
            <img
              src="https://www.farmaciaslamasbarata.com/wp-content/uploads/2017/11/2logoweb.png"
              alt="Logo"
              className="LogoIcon"
            />
          </div>
          <div className="ContainerSearch flex-grow-1 p-4">
            <div className="d-flex flex-row justify-content-start">
              <div className="col-3 flex-shrink-1">
                <select
                  name="tipo"
                  onChange={handleChange}
                  className="form-control custom-drop"
                >
                  {OpcionesBusq.map((opcion) => (
                    <option className="text-dark" value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="divSearchItem col-7 flex-shrink-1">
                <input
                  type="text"
                  className="form-control custom-input"
                  name="textoabuscar"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  value={TextoCompleto}
                />
                <Dropdown
                  className="ddDropAutocompletar"
                  isOpen={!ocultarAutoCompletar}
                >
                  <DropdownMenu
                    className="ddMenuDesplegable"
                    style={{ maxHeight: 200 }}
                  >
                    {autocompletar.map((opcion) =>
                      verSustanciaActiva ? (
                        <DropdownItem
                          align="left"
                          value={opcion.SustanciaActiva}
                          onClick={handleChangeSelect}
                        >
                          {opcion.SustanciaActiva}
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          align="left"
                          value={opcion.Articulo}
                          onClick={handleChangeSelect}
                        >
                          {opcion.Articulo + ": " + opcion.Descripcion}
                        </DropdownItem>
                      )
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div /** div Carrito*/
            className="QtyItemsCar"
            onClick={abrirCerrarModalCarrito}
          >
            <div className="divCar-bg" src=".">
              {QtyItems > 0 && <h7 className="qtyItemsH7">{QtyItems}</h7>}
            </div>
            <RiIcons.RiShoppingCartLine className="CarIcon" />
          </div>
          <div className="DiscountDiv">
            <div className="avatar2d-bg" src=".">
              <h2>{"%"}</h2>
            </div>
            <FaIcons.FaTag className="DiscIcon" />
          </div>
        </div>
      </section>

      {mostrarMain && (
        <section className="secMain d-flex flex-row">
          <section className="divContenido flex-grow-1">
            <TableContainer
              id="TablaPrincipal"
              component={Paper}
              className="responsive"
            >
              <Table aria-label="simple table">
                <TableHead className="custom-bg">
                  <TableRow className="TablaRowHead">
                    <TableCell align="center">
                      <label className="custom-bg">#</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">
                        Articulo
                        <br />
                        Código
                      </label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Descripción</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Precio</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Ahorro</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">
                        Precio
                        <br />
                        Final
                      </label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Exist</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Tipo</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Estatus</label>
                    </TableCell>
                    {/* <TableCell align="center">
                    <label className="custom-bg">Cantidad</label>
                  </TableCell> */}
                    <TableCell>
                      <label className="custom-bg"></label>
                    </TableCell>
                  </TableRow>
                </TableHead>
                {mostrarTabla && (
                  <TableBody>
                    {articulos
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, i) => (
                        <TableRow
                          className="CustomRows"
                          hover
                          key={i}
                          value={row.Articulo}
                          onClick={() =>
                            seleccionarArticulo(row, "Seleccionar")
                          }
                          selected={
                            row.Articulo === articuloSeleccionado.Articulo
                              ? true
                              : false
                          }
                        >
                          <TableCell>
                            <Avatar
                              className="avatar-bg"
                              src="."
                              onClick={() =>
                                seleccionarArticulo(row, "Sugerir")
                              }
                            >
                              {page * rowsPerPage + (i + 1)}
                            </Avatar>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <text className="tipoOpe">{row.Articulo}</text>
                            <br />
                            {row.Codigo}
                          </TableCell>
                          <TableCell>
                            {row.Descripcion}
                            <br />
                            {row.SustanciaActiva !== null &&
                              "[" + row.SustanciaActiva + "]"}
                          </TableCell>
                          <TableCell align="center">
                            {"$" + financial(row.Precio)}
                          </TableCell>
                          <TableCell align="center">
                            {"$" +
                              financial(row.Precio - row.PrecioConDescuento)}
                            <br />
                            {"(" + row.Descuento + " %)"}
                          </TableCell>
                          <TableCell align="center">
                            {"$" + financial(row.PrecioConDescuento)}
                          </TableCell>
                          <TableCell align="center">{row.Existencia}</TableCell>
                          <TableCell align="center">{row.Gen_Pat}</TableCell>
                          <TableCell align="center">{row.Estatus}</TableCell>
                          {/* <TableCell align="center">
                          <TextField
                            inputProps={{
                              style: { textAlign: "center" },
                            }}
                            name={row.Articulo}
                            onChange={handleChangeCar}
                            value={row.Cantidad}
                            readOnly={false}
                          ></TextField>
                        </TableCell> */}
                          <TableCell align="center">
                            <Avatar
                              className="avatar-bg"
                              src="."
                              onClick={() => addToCar(row)}
                            >
                              <FaIcons.FaPlus />
                            </Avatar>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                )}
              </Table>
              {articulos.length !== 0 && (
                <TableFooter className="FooterArticulos d-flex justify-content-center">
                  <TablePagination
                    className=""
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Lineas por Pagina"
                    count={articulos.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableFooter>
              )}
            </TableContainer>

            {verSugeridosSucursales === true && sugeridos.length !== 0 && (
              <div className="secHeader" align="center">
                <h5>Articulos Sugeridos</h5>
              </div>
            )}
            {verSugeridosSucursales === true && sugeridos.length > 0 && (
              <TableContainer
                hidden={!verSugeridosSucursales}
                component={Paper}
                className="responsive"
              >
                <Table aria-label="simple table">
                  <TableHead className="custom-invisible">
                    <TableRow className="custom-bg">
                      <TableCell>
                        <label>#</label>
                      </TableCell>
                      <TableCell>
                        <label>
                          Articulo
                          <br />
                          Código
                        </label>
                      </TableCell>
                      <TableCell>
                        <label>Descripción</label>
                      </TableCell>
                      <TableCell>
                        <label>Precio</label>
                      </TableCell>
                      <TableCell>
                        <label>Ahorro</label>
                      </TableCell>
                      <TableCell>
                        <label>
                          Precio
                          <br />
                          Final
                        </label>
                      </TableCell>
                      <TableCell>
                        <label>Exist</label>
                      </TableCell>
                      <TableCell>
                        <label>Tipo</label>
                      </TableCell>
                      <TableCell>
                        <label>Estatus</label>
                      </TableCell>
                      <TableCell>
                        <label></label>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sugeridos
                      .slice(
                        page2 * rowsPerPage2,
                        page2 * rowsPerPage2 + rowsPerPage2
                      )
                      .map((row, x) => (
                        <TableRow
                          align="center"
                          hover
                          key={x}
                          value={row.Articulo}
                          onClick={() =>
                            seleccionarArticulo(row, "Seleccionar")
                          }
                          selected={
                            row.Articulo === articuloSeleccionado.Articulo
                              ? true
                              : false
                          }
                        >
                          <TableCell>
                            <Avatar
                              className="avatar-bg"
                              src="."
                              onClick={() => seleccionarArticulo(row, "Ver")}
                            >
                              {page2 * rowsPerPage2 + (x + 1)}
                            </Avatar>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <text className="tipoOpe">{row.Articulo}</text>
                            <br />
                            {row.Codigo}
                          </TableCell>
                          <TableCell>
                            {row.Descripcion}
                            <br />
                            {row.SustanciaActiva !== null &&
                              "[" + row.SustanciaActiva + "]"}
                          </TableCell>
                          <TableCell>{"$ " + financial(row.Precio)}</TableCell>
                          <TableCell align="center">
                            {"$ " +
                              financial(row.Precio - row.PrecioConDescuento)}
                            <br />
                            {"(" + row.Descuento + " %)"}
                          </TableCell>
                          <TableCell align="center">
                            {"$" + financial(row.PrecioConDescuento)}
                          </TableCell>
                          <TableCell align="center">{row.Existencia}</TableCell>
                          <TableCell align="center">{row.Gen_Pat}</TableCell>
                          <TableCell align="center">{row.Estatus}</TableCell>
                          <TableCell align="center">
                            <Avatar
                              className="avatar-bg"
                              src="."
                              onClick={() => addToCar(row)}
                            >
                              <FaIcons.FaPlus />
                            </Avatar>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TableFooter className="FooterArticulos d-flex justify-content-center">
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Lineas por Pagina"
                    count={sugeridos.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onRowsPerPageChange={handleChangeRowsPerPage2}
                    className="FooterArticulos"
                  />
                </TableFooter>
              </TableContainer>
            )}
          </section>

          <section className="divSideBar col-3">
            <div className="divImagen d-flex justify-content-center">
              <img
                src={Imagen}
                onError={addDefaultSrc}
                alt="default"
                width="90%"
              />
            </div>
            <p></p>
            <div className="d-flex flex-row nowrap" align="center">
              <div className="flex-grow-1" align="center">
                {verPrecios && (
                  <div className="" align="center">
                    <Avatar
                      align="right"
                      variant="rounded"
                      className="avatarPrecio-bg"
                      src="."
                    >
                      Ahorro:
                    </Avatar>
                    <Avatar
                      variant="rounded"
                      className="avatarPrecio2-bg"
                      src="."
                    >
                      {articuloSeleccionado &&
                        "$ " +
                          financial(
                            articuloSeleccionado.Precio -
                              articuloSeleccionado.PrecioConDescuento
                          )}
                    </Avatar>
                  </div>
                )}
              </div>
              <div className="flex-grow-1" align="center">
                {verPrecios && (
                  <div className="col-sm-12 column" align="center">
                    <Avatar
                      align="right"
                      variant="rounded"
                      className="avatarPrecio-bg"
                      src="."
                    >
                      Precio:
                    </Avatar>
                    <Avatar
                      variant="rounded"
                      className="avatarPrecio2-bg"
                      src="."
                    >
                      {articuloSeleccionado &&
                        "$ " +
                          financial(articuloSeleccionado.PrecioConDescuento)}
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
            <p></p>
            {verSugeridosSucursales &&
              disponibles.length > 0 &&
              Conexion === "Linea" && (
                <section className="divDisponibles">
                  <div align="center" className="divDisponibleHeader">
                    <h4>Disponibles</h4>
                  </div>
                  <div className="">
                    <article
                      className="artHeaderDisponibles d-flex flex-row"
                      align="center"
                    >
                      <item className="d-flex flex-grow-1 justify-content-center">
                        <h5>Sucursal</h5>
                      </item>
                      <item className="d-flex flex-grow-1 justify-content-center">
                        <h5>Existencia</h5>
                      </item>
                    </article>
                  </div>
                  <div className="divDisponiblesContainer">
                    {disponibles.slice(0, 10).map((row) => (
                      <article className="d-flex flex-row" align="center">
                        <item
                          key={row.Sucursal}
                          className="d-flex flex-grow-1 justify-content-center"
                        >
                          <h5>{row.Sucursal}</h5>
                        </item>
                        <item className="d-flex flex-grow-1 justify-content-center">
                          <h5>{row.Existencia}</h5>
                        </item>
                      </article>
                    ))}
                  </div>
                  <div className="divDisponibleFooter d-flex justify-content-end">
                    <h5 onClick={() => abrirCerrarModalSucursal()}>ver mas</h5>
                  </div>
                </section>
              )}
          </section>
        </section>
      )}

      {mostrarHistorial && (
        <section className="secMainHistorial d-flex flex-row">
          <section className="divContenidoHistorial flex-grow-1" align="center">
            <TableContainer
              component={Paper}
              className="responsive"
              style={{ maxHeight: 400 }}
            >
              <Table>
                <TableHead className="custom-bg">
                  <TableRow className="TablaRowHead">
                    <TableCell className="" align="center">
                      <label className="custom-bg">#</label>
                    </TableCell>
                    <TableCell className="flex-grow-1" align="center">
                      <label className="custom-bg">Agente</label>
                    </TableCell>
                    <TableCell className="flex-grow-1" align="center">
                      <label className="custom-bg">Cliente</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label className="custom-bg">{"Total\nUnidades"}</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label className="custom-bg">{"Ahorro\nTotal"}</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label className="custom-bg">{"Tipo\nCambio"}</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label className="custom-bg">{"Total\nMxn"}</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label className="custom-bg">{"Total\nDlls"}</label>
                    </TableCell>
                    <TableCell className="" align="center">
                      <label className="custom-bg">Ver</label>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="CustomRows" hover>
                    <TableCell className="" align="center">
                      <label className="tipoOpe">1</label>
                    </TableCell>
                    <TableCell className="flex-grow-1" align="left">
                      <label className="tipoOpe">{"G36200013"}</label>
                      <label>{"DANIEL CUEVAS RUIZ"}</label>
                    </TableCell>
                    <TableCell className="flex-grow-1" align="left">
                      <label className="tipoOpe">{"CTE-43827"}</label>
                      <label>{"CARLOS HECTOR RODRIGUEZ"}</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label>6</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label>$230.40</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label>$19.30</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label>$789.60</label>
                    </TableCell>
                    <TableCell className="col-1" align="center">
                      <label>$40.91</label>
                    </TableCell>
                    <TableCell className="" align="center">
                      <label>+</label>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {Cotizaciones.length > 0 && (
                <TableFooter className="d-flex justify-content-center">
                  <TablePagination
                    className=""
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Lineas por Pagina"
                    count={Cotizaciones.length}
                    page={page3}
                    rowsPerPage={rowsPerPage3}
                    onPageChange={handleChangePage3}
                    onRowsPerPageChange={handleChangeRowsPerPage3}
                  />
                </TableFooter>
              )}
            </TableContainer>
          </section>
          <section className="divSideBarHistorial col-4" align="center">
            <section className="secHeaderDatosBusqueda d-flex flex-column">
              <h4>Datos de Busqueda</h4>
            </section>
            <section className="d-flex flex-column">
              <h4>Fechas</h4>
            </section>
            <section className="d-flex flex-row" align="center">
              <article className="col-6">Desde</article>
              <article className="col-6">Hasta</article>
            </section>
            <section className="d-flex flex-row" align="center">
              <article className="artFechas flex-grow-1">
                <DatePickerInput
                  onChange={setFechaInicial}
                  maxDate={FechaFinal}
                  value={FechaInicial}
                  className="my-custom-datepicker-component danger"
                />
              </article>
              <article className="artFechas flex-grow-1">
                <DatePickerInput
                  onChange={setFechaFinal}
                  minDate={FechaInicial}
                  maxDate={new Date()}
                  value={FechaFinal}
                  className="my-custom-datepicker-component"
                />
              </article>
            </section>
            <br />
            <section className="d-flex flex-column">
              <h4>Agente</h4>
            </section>
            <section className="SecDatosAgente d-flex flex-row" align="center">
              <article className="InputsAgentes col-2">
                <input
                  type="text"
                  class="form-control custom-input"
                  placeholder="#"
                  value={NumAgente}
                  readOnly
                ></input>
              </article>
              <article className="InputsAgentes flex-grow-1">
                <input
                  type="text"
                  class="form-control custom-input"
                  value={AgenteABuscar}
                  onChange={hancleChangeAgente}
                  placeholder="Nombre"
                ></input>
                <Dropdown
                  className="ddDropAutocompletar"
                  isOpen={!ocultarAutoComplAgente}
                >
                  <DropdownMenu
                    className="ddMenuDesplegable"
                    style={{ maxHeight: 200 }}
                  >
                    {AgentesData.map((opcion) => (
                      <DropdownItem
                        align="left"
                        value={opcion.Agente}
                        onClick={seleccionarAgente2}
                      >
                        {opcion.Nombre}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </article>
              <article className="col-1 d-flex align-items-end" align="left">
                <BiIcons.BiSearchAlt
                  className="LupaIcon"
                  onClick={() => clickBusquedaAgente()}
                />
              </article>
            </section>
            <br />
            <section className="d-flex flex-column">
              <h4>Cliente</h4>
            </section>
            <section className="SecDatosCliente d-flex flex-row" align="center">
              <article className="InputsClientes col-2">
                <input
                  type="text"
                  class="form-control custom-input"
                  placeholder="#"
                  value={NumCliente}
                  readOnly
                ></input>
              </article>
              <article className="InputsClientes flex-grow-1">
                <input
                  type="text"
                  class="form-control custom-input"
                  value={ClienteABuscar}
                  onChange={hancleChangeCliente}
                  placeholder="Nombre"
                ></input>
                <Dropdown
                  className="ddDropAutocompletar"
                  isOpen={!ocultarAutoComplCliente}
                >
                  <DropdownMenu
                    className="ddMenuDesplegable"
                    style={{ maxHeight: 200 }}
                  >
                    {ClientesData.map((opcion) => (
                      <DropdownItem
                        align="left"
                        value={opcion.Cliente}
                        onClick={seleccionarCliente2}
                      >
                        {opcion.Nombre}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </article>
              <article className="col-1 d-flex align-items-end" align="left">
                <BiIcons.BiSearchAlt
                  className="LupaIcon"
                  onClick={() => clickBusquedaCliente()}
                />
              </article>
            </section>
            <br />
            <br />
            {/* <section className="secBotonBuscar d-flex justify-content-center">
              <article className="col-6">
                <button
                  className="btnBusquedaCotizacion"
                  onClick={buscarCotizaciones}
                >
                  {"Buscar  "}
                  <BiIcons.BiSearchAlt className="IconBuscar" />
                </button>
              </article>
            </section> */}
          </section>
        </section>
      )}

      <Modal isOpen={ModalSucursal}>
        <ModalBody>
          <div align="center" className="divDisponibleHeader2 p-2">
            <h3>Disponibilidad por Sucursal</h3>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="custom-bg" align="center">
                    <h5>Sucursal</h5>
                  </TableCell>
                  <TableCell className="custom-bg" align="center">
                    <h5>Existencia</h5>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          <TableContainer
            component={Paper}
            className="responsive"
            style={{ maxHeight: 400 }}
          >
            <Table>
              <TableBody>
                {disponibles.map((row) => (
                  <TableRow>
                    <TableCell align="center">
                      <h5>{row.Sucursal}</h5>
                    </TableCell>
                    <TableCell align="center">
                      <h5>{row.Existencia}</h5>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <button
            className="form-control btnCerrarModal"
            onClick={() => abrirCerrarModalSucursal()}
          >
            <h5>
              {"Cerrar  "}
              <AiIcons.AiOutlineCloseCircle />
            </h5>
          </button>
        </ModalFooter>
      </Modal>

      <Modal className="ModalArticulo modal-lg" isOpen={ModalArticulo}>
        <ModalBody>
          <section className="secHeader" align="center">
            <article>
              <h4>Datos del Articulo</h4>
            </article>
          </section>
          <div className="divDatosArt d-flex">
            <section className="divDatos1 flex-row flex-grow-1">
              <div>
                <section className="d-flex flex-row">
                  <article className="col-4">
                    <h5 className="tipoOpe">Articulo / Codigo</h5>
                  </article>
                  <article className="flex-grow-1">
                    <h5 className="tipoOpe">Descripción / Sustancia Activa</h5>
                  </article>
                </section>
                <section className="d-flex flex-row">
                  <article className="col-4">
                    <textarea
                      type="text"
                      className="form-control"
                      readOnly
                      rows="2"
                      name="articulo"
                      value={
                        articuloSeleccionado &&
                        articuloSeleccionado.Articulo +
                          "\n" +
                          articuloSeleccionado.Codigo
                      }
                    />{" "}
                  </article>
                  <article className="flex-grow-1">
                    <textarea
                      type="text"
                      rows="2"
                      className="form-control"
                      readOnly
                      name="descripcion"
                      value={
                        articuloSeleccionado &&
                        articuloSeleccionado.Descripcion +
                          "\n [" +
                          articuloSeleccionado.SustanciaActiva +
                          "]"
                      }
                    />
                  </article>
                </section>
                <br />
                <section className="d-flex flex-row">
                  <article className="col-3" align="center">
                    <h5 className="tipoOpe">Precio</h5>
                  </article>
                  <article className="col-3" align="center">
                    <h5 className="tipoOpe">Descuento</h5>
                  </article>
                  <article className="col-3" align="center">
                    <h5 className="tipoOpe">Ahorro</h5>
                  </article>
                  <article className="col-3" align="center">
                    <h5 className="tipoOpe">Precio Final</h5>
                  </article>
                </section>
                <section className="d-flex flex-row">
                  <article className="col-3" align="center">
                    <textarea
                      type="text"
                      className="txtAPricing form-control"
                      readOnly
                      rows={1}
                      name="Precio"
                      value={
                        articuloSeleccionado &&
                        "$" + financial(articuloSeleccionado.Precio)
                      }
                    />
                  </article>
                  <article className="col-3">
                    <textarea
                      type="text"
                      className="txtAPricing form-control"
                      align="center"
                      readOnly
                      rows={1}
                      name="Ahorro"
                      value={
                        articuloSeleccionado &&
                        articuloSeleccionado.Descuento + "%"
                      }
                    />
                  </article>
                  <article className="col-3">
                    <textarea
                      type="text"
                      className="txtAPricing form-control"
                      align="center"
                      readOnly
                      rows={1}
                      name="Ahorro"
                      value={
                        articuloSeleccionado &&
                        "$ " +
                          financial(
                            articuloSeleccionado.Precio -
                              articuloSeleccionado.PrecioConDescuento
                          )
                      }
                    />
                  </article>
                  <article className="col-3">
                    <textarea
                      type="text"
                      className="txtAPricing form-control"
                      readOnly
                      rows={1}
                      name="PrecioFinal"
                      value={
                        articuloSeleccionado &&
                        "$" + financial(articuloSeleccionado.PrecioConDescuento)
                      }
                    />
                  </article>
                </section>
              </div>
            </section>
            <section className="col-4">
              <article>
                <img
                  className="imgModal"
                  src={Imagen}
                  onError={addDefaultSrc}
                  alt="default"
                />
              </article>
            </section>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex flex-row">
          <button
            type="button"
            className="btnCerrarModal btn-lg"
            onClick={() => abrirCerrarModalArticulo()}
          >
            <h5>
              {"Cerrar  "}
              <AiIcons.AiOutlineCloseCircle />
            </h5>
          </button>
        </ModalFooter>
      </Modal>

      <Modal className="Progress" isOpen={mostrarProgress}>
        <ModalBody>
          <div align="center">
            <img src="/images/page/loader6.gif" alt="load1" height="8%" />
          </div>
        </ModalBody>
      </Modal>

      <Modal className="Carrito modal-xl" isOpen={ModalCarrito}>
        <ModalBody>
          <section align="center">
            <section className="row">
              <h4>
                <strong>Carrito de Compras</strong>
              </h4>
            </section>
            <TableContainer
              component={Paper}
              className="responsive"
              style={{ maxHeight: 400 }}
            >
              <Table>
                <TableHead className="custom-bg">
                  <TableRow className="TablaRowHead">
                    <TableCell align="center">
                      <label className="custom-bg">#</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">
                        Articulo
                        <br />
                        Código
                      </label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Descripción</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Precio</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Ahorro</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">
                        Precio
                        <br />
                        Final
                      </label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Cant</label>
                    </TableCell>
                    <TableCell align="center">
                      <label className="custom-bg">Total</label>
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="TablaContainerCarrito">
                  {car.map((row, i) => (
                    <TableRow
                      className="CustomRows"
                      hover
                      key={i}
                      value={row.Articulo}
                    >
                      <TableCell align="center">
                        <Avatar className="avatar-bg" src=".">
                          {i + 1}
                        </Avatar>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <text className="tipoOpe">{row.Articulo}</text>
                        <br />
                        {row.Codigo}
                      </TableCell>
                      <TableCell>
                        {row.Descripcion}
                        <br />
                        {row.SustanciaActiva !== null &&
                          "[" + row.SustanciaActiva + "]"}
                      </TableCell>
                      <TableCell align="center">
                        {"$" + financial(row.Precio)}
                      </TableCell>
                      <TableCell align="center">
                        {"$" + financial(row.Precio - row.PrecioConDescuento)}
                        <br />
                        {"(" + row.Descuento + " %)"}
                      </TableCell>
                      <TableCell align="center">
                        {"$" + financial(row.PrecioConDescuento)}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          inputProps={{
                            style: { textAlign: "center" },
                          }}
                          name={row.Articulo}
                          onChange={handleChangeCar}
                          value={row.Cantidad}
                          readOnly={false}
                        ></TextField>
                      </TableCell>
                      <TableCell align="center">
                        {" "}
                        {"$" + financial(row.PrecioConDescuento * row.Cantidad)}
                      </TableCell>
                      <TableCell align="center">
                        {row.Cantidad !== row.Existencia && (
                          <Avatar
                            className="avatar-bg"
                            src="."
                            onClick={() => addToCar(row)}
                          >
                            <FaIcons.FaPlus />
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.Cantidad > 1 && (
                          <Avatar
                            className="avatar-bg"
                            src="."
                            onClick={() => delFromCar(row.Articulo)}
                          >
                            <FaIcons.FaMinus />
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Avatar
                          className="avatar-bg"
                          src="."
                          onClick={() => delFromCar(row.Articulo, true)}
                        >
                          <FaIcons.FaTrashAlt />
                        </Avatar>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </section>
          <section className="d-flex flex-row">
            <article
              className="d-flex flex-column flex-grow-1 flex-shrink-1"
              align="center"
            >
              <Avatar
                align="center"
                variant="rounded"
                className="avatarPrecio-bg"
                src="."
              >
                Total Unidades:
              </Avatar>
              <Avatar
                align="center"
                variant="rounded"
                className="avatarPrecio2-bg"
                src="."
              >
                {QtyItems}
              </Avatar>
            </article>

            <div
              className="d-flex flex-column flex-grow-1 flex-shrink-1"
              align="center"
            >
              <Avatar
                align="center"
                variant="rounded"
                className="avatarPrecio-bg"
                src="."
              >
                Ahorro Total:
              </Avatar>
              <Avatar
                align="center"
                variant="rounded"
                className="avatarPrecio2-bg"
                src="."
              >
                {"$" + financial(Ahorro)}
              </Avatar>
            </div>

            {Conexion === "Linea" && (
              <div
                className="d-flex flex-column flex-grow-1 flex-shrink-1"
                align="center"
              >
                <Avatar
                  align="center"
                  variant="rounded"
                  className="avatarPrecio-bg"
                  src="."
                >
                  T.C.
                </Avatar>
                <Avatar
                  align="center"
                  variant="rounded"
                  className="avatarPrecio2-bg"
                  src="."
                >
                  {"$" + financial(TipoCambio)}
                </Avatar>
              </div>
            )}

            <div
              className="d-flex flex-column flex-grow-1 flex-shrink-1"
              align="center"
            >
              <Avatar
                align="center"
                variant="rounded"
                className="avatarPrecio-bg"
                src="."
              >
                Total MXN:
              </Avatar>
              <Avatar
                align="center"
                variant="rounded"
                className="avatarPrecio2-bg"
                src="."
              >
                {"$" + financial(Monto)}
              </Avatar>
            </div>

            {Conexion === "Linea" && (
              <div
                className="d-flex flex-column flex-grow-1 flex-shrink-1"
                align="center"
              >
                <Avatar
                  align="center"
                  variant="rounded"
                  className="avatarPrecio-bg"
                  src="."
                >
                  Total DLLS:
                </Avatar>
                <Avatar
                  align="center"
                  variant="rounded"
                  className="avatarPrecio2-bg"
                  src="."
                >
                  {"$" + financial(Monto / TipoCambio)}
                </Avatar>
              </div>
            )}
          </section>
        </ModalBody>
        <section className="secModalCarritoFooter  justify-content-center">
          <section className="d-flex flex-row justify-content-center">
            <article className="artFooterCarrito">
              <button
                type="button"
                className="btnCarrito  form-control"
                onClick={() => enviarAImprimir()}
              >
                <h5>
                  {"Imprimir  "}
                  <BiIcons.BiPrinter />
                </h5>
              </button>
            </article>
            <article className="artFooterCarrito">
              <button
                type="button"
                className="btnCarrito  form-control"
                onClick={() => clearCar()}
              >
                <h5>
                  {"Limpiar Carrito  "}
                  <AiIcons.AiOutlineClear />
                </h5>
              </button>
            </article>
            {Conexion === "Linea" && (
              <article className="artFooterCarrito">
                <button
                  type="button"
                  onClick={() => enviarcheckout()}
                  className="btnCarrito form-control"
                >
                  <h5>
                    {"Guardar  "}
                    <BiIcons.BiSave />
                  </h5>
                </button>
              </article>
            )}
            <article className="artFooterCarrito">
              <button
                type="button"
                className="btnCarrito form-control"
                onClick={() => abrirCerrarModalCarrito()}
              >
                <h5>
                  {"Cerrar  "}
                  <AiIcons.AiOutlineCloseCircle />
                </h5>
              </button>
            </article>
          </section>
        </section>
      </Modal>

      <Modal /*** MODAL IMPRIMIR **/
        className="Imprimir d-flex modal-sm"
        isOpen={ModalImprimir}
        onOpened={() => imprimirTicket()}
        media="print"
      >
        <section
          className="secHeaderImprimir d-flex flex-column"
          align="center"
        >
          <small className="titularTicket">
            {" * * FARMACIA LA MAS BARATA * * "}
          </small>
          <small className="titularTicket">{"Sucursal " + Sucursal}</small>
          {ClienteABuscar.length > 3 && (
            <small className="titularTicket">
              {"Cliente:  " + ClienteABuscar}
            </small>
          )}
        </section>
        <section className="secHeaderImprimir d-flex flex-row" align="center">
          <article className="TitularesTicket col-3">
            <small>{"COD"}</small>
          </article>
          <article className="TitularesTicket flex-grow-1">
            <small>{"DESCRIPCION"}</small>
          </article>
          <article className="TitularesTicket col-2">
            <small>{"CANT"}</small>
          </article>
          <article className="TitularesTicket col-2">
            <small>{"PRECIO"}</small>
          </article>
        </section>
        {car.map((row, i) => (
          <section className="secBodyImprimir d-flex flex-row" align="center">
            <article className="artDetalleTicket col-3">
              <small>{row.Articulo}</small>
            </article>
            <article className="artDetalleTicket flex-grow-1" align="left">
              <small>{row.Descripcion}</small>
            </article>
            <article className="artDetalleTicket col-2">
              <small>{row.Cantidad}</small>
            </article>
            <article className="artDetalleTicket col-2">
              <small>{"$" + financial(row.PrecioConDescuento)}</small>
            </article>
          </section>
        ))}
        <section className="secTotalesTicket d-flex flex-column" align="right">
          <article className="artPreciosTicket">
            {"Total Pesos: $" + financial(Monto)}
          </article>
          <article className="artPreciosTicket">
            {"Total Dlls: $" + financial(Monto / TipoCambio)}
          </article>
          <article className="artPreciosTicket" align="center">
            {"Usted Ahorro: $" + financial(Ahorro)}
          </article>
        </section>
        <section className="secAtendio d-flex flex-column" align="center">
          <br />
          {AgenteABuscar.length > 3 && (
            <article className="">Le atendio: {AgenteABuscar}</article>
          )}
        </section>
        <br />
        <section
          className="secHeaderImprimir d-flex flex-column"
          align="center"
        >
          <small className="titularTicket">
            {" * * GRACIAS POR SU PREFERENCIA * * "}
          </small>
          <br />
        </section>
      </Modal>

      <Modal /*** MODAL CHECKOUT **/
        className="CheckOut d-flex modal-lg"
        isOpen={ModalCheckOut}
      >
        <ModalBody>
          <section className="secHeaderCheckout d-flex flex-column">
            <h4>Agente</h4>
          </section>
          <section className="SecDatosAgente d-flex flex-row" align="center">
            <article className="InputsAgentes col-2">
              <input
                type="text"
                class="form-control custom-input"
                placeholder="#"
                value={NumAgente}
                readOnly
              ></input>
            </article>
            <article className="InputsAgentes flex-grow-1">
              <input
                type="text"
                class="form-control custom-input"
                value={AgenteABuscar}
                onChange={hancleChangeAgente}
                placeholder="Nombre"
              ></input>
              <Dropdown
                className="ddDropAutocompletar"
                isOpen={!ocultarAutoComplAgente}
              >
                <DropdownMenu
                  className="ddMenuDesplegable"
                  style={{ maxHeight: 200 }}
                >
                  {AgentesData.map((opcion) => (
                    <DropdownItem
                      align="left"
                      value={opcion.Agente}
                      onClick={seleccionarAgente}
                    >
                      {opcion.Nombre}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </article>
            <article className="col-1 d-flex align-items-end" align="left">
              <BiIcons.BiSearchAlt
                className="LupaIcon"
                onClick={() => clickBusquedaAgente()}
              />
            </article>
          </section>
          <section className="secHeaderCheckout2 d-flex flex-column">
            <h4>Cliente</h4>
          </section>
          <section className="SecDatosCliente d-flex flex-row" align="center">
            <article className="InputsClientes col-2">
              <input
                type="text"
                class="form-control custom-input"
                placeholder="#"
                value={NumCliente}
                readOnly
              ></input>
            </article>
            <article className="InputsClientes flex-grow-1">
              <input
                type="text"
                class="form-control custom-input"
                value={ClienteABuscar}
                onChange={hancleChangeCliente}
                placeholder="Nombre"
              ></input>
              <Dropdown
                className="ddDropAutocompletar"
                isOpen={!ocultarAutoComplCliente}
              >
                <DropdownMenu
                  className="ddMenuDesplegable"
                  style={{ maxHeight: 200 }}
                >
                  {ClientesData.map((opcion) => (
                    <DropdownItem
                      align="left"
                      value={opcion.Cliente}
                      onClick={seleccionarCliente}
                    >
                      {opcion.Nombre}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </article>
            <article className="col-1 d-flex align-items-end" align="left">
              <BiIcons.BiSearchAlt
                className="LupaIcon"
                onClick={() => clickBusquedaCliente()}
              />
            </article>
          </section>
        </ModalBody>
        <section className="secModalAgClieFooter">
          <section className="secModalCarritoFooter d-flex flex-row justify-content-center">
            <article className="artFooterAgeClient">
              <button
                type="button"
                className="btnCarrito form-control"
                onClick={() => enviarcheckout()}
              >
                <h5>
                  {"Regresar  "}
                  <FaIcons.FaBackspace />
                </h5>
              </button>
            </article>
            {NumAgente.length > 0 && (
              <article className="artFooterAgeClient">
                <button
                  type="button"
                  className="btnCarrito form-control"
                  onClick={() => peticionGuardarCotizacion()}
                >
                  <h5>
                    {"Guardar  "}
                    <BiIcons.BiSave />
                  </h5>
                </button>
              </article>
            )}
            <article className="artFooterAgeClient">
              <button
                type="button"
                className="btnCarrito form-control"
                onClick={() => abrirCerrarModalCheckOut()}
              >
                <h5>
                  {"Cerrar  "}
                  <AiIcons.AiOutlineCloseCircle />
                </h5>
              </button>
            </article>
          </section>
        </section>
      </Modal>

      <Modal className="d-flex modal-lg" isOpen={ModalDatosClienteAgente}>
        <ModalBody>
          <section className="secHeaderCheckout d-flex flex-column">
            <h4>{"Datos del " + TipoBusquedaAgenteCliente}</h4>
          </section>
          {TipoBusquedaAgenteCliente === "Cliente" && (
            <section className=" d-flex flex-column">
              <section className=" d-flex flex-row">
                <input
                  type="text"
                  class="form-control custom-input flex-grow-1"
                  value={ClienteABuscar}
                  onChange={hancleChangeCliente2}
                  placeholder="Nombre"
                ></input>
                <article className="col-5"></article>
              </section>
              <TableContainer component={Paper} className="tablaAgentes">
                <Table aria-label="simple table">
                  <TableHead className="custom-bg">
                    <TableRow className="TablaRowHead d-flex flex-row">
                      <TableCell className="col-2" align="center">
                        <label className="custom-bg">#</label>
                      </TableCell>
                      <TableCell className="flex-grow-1" align="center">
                        <label className="custom-bg">Nombre</label>
                      </TableCell>
                      <TableCell className="col-3" align="left">
                        <label className="custom-bg">Telefono</label>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {AgenteABuscar.length > 3 && (
                <TableContainer
                  component={Paper}
                  className="tablaAgentes2"
                  style={{ maxHeight: 350 }}
                >
                  <Table aria-label="simple table">
                    <TableBody>
                      {ClientesData2.map((cliente) => (
                        <TableRow
                          className="d-flex flex-row"
                          onClick={() =>
                            asignarCliente(cliente.Cliente, cliente.Nombre)
                          }
                        >
                          <TableCell className="col-2" align="center">
                            <label>{cliente.Cliente}</label>
                          </TableCell>
                          <TableCell className="flex-grow-1" align="center">
                            <label>{cliente.Nombre}</label>
                          </TableCell>
                          <TableCell className="col-3" align="left">
                            <label>{cliente.Telefonos}</label>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </section>
          )}
          {TipoBusquedaAgenteCliente === "Agente" && (
            <section className=" d-flex flex-column">
              <section className=" d-flex flex-row">
                <input
                  type="text"
                  class="form-control custom-input flex-grow-1"
                  value={AgenteABuscar}
                  onChange={hancleChangeAgente2}
                  placeholder="Nombre"
                ></input>
                <article className="col-5"></article>
              </section>
              <TableContainer component={Paper} className="tablaAgentes">
                <Table aria-label="simple table">
                  <TableHead className="custom-bg">
                    <TableRow className="TablaRowHead">
                      <TableCell className="col-2" align="center">
                        <label className="custom-bg">Agente</label>
                      </TableCell>
                      <TableCell className="flex-grow-1" align="center">
                        <label className="custom-bg">Nombre</label>
                      </TableCell>
                      <TableCell className="col-3" align="center">
                        <label className="custom-bg">Tipo</label>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {AgenteABuscar.length > 3 && (
                <TableContainer
                  component={Paper}
                  className="tablaAgentes2"
                  style={{ maxHeight: 350 }}
                >
                  <Table aria-label="simple table">
                    <TableBody>
                      {AgentesData2.map((agente) => (
                        <TableRow
                          onClick={() =>
                            asignarAgente(agente.Agente, agente.Nombre)
                          }
                        >
                          <TableCell className="col-2" align="center">
                            <label>{agente.Agente}</label>
                          </TableCell>
                          <TableCell className="flex-grow-1" align="center">
                            <label>{agente.Nombre}</label>
                          </TableCell>
                          <TableCell className="col-3" align="center">
                            <label>{agente.Tipo}</label>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </section>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="d-flex">
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={abrirCerrarModalAgenteCliente}
            >
              <h6>Regresar</h6>
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <section className="secFooter d-flex p-1">
        <h6 className="tipoOpe">
          Dirección: {window.location.href + "  "}
          || Base de Datos: {Conexion + "  "}
          || Gateway: {Getway + "  "}
          || Sucursal: {Sucursal + "  "}
          {Conexion === "Linea" && "|| TipoCambio: $" + TipoCambio}
        </h6>
      </section>
    </div>
  );
}
