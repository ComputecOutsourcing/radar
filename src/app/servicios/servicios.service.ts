import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class serviciosService {

  private readonly fedecServiceUrl = 'https://felec.computec.com/clienteproducto/api/v1';

  constructor(private http:HttpClient) {}

  getCliente2(): Observable<any>{
    return this.http.get<any>(`${this.fedecServiceUrl}/clientes`).pipe(map((resp) => {
      return resp
    })
    );
  }

  getDepartamento2(): Observable<any>{
    return this.http.get<any>(`${this.fedecServiceUrl}/departamentos`).pipe(map((resp) => {
      return resp
    })
    );
  }

  getMunicipio2(num): Observable<any>{
    return this.http.get<any>(`${this.fedecServiceUrl}/${num}/municipios`).pipe(map((resp) => {
      return resp
    })
    );
  }

  getCentroPoblado2(numDept, numMunic): Observable<any>{
    return this.http.get<any>(`${this.fedecServiceUrl}/${numDept}/${numMunic}/centrosPoblados`).pipe(map((resp) => {
      return resp
    })
    );
  }

  getProducto2(num): Observable<any>{
    return this.http.get<any>(`${this.fedecServiceUrl}/${num}/productos`).pipe(map((resp) =>{
      return resp
    }));
  }

  getCodigoCliente(url:string){return this.http.get(url)}

  getCodigoSubproducto(url:string){return this.http.get(url)}

  getClienteCodigoPintar(cod):Observable<any>{
    return this.http.get<any>(`${this.fedecServiceUrl}/clientes/${cod}`).pipe(map((resp) => {
      return resp
    }))
  }

  postConsultaCliente(url:string, json:any){
    return this.http.post(url,json)
  }  

  postCreaCliente(url:string, json:any){
    return this.http.post(url,json)
  }
  
  postConsultaSubproducto(url:string, json:any){
    return this.http.post(url,json)
  } 
  
  postCreaSubproducto(url:string, json:any){
    return this.http.post(url,json)
  }
  
  putActualizarCliente(url:string, json:any){
    return this.http.put(url, json);
  }

  
  // SERVICIOS BORRAR
  getDepartamento(url:string){return this.http.get(url).pipe(map((resp:any[]) => {
      return resp.map(departamento => {
        return {
          codigo: departamento.codigoDepartamento,
          nombre: departamento.descripcionDepartamento}
      });
    }));}

  getMunicipio(url:string){return this.http.get(url).pipe(map((resp:any[]) => {
    return resp.map(municipio => {
      return {
        codigo: municipio.codigoMunicipio,
        nombre: municipio.descripcionMunicipio}
    });
  }));}

  getCentroPoblado(url:string){return this.http.get(url).pipe(map((resp:any[]) => {
    return resp.map(centroPoblado => {
      return {
        codigo: centroPoblado.codigoCentroPoblado,
        nombre: centroPoblado.descripcionCentroPoblado}
    });
  }));}

  getCliente(url:string){return this.http.get(url).pipe(map((resp:any[]) => {
    return resp.map(cliente => {
      return {
        codigo: cliente.codigoCliente,
        nombre: cliente.descripcionCliente,
        numeroIdentificacion: cliente.numeroIdentificacion
      }
    });
  }));}

  getProducto(url:string){return this.http.get(url).pipe(map((resp:any[]) => {
    return resp.map(producto => {
      return {
        codigo: producto.codigoProducto,
        nombre: producto.descripcionProducto}
    });
  }));}

  
}
