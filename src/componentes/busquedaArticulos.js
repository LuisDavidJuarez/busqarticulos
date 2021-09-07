import React, { useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  
    return (
        <body class="container-fluid">
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
                <link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
            </head>
            <div align="center">
                <div class="text-warning" align="center">
                    <h5 className="bg-danger border border-dark">Pantalla Busqueda por Descripción</h5>
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
                        <table className="table table-bordered table-striped text-warning">
                            <thead className="bg-danger text-warning border border-dark" align="center">
                            <tr>
                                <th scope="col">Articulo</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Familia</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio de Lista</th>
                                <th scope="col">Descuentos en Cascada</th>
                                <th scope="col">Precio Con Descuento</th>
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
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div class="text-warning" align="center">
                            <h5 className="bg-danger border border-dark">Articulos Sugeridos</h5>
                        </div>
                        <table className="table table-bordered border border-dark table-striped text-warning">
                            <tbody className="text-danger border border-dark">
                            {articulos.map(item => (
                                <tr key={item.Articulo}>
                                <td>{item.Articulo}</td>
                                <td>{item.Descripcion1}</td>
                                <td>{item.Familia}</td>
                                <td>{item.Cantidad}</td>
                                <td>{item.PrecioLista}</td>
                                <td>{item.DescuentosCascada}</td>
                                <td>{item.PrecioConDescuento}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div>                        
                            <table className="table table-bordered border border-dark bg-danger text-warning">
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
                                <thead className="bg-danger text-warning border border-dark">
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
                                    <tr className="bg-danger text-warning border border-dark">
                                        <td></td>                                        
                                        <td>Ver Mas..</td>                                        
                                    </tr>
                                </tbody>
                            </table>                         
                        </div >
                    </div>
                </div>
                <div class="text-warning bg-danger border border-dark" align="left">
                    Dirección: {window.location.href} |Base de Datos: Local/Linea
                </div>
            </div>
        </body>
    )
  }