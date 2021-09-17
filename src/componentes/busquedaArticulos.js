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
    Paper,
    TablePagination,
    TableFooter
 } from '@material-ui/core';

  export default function Articulos(){

    const [articulos, setArticulos] = useState([])
    const [sugeridos, setSugeridos] = useState([])

    const baseUrl="https://localhost:44371/api/BusquedaArticulos";
    //const [opcionBusq, setOpcionBusq] = React.useState(3);
    const [ModalArticulo, setModalArticulo]=useState(false);
    const [articuloSeleccionado, setarticuloSeleccionado]=useState({
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

    const abrirCerrarModalArticulo=()=> {
      setModalArticulo(!ModalArticulo);
    }

    const seleccionarArticulo=(articulo, caso)=>{
        setarticuloSeleccionado(articulo);
        asignarSugerido(articulo.Articulo);
      (caso==="Ver")&&
      abrirCerrarModalArticulo();
    }

    const asignarSugerido = (textosugerido) => {
        setDatosBusqueda({
          ...datosBusqueda,
          sugerido: textosugerido
        });
        //window.location.refresh(true);
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

      const handleChange=e=>{        
        const {name, value}=e.target;
        setDatosBusqueda({
         ...datosBusqueda,
         [name]: value
       })
       console.log(datosBusqueda);
    }
      
    const [datosBusqueda, setDatosBusqueda]=useState({
        textoabuscar: '',
        tipo:1,
        sucursal: 23,
        sugerido: ''
      })

      const peticionGetArticulo=async (datosBusqueda)=>{
        await axios.get(baseUrl + "/" + datosBusqueda.sucursal + 
                                  "/" + datosBusqueda.tipo + 
                                  "/" + datosBusqueda.textoabuscar)
        .then(response=>{
          setArticulos(response.data);
        }).catch(error=>{
          console.log(error);
        })}

        const peticionGetSugeridos=async(datosBusqueda)=>{
            await axios.get(baseUrl + "/Sugeridos" + 
                                      "/" + datosBusqueda.sucursal + 
                                      "/" + datosBusqueda.sugerido)
          .then(response=>{
            setSugeridos(response.data);
          }).catch(error=>{
            console.log(error);
          })
      }

      useEffect(()=>{
        if(datosBusqueda.textoabuscar.length > 2){
          peticionGetArticulo(datosBusqueda);
          peticionGetSugeridos(datosBusqueda);
        }
      }, [datosBusqueda])
  
    return (
        <body className="cuerpo container-fluid">
            <head>
                <link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
            </head>
            <div align="center">
                <div className="custom-bg" align="center">
                    <h4>Pantalla Busqueda por Descripción</h4>
                </div>
                <div className="row container-fluid">
                    <div className="col-sm-1 my-1 border border-dark container-fluid" align="center">
                        <div className="row container-fluid"><p></p></div>
                        <img src="images/page/menu.png" responsive="true" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div className="col-sm-1 my-1 border border-dark">
                        <div className="row container-fluid"><p></p></div>
                        <img src="images/page/logoweb.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div className="col-sm-8 my-1 border border-dark">
                        <div className="col-sm-12 my-1 row"></div>
                        <div className="col-sm-12 my-1 row">
                            <div className="col-sm-4 my-1 row">
                                <div className="col-md-10 custom-drop">
                                    <select name="tipo" onChange={handleChange} className="custom-drop" readOnly>
                                        <option value='0' header>Seleccione</option>
                                        {OpcionesBusq.map((opcion)=> (
                                                <option  value={opcion.value}>{opcion.label}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-1 my-1 row">
                            </div>
                            <div className="col-sm-6 my-1 row">
                                <input type="text" className="form-control border-danger" name="textoabuscar" onChange={handleChange} />
                            </div>  
                            <div className="col-sm-1 my-1 row">
                            </div> 
                        </div>                         
                    </div>
                    <div className="col-sm-1 my-1 border border-dark">
                        <div className="row container-fluid"><p></p></div>
                        <img src="images/page/carrito.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div className="col-sm-1 my-1 border border-dark">
                        <div className="row container-fluid"><p></p></div>
                        <img src="images/page/descuento.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                </div>
                
                <div className="row container-fluid pt-0" align="top">
                    <div className="col-sm-9 my-3 border border-dark">
                    <TableContainer component={Paper} className="responsive">
                        <Table aria-label="simple table">
                            <TableHead className="custom-bg">
                                <TableRow className="custom-bg">
                                    <TableCell className="text-warning">#</TableCell>
                                    <TableCell className="text-warning">Articulo <br />Código</TableCell>
                                    <TableCell className="text-warning">Descripción</TableCell>
                                    <TableCell className="text-warning" align="center" >Precio</TableCell>
                                    <TableCell className="text-warning" align="center">Desc</TableCell>
                                    <TableCell className="text-warning" align="center">Existencia</TableCell>
                                    <TableCell className="text-warning" align="center">Tipo Comisión</TableCell>
                                    <TableCell className="text-warning" align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                <TableRow key={i} value={row.Articulo}>
                                    <TableCell>{(page * rowsPerPage) + (i + 1)}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <text className="tipoOpe">{row.Articulo}</text><br />
                                        {row.Codigo}
                                    </TableCell>
                                    <TableCell>{row.Descripcion}</TableCell>
                                    <TableCell align="center" >{"$ " + row.Precio}</TableCell>
                                    <TableCell align="center" >{row.Descuento + " %"}</TableCell>
                                    <TableCell align="center" >{row.Existencia}</TableCell>                                        
                                    <TableCell>{row.Gen_Pat}</TableCell>
                                    <TableCell align="center">
                                        <button className="custom-bg" type="button" onClick={()=>seleccionarArticulo(row, "Ver")}><h6>Ver</h6></button>
                                        &nbsp;&nbsp;
                                        <button className="custom-bg" type="button" ><h6>+</h6></button>
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
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                        <div className="custom-bg"><h4>Articulos Sugeridos</h4></div>
                        
                    <TableContainer component={Paper} className="responsive">
                        <Table aria-label="simple table">
                            <TableHead className="custom-invisible">
                                <TableRow className="custom-bg">
                                        <TableCell><h4>#</h4></TableCell>
                                        <TableCell>Articulo <br />Código</TableCell>
                                        <TableCell><h5>Descripción</h5></TableCell>
                                        <TableCell><h5>Precio</h5></TableCell>
                                        <TableCell><h5>Desc</h5></TableCell>
                                        <TableCell><h5>Existencia</h5></TableCell>
                                        <TableCell><h5>Tipo Comisión</h5></TableCell>
                                        <TableCell><h5>Acciones</h5></TableCell>  
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sugeridos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                    <TableRow key={i} value={row.Articulo} className="custom-data">
                                        <TableCell>{(page * rowsPerPage) + (i + 1)}</TableCell>
                                        <TableCell component="th" scope="row">
                                            <text className="tipoOpe">{row.Articulo}</text><br />
                                            {row.Codigo}
                                        </TableCell>
                                        <TableCell>{row.Descripcion}</TableCell>
                                        <TableCell align="center" >{"$ " + row.Precio}</TableCell>
                                        <TableCell align="center" >{row.Descuento + " %"}</TableCell>
                                        <TableCell align="center" >{row.Existencia}</TableCell>                                        
                                        <TableCell>{row.Gen_Pat}</TableCell>
                                        <TableCell align="center" >
                                            <button className="custom-bg" type="button" onClick={()=>seleccionarArticulo(row, "Ver")}><h6>Ver</h6></button>
                                            &nbsp;&nbsp;
                                            <button className="custom-bg" type="button" ><h6>+</h6></button>
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
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </div>
                    <div className="col-sm-3 my-1">
                        <div className="border border-dark">
                            <img src={`${process.env.PUBLIC_URL}/images/articulos/CAD13600.png`} 
                                alt="CAD13600" width="80%" className="img-fluid bordered"/>                            
                        </div >
                        <p></p>
                        <div className="border border-dark">
                            
                            <TableContainer component={Paper} className="responsive">
                                <Table aria-label="simple table">
                                    <TableHead className="custom-bg">
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
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                        </div >
                    </div>
                </div>
                <div className="custom-bg" align="left">
                    Dirección: {window.location.href} |Base de Datos: Local/Linea
                </div>
            </div>

            <Modal isOpen={ModalArticulo}>
            <ModalBody>
                <div className="custom-bg border border-dark" align="center">
                <h4><p>Datos del Articulo</p></h4>
                </div>
                <div className="row" align="center">
                    <div className="col-sm-6">
                        <label>Articulo:</label><br />
                        <input type="text" className="form-control" readOnly name="articulo" value={articuloSeleccionado && articuloSeleccionado.Articulo}/> <br />
                    </div>
                    <div className="col-sm-6">
                        <label>Familia:</label><br />
                        <input type="text" className="form-control"  readOnly name="familia" value={articuloSeleccionado && articuloSeleccionado.Familia}/> <br />
                    </div>                       
                </div>
                <div className="row" align="center">
                    <div className="col-sm-8 my-3">                        
                        <label>Descripción:</label><br />
                        <input type="text" className="form-control" readOnly name="descripcion" value={articuloSeleccionado && articuloSeleccionado.Descripcion1}/> <br />
                    </div>
                    <div className="col-sm-4 my-3 ">
                        <img src={`${process.env.PUBLIC_URL}/images/articulos/${articuloSeleccionado && articuloSeleccionado.Articulo}.png`} 
                                        alt={`${articuloSeleccionado && articuloSeleccionado.Articulo}`} width="100%"/>
                    </div>
                </div>
                <div className="row" align="center">
                    <div className="col-sm-3 my-3"> <br /> 
                        <label>Cantidad:</label><br />
                        <input type="text" className="form-control"  readOnly name="cantidad" value={articuloSeleccionado && articuloSeleccionado.Cantidad}/> <br />
                    </div>
                    <div className="col-sm-3 my-3"> <br />
                        <label>Precio:</label><br />
                        <input type="text" className="form-control"  readOnly name="PrecioLista" value={'$ ' + articuloSeleccionado && articuloSeleccionado.PrecioLista}/> <br />
                    </div>
                    <div className="col-sm-3 my-3"> <br />
                        <label>Descuento:</label><br />
                        <input type="text" className="form-control"  readOnly name="DescuentosCascada" value={articuloSeleccionado && articuloSeleccionado.DescuentosCascada + " %"}/> <br />
                    </div>
                    <div className="col-sm-3 my-3">
                        <label>Precio Con Descuento:</label><br />
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