import React, { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./busquedaArticulos.css";
import axios from "axios";
//import LogoImg from '@file://192.168.13.30/Imagenes/Articulos/default.png';
import { Modal, ModalBody, ModalFooter } from "reactstrap";

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

/* Todo para el Carrito de compras */
import {
  shoppingReducer,
  shoppinInitialState,
} from "./reducers/shoppingReducer";
import { TYPES } from "./actions/shoppingActions";
/* Todo para el Carrito de compras */

export default function Articulos() {
  const baseUrl = "https://" + adquirirUrl() + ":443/api/BusquedaArticulos";

  const [articulos, setArticulos] = useState([]);
  const [sugeridos, setSugeridos] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [autocompletar, setAutocompletar] = useState([]);
  const [GatewayData, setGatewayData] = useState([]);

  const [verTabla, setVerTabla] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarProgress, setMostrarProgress] = useState(false);
  const [CambiarTipo, setCambiarTipo] = useState(false);
  const [ModalArticulo, setModalArticulo] = useState(false);
  const [ModalSucursal, setModalSucursal] = useState(false);
  const [ModalCarrito, setModalCarrito] = useState(false);
  const [ModalCheckOut, setModalCheckOut] = useState(false);
  const [ModalImprimir, setModalImprimir] = useState(false);
  const [ocultarAutoCompletar, setOcultarAutoCompletar] = useState(true);
  const [verSugeridosSucursales, setVerSugeridosSucursales] = useState(false);
  const [verPrecios, SetVerPrecios] = useState(false);
  const [verSustanciaActiva, setVerSustanciaActiva] = useState(false);

  const [Sucursal, setSucursal] = useState(0);
  const [TipoCambio, setTipoCambio] = useState(0);
  const [TipoBusqueda, setTipoBusqueda] = useState(1);

  const [Imagen, setImagen] = useState(
    `${process.env.PUBLIC_URL}/images/page/default.png`
  );
  const [TextoCompleto, setTextoCompleto] = useState("");
  const [TextoABuscar, setTextoABuscar] = useState("");
  const [TextoSugerido, setTextoSugerido] = useState("");
  const [Getway, setGetway] = useState("");
  const [Conexion, setConexion] = useState("");
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
      (item) => (monto = monto + item.PrecioConDescuento * item.quantity)
    );

    car.map(
      (item) =>
        (ahorro =
          ahorro + (item.Precio - item.PrecioConDescuento) * item.quantity)
    );

    car.map((item) => (qty = qty + item.quantity));

    setMonto(monto);
    setAhorro(ahorro);
    setQtyItems(qty);
  };

  const handleChangeCar = (e) => {
    const { name, value } = e.target;

    console.log(name, value);
    if (value !== null && value !== "") {
      let itemCar = name.replaceAll(" ", "");
      let articuloInCar = car.find((item) => item.Articulo === itemCar);

      var qtyAnt = articuloInCar.quantity;
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
    dispatch({ type: TYPES.ADD_TO_CAR, payload: articulo });
    setMonto(Monto + articulo.PrecioConDescuento);
    setAhorro(Ahorro + (articulo.Precio - articulo.PrecioConDescuento));
    setQtyItems(QtyItems + 1);
    console.log("carrito: ", car);
  };

  const delFromCar = (Articulo, all = false) => {
    let articuloInCar = car.find((item) => item.Articulo === Articulo);

    if (all) {
      if (car.length === 1) {
        setModalCarrito();
      }
      dispatch({ type: TYPES.REMOVE_ALL_FROM_CAR, payload: Articulo });
      setMonto(
        Monto - articuloInCar.quantity * articuloInCar.PrecioConDescuento
      );
      setAhorro(
        Ahorro -
          (articuloInCar.Precio - articuloInCar.PrecioConDescuento) *
            articuloInCar.quantity
      );
      setQtyItems(QtyItems - articuloInCar.quantity);
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

  const abrirCerrarModalArticulo = () => {
    setModalArticulo(!ModalArticulo);
  };

  const abrirCerrarModalSucursal = () => {
    setModalSucursal(!ModalSucursal);
  };

  const abrirCerrarModalCarrito = () => {
    calcularMontos();
    setModalCarrito(!ModalCarrito);
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
    //console.log(datosBusqueda);
    if (TipoBusqueda !== 2) {
      setTextoSugerido(e.target.value);
      //console.log(datosBusqueda);
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
          <div className="ContainerMenuIcon p-1">
            <ImIcons.ImMenu className="MenuIcon" />
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
              <div className="col-3">
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
              <div className="col-5">
                <input
                  type="text"
                  className="form-control custom-input"
                  name="textoabuscar"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  value={TextoCompleto}
                />
              </div>
              <div hidden={ocultarAutoCompletar} className="col-4">
                {TextoCompleto.length > 2 && (
                  <select
                    name="Autocompletar"
                    onChange={handleChangeSelect}
                    className="form-control custom-drop"
                  >
                    <option header>Seleccione</option>
                    {autocompletar.map((opcion) =>
                      verSustanciaActiva ? (
                        <option align="left" value={opcion.SustanciaActiva}>
                          {opcion.SustanciaActiva}
                        </option>
                      ) : (
                        <option align="left" value={opcion.Articulo}>
                          {opcion.Articulo + ": " + opcion.Descripcion}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="QtyItemsCar" onClick={abrirCerrarModalCarrito}>
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow
                        className="CustomRows"
                        hover
                        key={i}
                        value={row.Articulo}
                        onClick={() => seleccionarArticulo(row, "Seleccionar")}
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
                            onClick={() => seleccionarArticulo(row, "Sugerir")}
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
                          {"$" + financial(row.Precio - row.PrecioConDescuento)}
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
                            value={row.quantity}
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
          </TableContainer>
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
                        onClick={() => seleccionarArticulo(row, "Seleccionar")}
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
            </TableContainer>
          )}
          {verSugeridosSucursales === true && sugeridos.length > 0 && (
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
                      "$ " + financial(articuloSeleccionado.PrecioConDescuento)}
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

      <Modal isOpen={ModalSucursal}>
        <ModalBody>
          <div align="center" className="divDisponibleHeader2 p-2">
            <h3>Disponibilidad por Sucursal</h3>
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
          <div className="divDisponiblesContainer2">
            {disponibles.map((row) => (
              <article className="d-flex flex-row">
                <item
                  key={row.Sucursal}
                  className="d-flex flex-grow-1 justify-content-center"
                  align="center"
                >
                  <h5>{row.Sucursal}</h5>
                </item>
                <item className="d-flex flex-grow-1 justify-content-center">
                  <h5>{row.Existencia}</h5>
                </item>
              </article>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="form-control btnCerrarModal"
            onClick={() => abrirCerrarModalSucursal()}
          >
            Cerrar
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
            <h6>Cerrar</h6>
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
          <div align="center">
            <div className="row">
              <div className="col-sm-12 my-1">
                <h4>
                  <strong>Carrito de Compras</strong>
                </h4>
                <TableContainer
                  component={Paper}
                  className="responsive"
                  style={{ maxHeight: 400 }}
                >
                  <Table aria-label="simple table">
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
                            {"$" +
                              financial(row.Precio - row.PrecioConDescuento)}
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
                              value={row.quantity}
                              readOnly={false}
                            ></TextField>
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            {"$" +
                              financial(row.PrecioConDescuento * row.quantity)}
                          </TableCell>
                          {row.quantity !== row.Existencia && (
                            <TableCell align="center">
                              <Avatar
                                className="avatar-bg"
                                src="."
                                onClick={() => addToCar(row)}
                              >
                                <FaIcons.FaPlus />
                              </Avatar>
                            </TableCell>
                          )}
                          {row.quantity > 1 && (
                            <TableCell align="center">
                              <Avatar
                                className="avatar-bg"
                                src="."
                                onClick={() => delFromCar(row.Articulo)}
                              >
                                <FaIcons.FaMinus />
                              </Avatar>
                            </TableCell>
                          )}
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
                <TableContainer
                  component={Paper}
                  className="TablaContainerModalSuc responsive"
                  style={{ maxHeight: 350 }}
                >
                  <Table aria-label="simple table">
                    <TableBody></TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
          <div className="d-flex flex-row-reverse ">
            {Conexion === "Linea" && (
              <div className="" align="center">
                <Avatar
                  align="right"
                  variant="rounded"
                  className="avatarPrecio-bg"
                  src="."
                >
                  Total DLLS:
                </Avatar>
                <Avatar
                  align="right"
                  variant="rounded"
                  className="avatarPrecio2-bg"
                  src="."
                >
                  {"$" + financial(Monto / TipoCambio)}
                </Avatar>
              </div>
            )}
            <div className="" align="center">
              <Avatar
                align="right"
                variant="rounded"
                className="avatarPrecio-bg"
                src="."
              >
                Total MXN:
              </Avatar>
              <Avatar
                align="right"
                variant="rounded"
                className="avatarPrecio2-bg"
                src="."
              >
                {"$" + financial(Monto)}
              </Avatar>
            </div>

            {Conexion === "Linea" && (
              <div className="" align="center">
                <Avatar
                  align="right"
                  variant="rounded"
                  className="avatarPrecio-bg"
                  src="."
                >
                  T.C.
                </Avatar>
                <Avatar
                  align="right"
                  variant="rounded"
                  className="avatarPrecio2-bg"
                  src="."
                >
                  {"$" + financial(TipoCambio)}
                </Avatar>
              </div>
            )}
            <div className="" align="center">
              <Avatar
                align="right"
                variant="rounded"
                className="avatarPrecio-bg"
                src="."
              >
                Ahorro Total:
              </Avatar>
              <Avatar
                align="right"
                variant="rounded"
                className="avatarPrecio2-bg"
                src="."
              >
                {"$" + financial(Ahorro)}
              </Avatar>
            </div>
            <div className="" align="center">
              <Avatar
                align="right"
                variant="rounded"
                className="avatarPrecio-bg"
                src="."
              >
                Total Unidades:
              </Avatar>
              <Avatar
                align="right"
                variant="rounded"
                className="avatarPrecio2-bg"
                src="."
              >
                {QtyItems}
              </Avatar>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-center ">
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={() => enviarAImprimir()}
            >
              <h6>Imprimir</h6>
            </button>
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={() => clearCar()}
            >
              <h6>Limpiar Carrito</h6>
            </button>
            {Conexion === "Linea" && (
              <button
                type="button"
                onClick={() => enviarcheckout()}
                className="custom-bg btn-lg"
              >
                <h6>Guardar</h6>
              </button>
            )}
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={() => abrirCerrarModalCarrito()}
            >
              <h6>Cerrar</h6>
            </button>
          </div>
        </ModalFooter>
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
              <small>{row.quantity}</small>
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
          <article className="">Le atendio: LUIS</article>
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
        <section>
          <h5>CheckOut</h5>
        </section>
        <ModalBody></ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-center ">
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={() => enviarAImprimir()}
            >
              <h6>Imprimir</h6>
            </button>
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={() => enviarcheckout()}
            >
              <h6>regresar</h6>
            </button>
            <button
              type="button"
              onClick={console.log("its ok")}
              className="custom-bg btn-lg"
            >
              <h6>Guardar</h6>
            </button>
            <button
              type="button"
              className="custom-bg btn-lg"
              onClick={() => abrirCerrarModalCheckOut()}
            >
              <h6>Cerrar</h6>
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
