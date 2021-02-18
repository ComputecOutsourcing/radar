import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})


export class serviciosService {

  constructor(private http:HttpClient) { }
  
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

  getCodigo(url:string){return this.http.get(url)}

  postConsultaCliente(url:string, json:any){
    return this.http.post(url,json)
  }


  //VALIDADORES
    
}
