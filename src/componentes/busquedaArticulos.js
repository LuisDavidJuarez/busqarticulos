import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./busquedaArticulos.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TablePagination,
  Avatar,
} from "@material-ui/core";
import * as ImIcons from "react-icons/im";
import * as TiIcons from "react-icons/ti";

export default function Articulos() {
  const baseUrl = "https://localhost:44371/api/BusquedaArticulos";

  const [articulos, setArticulos] = useState([]);
  const [sugeridos, setSugeridos] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [autocompletar, setAutocompletar] = useState([]);
  const [GatewayData, setGatewayData] = useState([]);

  const [verTabla, setVerTabla] = useState(false);
  const [CambiarTipo, setCambiarTipo] = useState(false);
  const [ModalArticulo, setModalArticulo] = useState(false);
  const [ModalSucursal, setModalSucursal] = useState(false);
  const [ocultarAutoCompletar, setOcultarAutoCompletar] = useState(true);
  const [verSugeridosSucursales, setVerSugeridosSucursales] = useState(false);
  const [verPrecios, SetVerPrecios] = useState(false);
  const [verSustanciaActiva, setVerSustanciaActiva] = useState(false);

  const [Sucursal, setSucursal] = useState(0);
  const [TipoBusqueda, setTipoBusqueda] = useState(1);

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
    var vSucursal = "";
    var vGateway = "";
    var vConexion = "";
    peticionGetGatewayData();

    console.log("GatewayData: ", GatewayData);

    if (GatewayData.length !== 0) {
      GatewayData.map((data) => (vSucursal = data.Sucursal));
      GatewayData.map((data) => (vGateway = data.IP));
      GatewayData.map((data) => (vConexion = data.Conexion));
      setSucursal(vSucursal);
      setGetway(vGateway);
      setConexion(vConexion);
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
        console.log("ver sustancia activa on");
        setVerSustanciaActiva(true);
      } else {
        setVerSustanciaActiva(false);
      }
      setTextoCompleto("");
    } else {
      setOcultarAutoCompletar(false);
      setVerSugeridosSucursales(false);
      setTextoCompleto(value);
      console.log("value", value);
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
    IniciarValores();

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
      if(Conexion === 'Linea'){
        peticionGetDisponibles();
      }
    }

    //eslint-disable-next-line
  }, [TextoCompleto, TextoSugerido, TipoBusqueda]);

  return (
    <body className="cuerpo container-fluid" onLoad={() => IniciarValores()}>
      <head>
        <link
          href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <div align="center">
        <div className="divTitulo" align="center">
          <h5>Pantalla Busqueda por Descripción</h5>
        </div>
        <div className="divHeader row">
          <div
            className="col-sm-1 my-1 border border-dark container-fluid"
            align="center"
          >
            <ImIcons.ImMenu responsive="true" alt="Menu" className="allIcons" />
          </div>
          <div className="col-sm-1 my-1 border border-dark">
            <img
              src="/images/pages/logoweb.png"
              alt="Logo"
              className="allImg"
            />
          </div>
          <div className="col-sm-8 my-1 border border-dark">
            <div className="col-sm-12 my-1 row">
              <div className="col-sm-3 my-1 row">
                <select
                  name="tipo"
                  onChange={handleChange}
                  className="custom-drop"
                >
                  {OpcionesBusq.map((opcion) => (
                    <option className="text-dark" value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-5 my-1 row">
                <input
                  type="text"
                  className="custom-drop"
                  name="textoabuscar"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  value={TextoCompleto}
                />
              </div>
              <div hidden={ocultarAutoCompletar} className="col-sm-4 my-1 row">
                {TextoCompleto.length > 2 && (
                  <select
                    name="Autocompletar"
                    onChange={handleChangeSelect}
                    className="custom-drop nonbordered"
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
          <div className="col-sm-1 my-1 border border-dark">
            <TiIcons.TiShoppingCart className="allIcons" />
          </div>
          <div className="col-sm-1 my-1 border border-dark">
            <img
              src="/images/pages/descuento.png"
              alt="Desc"
              className="allImg"
            />
          </div>
        </div>

        <div className="divBody row container-fluid pt-0" align="top">
          <div className="col-sm-9 my-3 border border-dark">
            <TableContainer
              id="TablaPrincipal"
              component={Paper}
              className="responsive"
            >
              <Table aria-label="simple table">
                <TableHead className="custom-bg">
                  <TableRow className="TablaRowHead">
                    <TableCell>
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
                    <TableCell>
                      <label className="custom-bg">Precio</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Ahorro</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">
                        Precio
                        <br />
                        Final
                      </label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Exist</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Tipo</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Estatus</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg"></label>
                    </TableCell>
                  </TableRow>
                </TableHead>
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
                          {"[" + row.SustanciaActiva + "]"}
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
                        <TableCell align="center">
                          <Avatar className="avatar-bg" src=".">
                            +
                          </Avatar>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TableFooter>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={articulos.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableFooter>
            {verSugeridosSucursales === true && sugeridos.length !== 0 && (
              <div className="custom-bg">
                <h4>Articulos Sugeridos</h4>
              </div>
            )}
            <TableContainer
              hidden={!verSugeridosSucursales}
              component={Paper}
              className="responsive"
            >
              <Table aria-label="simple table">
                <TableHead className="custom-invisible">
                  <TableRow className="custom-bg">
                    <TableCell>
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
                    <TableCell>
                      <label className="custom-bg">Precio</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Ahorro</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">
                        Precio
                        <br />
                        Final
                      </label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Exist</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Tipo</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg">Estatus</label>
                    </TableCell>
                    <TableCell>
                      <label className="custom-bg"></label>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sugeridos
                    .slice(
                      page2 * rowsPerPage2,
                      page2 * rowsPerPage2 + rowsPerPage2
                    )
                    .map((row, i) => (
                      <TableRow
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
                            onClick={() => seleccionarArticulo(row, "Ver")}
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
                          {"[" + row.SustanciaActiva + "]"}
                        </TableCell>
                        <TableCell align="center">
                          {"$ " + financial(row.Precio)}
                        </TableCell>
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
                          <Avatar className="avatar-bg" src=".">
                            +
                          </Avatar>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {verSugeridosSucursales === true && sugeridos.length !== 0 && (
              <TableFooter>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={sugeridos.length}
                  rowsPerPage={rowsPerPage2}
                  page={page2}
                  onPageChange={handleChangePage2}
                  onRowsPerPageChange={handleChangeRowsPerPage2}
                />
              </TableFooter>
            )}
          </div>
          <div className="col-sm-3 my-1">
            <div className="border border-dark">
              <img
                src={`${process.env.PUBLIC_URL}/images/articulos/CAD13600.png`}
                alt="CAD13600"
                width="80%"
                className="img-fluid bordered"
              />
            </div>
            <p></p>
            {verPrecios && (
              <div className="col-sm-12 my-1 row" align="center">
                <Avatar
                  align="left"
                  width="10%"
                  variant="rounded"
                  className="avatarPrecio-bg"
                  src="."
                >
                  Precio:
                </Avatar>
                <Avatar
                  align="right"
                  variant="rounded"
                  className="avatarPrecio-bg"
                  src="."
                >
                  Ahorro:
                </Avatar>
              </div>
            )}
            {verPrecios && (
              <div className="col-sm-12 my-1 row" align="center">
                <Avatar variant="rounded" className="avatarPrecio-bg" src=".">
                  {articuloSeleccionado &&
                    "$ " + financial(articuloSeleccionado.PrecioConDescuento)}
                </Avatar>
                <Avatar variant="rounded" className="avatarPrecio-bg" src=".">
                  {articuloSeleccionado &&
                    "$ " +
                      financial(
                        articuloSeleccionado.Precio -
                          articuloSeleccionado.PrecioConDescuento
                      )}
                </Avatar>
              </div>
            )}
            <p></p>
            {verSugeridosSucursales && (
              <div className="col-sm-14 my-1 border border-dark">
                <div align="center" className="custom-bg row container-fluid">
                  <label>Disponibles</label>
                </div>
                <TableContainer
                  compontent={Paper}
                  className="TablaDisponiblesHeader"
                >
                  <Table className="TablaDisponibles" aria-label="simple table">
                    <TableHead className="custom-bg">
                      <TableRow className="custom-bg" align="center">
                        <TableCell className="custom-bg" align="center">
                          <label>Sucursal</label>
                        </TableCell>
                        <TableCell className="custom-bg" align="center">
                          <label>Existencia</label>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                <TableContainer
                  compontent={Paper}
                  className="TablaDisponiblesData"
                >
                  <Table className="TablaDisponibles" aria-label="simple table">
                    <TableBody class="bodyDisponibles">
                      {disponibles.slice(0, 10).map((row) => (
                        <TableRow
                          class="rowDisponibles col-sm-6 my-1"
                          key={row.Sucursal}
                        >
                          <TableCell class="CellDisponibles col-sm-6 my-1">
                            <label>{row.Sucursal}</label>
                          </TableCell>
                          <TableCell class="CellDisponibles col-sm-6 my-1">
                            <label>{row.Existencia}</label>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div align="right" className="custom-bg row container-fluid">
                  <label onClick={() => abrirCerrarModalSucursal()}>
                    ver mas
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <Modal isOpen={ModalSucursal}>
          <ModalBody>
            <TableContainer component={Paper} className="responsive">
              <Table aria-label="simple table">
                <TableHead className="custom-bg">
                  <TableRow className="custom-bg">
                    <TableCell className="custom-bg">
                      <label>Sucursal</label>
                    </TableCell>
                    <TableCell className="custom-bg">
                      <label>Existencia</label>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <TableContainer
              component={Paper}
              className="TablaContainerModalSuc responsive"
              style={{ maxHeight: 350 }}
            >
              <Table aria-label="simple table">
                <TableBody>
                  {disponibles.map((row) => (
                    <TableRow key={row.Sucursal}>
                      <TableCell component="th" scope="row">
                        {row.Sucursal}
                      </TableCell>
                      <TableCell>{row.Existencia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <button
              className="custom-bg"
              onClick={() => abrirCerrarModalSucursal()}
            >
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={ModalArticulo}>
          <ModalBody>
            <div className="custom-bg border border-dark" align="center">
              <h4>
                <p>Datos del Articulo</p>
              </h4>
            </div>
            <div className="row" align="center">
              <div className="col-sm-6">
                <label>Articulo:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="articulo"
                  value={articuloSeleccionado && articuloSeleccionado.Articulo}
                />{" "}
                <br />
              </div>
              <div className="col-sm-6">
                <label>Codigo:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="codigo"
                  value={articuloSeleccionado && articuloSeleccionado.Codigo}
                />{" "}
                <br />
              </div>
            </div>
            <div className="row" align="center">
              <div className="col-sm-8 my-3">
                <label>Descripción:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="descripcion"
                  value={
                    articuloSeleccionado && articuloSeleccionado.Descripcion
                  }
                />{" "}
                <br />
              </div>
              <div className="col-sm-4 my-3 ">
                <img
                  src={`${process.env.PUBLIC_URL}/images/articulos/${
                    articuloSeleccionado && articuloSeleccionado.Articulo
                  }.png`}
                  alt={`${
                    articuloSeleccionado && articuloSeleccionado.Articulo
                  }`}
                  width="100%"
                />
              </div>
            </div>
            <div className="row" align="center">
              <div className="col-sm-3 my-3">
                {" "}
                <br />
                <label>Precio:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="precio"
                  value={
                    "$ " + articuloSeleccionado && articuloSeleccionado.Precio
                  }
                />{" "}
                <br />
              </div>
              <div className="col-sm-3 my-3">
                {" "}
                <br />
                <label>Descuento:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="descuento"
                  value={
                    articuloSeleccionado &&
                    articuloSeleccionado.Descuento + " %"
                  }
                />{" "}
                <br />
              </div>
              <div className="col-sm-3 my-3">
                <label>Precio Con Descuento:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="PrecioConDescuento"
                  value={
                    "$$ " + articuloSeleccionado &&
                    articuloSeleccionado.PrecioConDescuento
                  }
                />{" "}
                <br />
              </div>
              <div className="col-sm-3 my-3">
                {" "}
                <br />
                <label>Existencia:</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="Existencia"
                  value={
                    articuloSeleccionado && articuloSeleccionado.Existencia
                  }
                />{" "}
                <br />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="custom-bg"
              onClick={() => abrirCerrarModalArticulo()}
            >
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
        <div className="divFooter" align="left">
          <label>
            Dirección: {window.location.href}
            || Base de Datos: {Conexion}
            || Gateway: {Getway}
            || Sucursal: {Sucursal}
          </label>
        </div>
      </div>
    </body>
  );
}
