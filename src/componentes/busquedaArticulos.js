import React, { useState, useEffect} from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './busquedaArticulos.css'

import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownLink
} from 'mdb-react-ui-kit';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableFooter 
 } from '@material-ui/core';

function useArticulos(){

    const [articulos, setArticulos] = useState([])
  
    useEffect(() => {
      fetch("json/BusquedaArticulos.json")
      .then(response => response.json())
      .then(datos => {
        setArticulos(datos)
      })
    }, [])
    
    return articulos
    
  }

  export default function Articulos(){

    const articulos = useArticulos()
    const [ModalArticulo, setModalArticulo]=useState(false);
    const [articuloSeleccionado, setarticuloSeleccionado]=useState({
        Articulo: '',
        Descripcion1: '',
        Familia: '',
        Cantidad: '',
        PrecioLista: '',
        DescuentosCascada: '',
        PrecioConDescuento: ''
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

    const abrirCerrarModalArticulo=()=> {
      setModalArticulo(!ModalArticulo);
    }

    const seleccionarArticulo=(articulo, caso)=>{
        setarticuloSeleccionado(articulo);
      (caso==="Ver")&&
      abrirCerrarModalArticulo();
    }
  
    return (
        <body className="cuerpo container-fluid">
            <head>
                <link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
            </head>
            <div align="center">
                <div class="custom-bg" align="center">
                    <h3>Pantalla Busqueda por Descripción</h3>
                </div>
                <div class="row container-fluid">
                    <div class="col-sm-1 my-1 border border-dark container-fluid" align="center">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/menu.png" responsive="true" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-1 my-1 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/logoweb.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-8 my-1 border border-dark">
                        <div class="col-sm-12 my-1 row"></div>
                        <div class="col-sm-12 my-1 row">
                            <div class="col-sm-2 my-1 row">
                                <MDBDropdown dropright>
                                        <MDBDropdownToggle basic class="custom-drop">
                                            Tipo de Busqueda >
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu>
                                            <MDBDropdownItem>
                                            <MDBDropdownLink href="#"><h6>Descripción</h6></MDBDropdownLink>
                                            </MDBDropdownItem>
                                            <MDBDropdownItem>
                                            <MDBDropdownLink href="#"><h6>Sustancia Activa o  Padecimiento</h6></MDBDropdownLink>
                                            </MDBDropdownItem>
                                            <MDBDropdownItem>
                                            <MDBDropdownLink href="#"><h6>Articulo o Codigo EAN</h6></MDBDropdownLink>
                                            </MDBDropdownItem>
                                        </MDBDropdownMenu>
                                </MDBDropdown>
                            </div>
                            <div class="col-sm-1 my-1 row">
                            </div>
                            <div class="col-sm-8 my-1 row">
                                <input type="text" className="form-control border-danger" name="busqueda" onChange=""/>
                            </div>  
                            <div class="col-sm-1 my-1 row">
                            </div> 
                        </div>                         
                    </div>
                    <div class="col-sm-1 my-1 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/carrito.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-1 my-1 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/descuento.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                </div>
                
                <div class="row container-fluid pt-0" align="top">
                    <div class="col-sm-9 my-3 border border-dark">
                    <TableContainer component={Paper} className="responsive">
                        <Table aria-label="simple table">
                            <TableHead class="custom-bg">
                                <TableRow className="custom-bg">
                                    <TableCell className="text-warning"><h4>#</h4></TableCell>
                                    <TableCell className="text-warning"><h5>Articulo</h5></TableCell>
                                    <TableCell className="text-warning"><h5>Descripción</h5></TableCell>
                                    <TableCell className="text-warning"><h5>Familia</h5></TableCell>
                                    <TableCell align="center" className="text-warning"><h5>Cantidad</h5></TableCell>
                                    <TableCell align="center" className="text-warning"><h5>Precio Lista</h5></TableCell>
                                    <TableCell align="center" className="text-warning"><h5>Desc</h5></TableCell>
                                    <TableCell align="center" className="text-warning"><h5>Nuevo Precio</h5></TableCell>
                                    <TableCell align="center" className="text-warning"><h5>Acciones</h5></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                <TableRow key={i} value={row.Articulo}>
                                    <TableCell >{i + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.Articulo}
                                    </TableCell>
                                    <TableCell>{row.Descripcion1}</TableCell>
                                    <TableCell>{row.Familia}</TableCell>
                                    <TableCell align="center">{row.Cantidad}</TableCell>
                                    <TableCell align="center" >{"$ " + row.PrecioLista}</TableCell>
                                    <TableCell align="center" >{row.DescuentosCascada + " %"}</TableCell>
                                    <TableCell align="center" >{"$ " + row.PrecioConDescuento}</TableCell>
                                    <TableCell align="center">
                                        <button class="custom-bg" type="button" onClick={()=>seleccionarArticulo(row, "Ver")}><h6>Ver</h6></button>
                                        &nbsp;&nbsp;
                                        <button class="custom-bg" type="button" ><h6>Agregar</h6></button>
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
                                rowsPerPage={rowsPerPage}
                                rowsPerPageText="Filas por Pagina"
                                rangeSeparatorText= 'de'
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                        <div className="custom-bg"><h4>Articulos Sugeridos</h4></div>
                        
                    <TableContainer component={Paper} className="responsive">
                        <Table aria-label="simple table">
                            <TableHead class="custom-invisible">
                                <TableRow className="custom-bg">
                                    <TableCell><h4>#</h4></TableCell>
                                    <TableCell><h5>Articulo</h5></TableCell>
                                    <TableCell><h5>Descripción</h5></TableCell>
                                    <TableCell><h5>Familia</h5></TableCell>
                                    <TableCell><h5>Cantidad</h5></TableCell>
                                    <TableCell><h5>Precio Lista</h5></TableCell>
                                    <TableCell><h5>Desc</h5></TableCell>
                                    <TableCell><h5>Nuevo Precio</h5></TableCell>
                                    <TableCell><h5>Acciones</h5></TableCell>  
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                <TableRow key={i} value={row.Articulo}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.Articulo}
                                    </TableCell>
                                    <TableCell>{row.Descripcion1}</TableCell>
                                    <TableCell>{row.Familia}</TableCell>
                                    <TableCell align="center" >{row.Cantidad}</TableCell>
                                    <TableCell align="center" >{"$ " + row.PrecioLista}</TableCell>
                                    <TableCell align="center" >{row.DescuentosCascada + " %"}</TableCell>
                                    <TableCell align="center" >{"$ " + row.PrecioConDescuento}</TableCell>
                                    <TableCell align="center" >
                                        <button class="custom-bg" type="button" onClick={()=>seleccionarArticulo(row, "Ver")}><h6>Ver</h6></button>
                                        &nbsp;&nbsp;
                                        <button class="custom-bg" type="button" ><h6>Agregar</h6></button>
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
                                rowsPerPage={rowsPerPage}
                                rowsPerPageText="Filas por Pagina"
                                rangeSeparatorText= 'de'
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </div>
                    <div class="col-sm-3 my-1">
                        <div className="border border-dark">
                            <img src={`${process.env.PUBLIC_URL}/images/articulos/CAD13600.png`} 
                                alt="CAD13600" width="80%" className="img-fluid bordered"/>                            
                        </div >
                        <p></p>
                        <div className="border border-dark">
                            
                            <TableContainer component={Paper} className="responsive">
                                <Table aria-label="simple table">
                                    <TableHead class="custom-bg">
                                        <TableRow className="custom-bg">
                                            <TableCell className="text-warning"><h5>Articulo</h5></TableCell>
                                            <TableCell className="text-warning"><h5>Cantidad</h5></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.Articulo}>
                                            <TableCell component="th" scope="row">
                                                {row.Articulo}
                                            </TableCell>
                                            <TableCell >{row.Cantidad}</TableCell>
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
                                rowsPerPage={rowsPerPage}
                                rowsPerPageText="Filas por Pagina"
                                rangeSeparatorText= 'de'
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                        </div >
                    </div>
                </div>
                <div class="custom-bg" align="left">
                    Dirección: {window.location.href} |Base de Datos: Local/Linea
                </div>
            </div>

            <Modal isOpen={ModalArticulo}>
            <ModalBody>
                <div class="custom-bg border border-dark" align="center">
                    <p><h4>Datos del Articulo</h4></p>
                </div>
                <div className="row" align="center">
                    <div class="col-sm-6">
                        <labe >Articulo:</labe><br />
                        <input type="text" className="form-control" readOnly name="articulo" value={articuloSeleccionado && articuloSeleccionado.Articulo}/> <br />
                    </div>
                    <div class="col-sm-6">
                        <labe>Familia:</labe><br />
                        <input type="text" className="form-control"  readOnly name="familia" value={articuloSeleccionado && articuloSeleccionado.Familia}/> <br />
                    </div>                       
                </div>
                <div className="row" align="center">
                    <div class="col-sm-8 my-3">                        
                        <labe>Descripción:</labe><br />
                        <input type="text" className="form-control" readOnly name="descripcion" value={articuloSeleccionado && articuloSeleccionado.Descripcion1}/> <br />
                    </div>
                    <div class="col-sm-4 my-3 ">
                        <img src={`${process.env.PUBLIC_URL}/images/articulos/${articuloSeleccionado && articuloSeleccionado.Articulo}.png`} 
                                        alt={`${articuloSeleccionado && articuloSeleccionado.Articulo}`} width="100%"/>
                    </div>
                </div>
                <div className="row" align="center">
                    <div class="col-sm-3 my-3"> <br /> 
                        <labe>Cantidad:</labe><br />
                        <input type="text" className="form-control"  readOnly name="cantidad" value={articuloSeleccionado && articuloSeleccionado.Cantidad}/> <br />
                    </div>
                    <div class="col-sm-3 my-3"> <br />
                        <labe>Precio:</labe><br />
                        <input type="text" className="form-control"  readOnly name="PrecioLista" value={'$ ' + articuloSeleccionado && articuloSeleccionado.PrecioLista}/> <br />
                    </div>
                    <div class="col-sm-3 my-3"> <br />
                        <labe>Descuento:</labe><br />
                        <input type="text" className="form-control"  readOnly name="DescuentosCascada" value={articuloSeleccionado && articuloSeleccionado.DescuentosCascada + " %"}/> <br />
                    </div>
                    <div class="col-sm-3 my-3">
                        <labe>Precio Con Descuento:</labe><br />
                        <input type="text" className="form-control"  readOnly name="PrecioConDescuento" value={"$$ " + articuloSeleccionado && articuloSeleccionado.PrecioConDescuento}/> <br />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                    <button className="custom-bg" onClick={()=>abrirCerrarModalArticulo()}>Cerrar</button>
            </ModalFooter>
            </Modal>
        </body>
    )
  }