import React, { useState, useEffect} from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import './busquedaArticulos.css'

import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBBtn
} from 'mdb-react-ui-kit';
import { TableCell } from '@material-ui/core';
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

    const abrirCerrarModalArticulo=()=> {
      setModalArticulo(!ModalArticulo);
    }

    const seleccionarArticulo=(articulo, caso)=>{
        setarticuloSeleccionado(articulo);
      (caso==="Ver")&&
      abrirCerrarModalArticulo();
    }

    const columnasDisponibles=[        
        {
            name:'Articulo:',
            selector: 'Articulo',
            sortable: true,
            grow:1,
            getProps: {
                style: {
                  backgroundColor: 'danger',
              }}
        },
        {
            name:'Cantidad',
            selector: 'Cantidad',
            sortable: true,
            grow:1
        }
    ]

    const columnasArticulos=[
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Articulo</h6></TableCell>,
            selector: 'Articulo',
            grow:1
        },
        {
            name:<TableCell className="custom-bg col-sm-2"><h6>Descripción</h6></TableCell>,
            selector: 'Descripcion1',
            left: true,
            grow:2
        },
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Familia</h6></TableCell>,
            selector: 'Familia',
            left: true,
            grow:2
        },
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Cantidad</h6></TableCell>,
            selector: 'Cantidad',
            grow:1
        },
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Precio</h6></TableCell>,
            selector: 'PrecioLista',
            grow:1
        },
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Desc</h6></TableCell>,
            selector: 'DescuentosCascada',
            grow:1
        },
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Nuevo <br />Precio</h6></TableCell>,
            selector: 'PrecioConDescuento',
            grow:1
        },
        {
            name:<TableCell className="custom-bg col-sm-1"><h6>Acciones</h6></TableCell>,
            selector: 'Acciones',
            grow:1
        }
    ]

    const PaginacionOpciones = {
        rowsPerPageText: 'Filas por Pagina',
        rangeSeparatorText: 'de',
        SelectAllRowsItem: true,
        SelectAllRowsItemText: 'Todos'
    }
  
    return (
        <body className="cuerpo container-fluid">
            <head>
                <link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
            </head>
            <div align="center">
                <div class="custom-bg" align="center">
                    <h5 className="">Pantalla Busqueda por Descripción</h5>
                </div>
                <div class="row container-fluid">
                    <div class="col-sm-1 border border-dark" align="center">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/menu.png" alt="Menu" width="80%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-1 border border-dark">
                        <img src="images/page/logoweb.png" alt="Menu" width="100%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-8 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <div class="row container-fluid">
                            <div class="col-sm-1 container-fluid">
                                <MDBDropdown group className='shadow-0'>
                                    <MDBDropdownToggle tag='a' className='btn btn-outline-danger text-dark container-fluid"'>
                                        Tipo
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem>
                                        <MDBDropdownLink href="#">Descripción</MDBDropdownLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                        <MDBDropdownLink href="#">Sustancia Activa o  Padecimiento</MDBDropdownLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                        <MDBDropdownLink href="#">Articulo o Codigo EAN</MDBDropdownLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </div>
                            <div class="col-sm-9 my-1 container-fluid">
                                <input type="text" className="form-control border-danger" name="busqueda" onChange=""/>
                            </div>                            
                            <div class="col-sm-1 my-1 container-fluid"></div>
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
                    <div class="col-sm-8 my-3 border border-dark">
                        
                        <DataTable 
                            className="tablaPrincipal"
                            columns={columnasArticulos}
                            pagination
                            paginationComponentOptions={PaginacionOpciones}
                            //noTableHead
                            //fixedHeader
                            //fixedHeaderScrollHeight="60%"
                            striped
                            data={articulos.map(item => (
                                    {
                                        Articulo: item.Articulo,
                                        Descripcion1: item.Descripcion1,
                                        Familia: item.Familia,
                                        Cantidad: item.Cantidad,
                                        PrecioLista: "$ " + item.PrecioLista,
                                        DescuentosCascada: item.DescuentosCascada + " %",
                                        PrecioConDescuento: "$ " + item.PrecioConDescuento,
                                        Acciones: 
                                        <MDBBtn className="custom-bg" type="button" onClick={()=>seleccionarArticulo(item, "Ver")}><h6>Ver</h6></MDBBtn>
                                    }
                                ))}
                        />

                        

                        <DataTable 
                            title={<div className="custom-bg"><h4>Articulos Sugeridos</h4></div>}
                            className="custom-bg"
                            columns={columnasArticulos}
                            pagination
                            paginationComponentOptions={PaginacionOpciones}
                            noTableHead
                            //fixedHeader
                            //fixedHeaderScrollHeight="60%"
                            striped
                            data={articulos.map(item => (
                                    {
                                        Articulo: item.Articulo,
                                        Descripcion1: item.Descripcion1,
                                        Familia: item.Familia,
                                        Cantidad: item.Cantidad,
                                        PrecioLista: "$ " + item.PrecioLista,
                                        DescuentosCascada: item.DescuentosCascada + " %",
                                        PrecioConDescuento: "$ " + item.PrecioConDescuento,
                                        Acciones: 
                                        <MDBBtn className="custom-bg" type="button" onClick={()=>seleccionarArticulo(item, "Ver")}><h6>Ver</h6></MDBBtn>
                                    }
                                ))}
                        />
                    </div>
                    <div class="col-sm-4 my-1">
                        <div className="border border-dark">
                            <img src={`${process.env.PUBLIC_URL}/images/articulos/CAD13600.png`} 
                                alt="CAD13600" width="80%" className="img-fluid bordered"/>                            
                        </div >
                        <p></p>
                        <div className="border border-dark">
                            <DataTable 
                                className="custom-bg"
                                columns={columnasDisponibles}
                                pagination
                                paginationComponentOptions={PaginacionOpciones}
                                fixedHeader
                                fixedHeaderScrollHeight="60%"
                                striped
                                data={articulos.map(item => (
                                        {
                                            Articulo: item.Articulo,
                                            Cantidad: item.Cantidad
                                        }
                                    ))}
                            />   
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