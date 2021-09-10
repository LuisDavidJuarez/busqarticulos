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
  
    return (
        <body className="cuerpo container-fluid">
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
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
                        <img src="images/page/menu.png" alt="Menu" width="40%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-1 border border-dark">
                        <img src="images/page/logoweb.png" alt="Menu" width="100%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-8 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <div class="row container-fluid">
                            <div class="col-sm-2 container-fluid">
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
                            <div class="col-sm-9 container-fluid">
                                <input type="text" className="form-control border-danger" name="busqueda" onChange=""/>
                            </div>                            
                            <div class="col-sm-1 container-fluid"></div>
                        </div>
                    </div>
                    <div class="col-sm-1 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/carrito.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                    <div class="col-sm-1 border border-dark">
                        <div class="row container-fluid"><p></p></div>
                        <img src="images/page/descuento.png" alt="Menu" width="60%" className="img-fluid"/>
                    </div>
                </div>
                
                <div class="row container-fluid pt-0" align="top">
                    <div class="col-sm-8 my-3 border border-dark">
                        <table className="table table-bordered table-striped ">
                            <thead className="custom-bg" align="center">
                                <tr>
                                    <th scope="col">Articulo</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col">Familia</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Precio de Lista</th>
                                    <th scope="col">Descuentos en Cascada</th>
                                    <th scope="col">Precio Con Descuento</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-danger border border-dark" align="center">
                                {articulos.map(item => (
                                    <tr key={item.Articulo}>
                                        <td>{item.Articulo}</td>
                                        <td align="left">{item.Descripcion1}</td>
                                        <td align="left">{item.Familia}</td>
                                        <td>{item.Cantidad}</td>
                                        <td>$ {item.PrecioLista}</td>
                                        <td>{item.DescuentosCascada} %</td>
                                        <td>$ {item.PrecioConDescuento}</td>
                                        <td>
                                            <button className="custom-bg" onClick={()=>seleccionarArticulo(item, "Ver")}>Ver</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div class="custom-bg" align="center">
                            <h5>Articulos Sugeridos</h5>
                        </div>
                        <table className="table table-bordered border border-dark table-striped text-warning">
                            <tbody className="text-danger border border-dark">
                            {articulos.map(item => (
                                    <tr key={item.Articulo}>
                                        <td>{item.Articulo}</td>
                                        <td align="left">{item.Descripcion1}</td>
                                        <td align="left">{item.Familia}</td>
                                        <td>{item.Cantidad}</td>
                                        <td>$ {item.PrecioLista}</td>
                                        <td>{item.DescuentosCascada} %</td>
                                        <td>$ {item.PrecioConDescuento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="custom-bg">                        
                            <table className="table table-bordered" style={{color:"#fbd134"}}>
                                <tr>
                                    <td>{"<<"}</td>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                    <td>4</td>
                                    <td>5</td>
                                    <td>6</td>
                                    <td>7</td>
                                    <td>8</td>
                                    <td>9</td>
                                    <td>10</td>
                                    <td>11</td>
                                    <td>{">>"}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="col-sm-4 my-3">
                        <div className="border border-dark">
                            <img src={`${process.env.PUBLIC_URL}/images/articulos/CAD13600.png`} 
                                alt="CAD13600" width="80%" className="img-fluid bordered"/>                            
                        </div >
                        <p></p>
                        <div className="border border-dark">
                            <table className="table table-bordered table-striped text-warning">
                                <thead className="custom-bg">
                                    <tr>
                                        <th scope="col">Articulo</th>
                                        <th scope="col">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody className="text-danger border border-dark">
                                    {articulos.map(item => (
                                        <tr key={item.Articulo}>
                                        <td>{item.Articulo}</td>
                                        <td>{item.Cantidad}</td>
                                        </tr>
                                    ))}
                                    <tr className="custom-bg">
                                        <td></td>                                        
                                        <td>Ver Mas..</td>                                        
                                    </tr>
                                </tbody>
                            </table>                         
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