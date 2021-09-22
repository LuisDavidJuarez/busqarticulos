import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './busquedaArticulos.css'
import axios from 'axios';
import {
    Modal,
    ModalBody,
    ModalFooter
} from 'reactstrap';
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
    Avatar
} from '@material-ui/core';

export default function Articulos() {

    const [articulos, setArticulos] = useState([])
    const [sugeridos, setSugeridos] = useState([])
    const [disponibles, setDisponibles] = useState([])
    const [autocompletar, setAutocompletar] = useState([])

    const baseUrl = "https://localhost:44371/api/BusquedaArticulos";
    const [ModalArticulo, setModalArticulo] = useState(false);
    const [ModalSucursal, setModalSucursal] = useState(false);
    const [verAutoCompletar, setVerAutoCompletar] = useState(true);
    const [TextoCompleto, setTextoCompleto] = useState('');
    const [Sucursal, setSucursal] = useState(23);
    const [articuloSeleccionado, setarticuloSeleccionado] = useState({
        Articulo: '',
        Codigo: '',
        Descripcion: '',
        Precio: '',
        Descuento: '',
        Existencia: '',
        Gen_Pat: ''
    })

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
    }

    const abrirCerrarModalSucursal = () => {
        setModalSucursal(!ModalSucursal);
    }

    const seleccionarArticulo = (articulo, caso) => {
        setarticuloSeleccionado(articulo);
        abrirCerrarModalArticulo();
        (caso === "Sugerir") &&
            asignarSugerido(articulo.Articulo);
    }

    const asignarSugerido = (textosugerido) => {
        setDatosBusqueda({
            ...datosBusqueda,
            sugerido: textosugerido
        });
    }

    const OpcionesBusq = [
        {
            label: "Descripción",
            value: 1
        },
        {
            label: "Sustancia Activa",
            value: 2
        },
        {
            label: "Articulo",
            value: 3
        }
    ];

    const handleChange = e => {
        const { name, value } = e.target;
        setDatosBusqueda({
            ...datosBusqueda,
            [name]: value
        })
        if (name === "tipo") {
            setTextoCompleto("");
            setVerAutoCompletar(true);
        }
        else {
            setTextoCompleto(value);
        }
    }

    const handleChangeSelect = e => {
        setTextoCompleto(e.target.value);
        setVerAutoCompletar(true);
        console.log(e.target.value, datosBusqueda)
    }

    const [datosBusqueda, setDatosBusqueda] = useState({
        textoabuscar: '',
        tipo: 1,
        sucursal: Sucursal,
        sugerido: ''
    })

    const peticionGetArticulo = async (datosBusqueda) => {
        await axios.get(baseUrl + "/" + datosBusqueda.sucursal +
            "/" + datosBusqueda.tipo +
            "/" + datosBusqueda.textoabuscar)
            .then(response => {
                setArticulos(response.data);
                setPage(0);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetSugeridos = async (datosBusqueda) => {
        await axios.get(baseUrl + "/Sugeridos" +
            "/" + datosBusqueda.sucursal +
            "/" + datosBusqueda.sugerido)
            .then(response => {
                setSugeridos(response.data);
                setPage2(0);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetDisponibles = async (datosBusqueda) => {
        await axios.get(baseUrl + "/Disponibles" +
            "/" + datosBusqueda.sugerido)
            .then(response => {
                setDisponibles(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetAutocompletar = async (datosBusqueda, TextoCompleto) => {
        await axios.get(baseUrl + "/" + datosBusqueda.tipo +
            "/" + datosBusqueda.textoabuscar)
            .then(response => {
                setAutocompletar(response.data);
            }).catch(error => {
                console.log(error);
            })
        if (TextoCompleto !== "") {
            setVerAutoCompletar(false);
        }
        else {
            setVerAutoCompletar(true);
        }
    }

    useEffect(() => {
        setSucursal(23);
        if (datosBusqueda.textoabuscar.length > 2) {

            peticionGetArticulo(datosBusqueda);
            peticionGetAutocompletar(datosBusqueda);

            (datosBusqueda.sugerido !== "") &&
                peticionGetSugeridos(datosBusqueda);

            (datosBusqueda.sugerido !== "") &&
                peticionGetDisponibles(datosBusqueda);
        }
    }, [datosBusqueda])

    return (
        <body className="cuerpo container-fluid">
            <head>
                <link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
            </head>
            <div align="center">
                <div className="custom-bg position:absolute" align="center">
                    <h5>Pantalla Busqueda por Descripción</h5>
                </div>
                <div className="row container-fluid">
                    <div className="col-sm-1 my-1 border border-dark container-fluid" align="center">
                        <img
                            src="images/page/menu.png"
                            responsive="true"
                            alt="Menu"
                            width="60%"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-sm-1 my-1 border border-dark">
                        <img src="images/page/logoweb.png" alt="Menu" width="60%" className="img-fluid" />
                    </div>
                    <div className="col-sm-8 my-1 border border-dark">
                        <div className="col-sm-12 my-1 row">
                            <div className="col-sm-3 my-1 row">
                                <select name="tipo" onChange={handleChange} className="custom-drop">
                                    {OpcionesBusq.map((opcion) => (
                                        <option className="text-dark" value={opcion.value}>{opcion.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-5 my-1 row">

                                <input type="text" className="custom-drop" name="textoabuscar"
                                    onChange={handleChange} value={TextoCompleto} />
                            </div>
                            <div hidden={verAutoCompletar} className="col-sm-4 my-1 row">
                                {autocompletar.length !== 0 && (
                                    <select name="Autocompletar" onChange={handleChangeSelect} className="custom-drop nonbordered">
                                        {autocompletar.map((opcion) => (
                                            <option
                                                value={(() => {
                                                    switch (datosBusqueda.tipo) {
                                                        case 1:
                                                            return opcion.Descripcion;
                                                        case 2:
                                                            return opcion.SustanciaActiva;
                                                        case 3:
                                                            return opcion.Articulo;
                                                        default:
                                                            return '';
                                                    }
                                                })()}
                                                align="left"
                                            >
                                                {opcion.Articulo + ": " + opcion.Descripcion + "(" + opcion.SustanciaActiva + ")"}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-1 my-1 border border-dark">
                        <img src="images/page/carrito.png" alt="Menu" width="60%" className="img-fluid" />
                    </div>
                    <div className="col-sm-1 my-1 border border-dark">
                        <img src="images/page/descuento.png" alt="Menu" width="60%" className="img-fluid" />
                    </div>
                </div>

                <div className="row container-fluid pt-0" align="top">
                    <div className="col-sm-9 my-3 border border-dark">
                        <TableContainer component={Paper} className="responsive">
                            <Table aria-label="simple table">
                                <TableHead className="custom-bg">
                                    <TableRow className="custom-bg">
                                        <TableCell><label className="custom-bg">#</label></TableCell>
                                        <TableCell><label className="custom-bg">Articulo <br />Código</label></TableCell>
                                        <TableCell><label className="custom-bg">Descripción</label></TableCell>
                                        <TableCell><label className="custom-bg">Precio <br />Desc</label></TableCell>
                                        <TableCell><label className="custom-bg">Precio <br />Final</label></TableCell>
                                        <TableCell><label className="custom-bg">Exist</label></TableCell>
                                        <TableCell><label className="custom-bg">Tipo</label></TableCell>
                                        <TableCell><label className="custom-bg">Acciones</label></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                        <TableRow key={i} value={row.Articulo}>
                                            <TableCell>
                                                <Avatar
                                                    className="avatar-bg"
                                                    src='.'
                                                    onClick={() => seleccionarArticulo(row, "Sugerir")}
                                                >
                                                    {(page * rowsPerPage) + (i + 1)}
                                                </Avatar>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <text className="tipoOpe">{row.Articulo}</text><br />
                                                {row.Codigo}
                                            </TableCell>
                                            <TableCell>{row.Descripcion}</TableCell>
                                            <TableCell align="center" >{"$ " + row.Precio}<br />{row.Descuento + " %"}</TableCell>
                                            <TableCell align="center" >{"$" + row.PrecioConDescuento}</TableCell>
                                            <TableCell align="center" >{row.Existencia}</TableCell>
                                            <TableCell>{row.Gen_Pat}</TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    className="avatar-bg"
                                                    src='.'
                                                >+</Avatar>
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

                        <div className="custom-bg"><h4>Articulos Sugeridos</h4></div>

                        <TableContainer component={Paper} className="responsive">
                            <Table aria-label="simple table">
                                <TableHead className="custom-invisible">
                                    <TableRow className="custom-bg">
                                        <TableCell><label className="custom-bg">#</label></TableCell>
                                        <TableCell><label className="custom-bg">Articulo <br />Código</label></TableCell>
                                        <TableCell><label className="custom-bg">Descripción</label></TableCell>
                                        <TableCell><label className="custom-bg">Precio <br />Desc</label></TableCell>
                                        <TableCell><label className="custom-bg">Precio <br />Final</label></TableCell>
                                        <TableCell><label className="custom-bg">Exist</label></TableCell>
                                        <TableCell><label className="custom-bg">Tipo</label></TableCell>
                                        <TableCell><label className="custom-bg">Acciones</label></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sugeridos.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((row, i) => (
                                        <TableRow key={i} value={row.Articulo}>
                                            <TableCell>
                                                <Avatar
                                                    className="avatar-bg"
                                                    src='.'
                                                    onClick={() => seleccionarArticulo(row, "Ver")}
                                                >
                                                    {(page * rowsPerPage) + (i + 1)}
                                                </Avatar>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <text className="tipoOpe">{row.Articulo}</text><br />
                                                {row.Codigo}
                                            </TableCell>
                                            <TableCell>{row.Descripcion}</TableCell>
                                            <TableCell align="center" >{"$ " + row.Precio}<br />{row.Descuento + " %"}</TableCell>
                                            <TableCell align="center" >{"$" + row.PrecioConDescuento}</TableCell>
                                            <TableCell align="center" >{row.Existencia}</TableCell>
                                            <TableCell>{row.Gen_Pat}</TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    className="avatar-bg"
                                                    src='.'
                                                >+</Avatar>
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
                                count={sugeridos.length}
                                rowsPerPage={rowsPerPage2}
                                page={page2}
                                onPageChange={handleChangePage2}
                                onRowsPerPageChange={handleChangeRowsPerPage2}
                            />
                        </TableFooter>
                    </div>
                    <div className="col-sm-3 my-1">
                        <div className="border border-dark">
                            <img src={`${process.env.PUBLIC_URL}/images/articulos/CAD13600.png`}
                                alt="CAD13600" width="80%" className="img-fluid bordered" />
                        </div >
                        <p></p>
                        <div className="border border-dark">

                            <div align="center" className="custom-bg row container-fluid">
                                <label>Disponibles</label>
                            </div>
                            <TableContainer component={Paper} className="responsive">
                                <Table aria-label="simple table">
                                    <TableHead className="custom-bg">
                                        <TableRow className="custom-bg">
                                            <TableCell className="custom-bg"><label>Sucursal</label></TableCell>
                                            <TableCell className="custom-bg"><label>Existencia</label></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {disponibles.slice(0, 5).map((row) => (
                                            <TableRow key={row.Sucursal}>
                                                <TableCell component="th" scope="row">
                                                    {row.Sucursal}
                                                </TableCell>
                                                <TableCell >{row.Existencia}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div align="right" className="custom-bg row container-fluid">
                                <label onClick={() => abrirCerrarModalSucursal()}>ver mas</label>
                            </div>
                        </div >
                    </div>
                </div>
                <div className="custom-bg" align="left">
                    <label>
                        Dirección: {window.location.href} || Base de Datos: Local/Linea || Sucursal: {Sucursal}
                    </label>
                </div>
            </div>

            <Modal isOpen={ModalSucursal}>
                <ModalBody>
                    <TableContainer component={Paper} className="responsive">
                        <Table aria-label="simple table">
                            <TableHead className="custom-bg">
                                <TableRow className="custom-bg">
                                    <TableCell className="custom-bg"><label>Sucursal</label></TableCell>
                                    <TableCell className="custom-bg"><label>Existencia</label></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {disponibles.slice(page3 * rowsPerPage3, page3 * rowsPerPage3 + rowsPerPage3).map((row) => (
                                    <TableRow key={row.Sucursal}>
                                        <TableCell component="th" scope="row">
                                            {row.Sucursal}
                                        </TableCell>
                                        <TableCell >{row.Existencia}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TableFooter>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={disponibles.length}
                                page={page3}
                                rowsPerPage={rowsPerPage3}
                                onPageChange={handleChangePage3}
                                onRowsPerPageChange={handleChangeRowsPerPage3}
                            />
                        </TableFooter>
                    </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <button className="custom-bg" onClick={() => abrirCerrarModalSucursal()}>Cerrar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={ModalArticulo}>
                <ModalBody>
                    <div className="custom-bg border border-dark" align="center">
                        <h4><p>Datos del Articulo</p></h4>
                    </div>
                    <div className="row" align="center">
                        <div className="col-sm-6">
                            <label>Articulo:</label><br />
                            <input type="text" className="form-control" readOnly name="articulo" value={articuloSeleccionado && articuloSeleccionado.Articulo} /> <br />
                        </div>
                        <div className="col-sm-6">
                            <label>Codigo:</label><br />
                            <input type="text" className="form-control" readOnly name="codigo" value={articuloSeleccionado && articuloSeleccionado.Codigo} /> <br />
                        </div>
                    </div>
                    <div className="row" align="center">
                        <div className="col-sm-8 my-3">
                            <label>Descripción:</label><br />
                            <input type="text" className="form-control" readOnly name="descripcion" value={articuloSeleccionado && articuloSeleccionado.Descripcion} /> <br />
                        </div>
                        <div className="col-sm-4 my-3 ">
                            <img src={`${process.env.PUBLIC_URL}/images/articulos/${articuloSeleccionado && articuloSeleccionado.Articulo}.png`}
                                alt={`${articuloSeleccionado && articuloSeleccionado.Articulo}`} width="100%" />
                        </div>
                    </div>
                    <div className="row" align="center">
                        <div className="col-sm-3 my-3"> <br />
                            <label>Precio:</label><br />
                            <input type="text" className="form-control" readOnly name="precio" value={'$ ' + articuloSeleccionado && articuloSeleccionado.Precio} /> <br />
                        </div>
                        <div className="col-sm-3 my-3"> <br />
                            <label>Descuento:</label><br />
                            <input type="text" className="form-control" readOnly name="descuento" value={articuloSeleccionado && articuloSeleccionado.Descuento + " %"} /> <br />
                        </div>
                        <div className="col-sm-3 my-3">
                            <label>Precio Con Descuento:</label><br />
                            <input type="text" className="form-control" readOnly name="PrecioConDescuento" value={"$$ " + articuloSeleccionado && articuloSeleccionado.PrecioConDescuento} /> <br />
                        </div>
                        <div className="col-sm-3 my-3"> <br />
                            <label>Existencia:</label><br />
                            <input type="text" className="form-control" readOnly name="Existencia" value={articuloSeleccionado && articuloSeleccionado.Existencia} /> <br />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="custom-bg" onClick={() => abrirCerrarModalArticulo()}>Cerrar</button>
                </ModalFooter>
            </Modal>
        </body>
    )
}