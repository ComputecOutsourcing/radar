import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { serviciosService } from '../../servicios/servicios.service';
declare var $: any;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  forma: FormGroup;
  departamento:any[] = [];
  municipio:any[] = [];
  centroPoblado:any[] = [];
  cliente:any[] = [];
  tipoCobro:any[] = ['','O','D','DA','ID','IS']
  parametrosConsulta:any = [{nombreCampo:'',alias:''},{nombreCampo:'',alias:''},{nombreCampo:'',alias:''}]

  constructor(private fb: FormBuilder, private serviciosService:serviciosService) {
    this.nuevo();
    this.servicioDepartamento();
    this.servicioMunicipio('0');
    this.servicioCentroPoblado('0','0');
    this.servicioCliente();
  }

  ngOnInit(): void {
  }

  nuevo(){
    this.forma = this.fb.group({
      codigoProducto: new FormControl ({value: '', disabled: true}, Validators.required),
      fechaCreacion: new FormControl ({value: this.fechaActual(), disabled: true}, Validators.required),
      estado: new FormControl ({value: '', disabled: true}, Validators.required),
      llaveCruce:'',
      cliente:'',
      descripcionProducto:'',
      departamento:'',
      municipio:'',
      centroPoblado:'',
      nombreContacto:'',
      email:'',
      tipoCobro:'',
      parametrosConsulta:''
    })
  }

  // CREAR FORMULARIO

  crearFormulario() {
    this.forma.get('llaveCruce').enable();
    this.forma.get('cliente').enable();
    this.forma = this.fb.group({
      codigoProducto: ['12345', [Validators.required]],
      fechaCreacion: [this.fechaActual(), [Validators.required]],
      estado: ['N', [Validators.required]],
      llaveCruce:['', [Validators.required]],
      cliente:['', [Validators.required]],
      descripcionProducto:['', [Validators.required]],
      departamento:['', [Validators.required]],
      municipio:['', [Validators.required]],
      centroPoblado:['', [Validators.required]],
      nombreContacto:'',
      email:'',
      tipoCobro:this.tipoCobro[0],
      parametrosConsulta:['']
    })
    this.cambiarDMC();
    }

    guardarCrear() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
           control.markAsTouched();
        }
      });
    }
    console.log(this.forma.value);
    this.cerrarCrear();
  }
  
  cerrarCrear() {
    var modal = document.getElementById('ventanaCrearProducto');
     $('#ventanaCrearProducto').modal('hide');
   }


  //EDITAR FORMULARIO

  editarFormulario() {
    this.forma.get('llaveCruce').disable();
    this.forma.get('cliente').disable();
    this.forma = this.fb.group({
      codigoProducto: ['12345', [Validators.required]],
      fechaCreacion: [this.fechaActual(), [Validators.required]],
      estado: ['N', [Validators.required]],
      llaveCruce:['', [Validators.required]],
      cliente:['', [Validators.required]],
      descripcionProducto:['', [Validators.required]],
      departamento:['', [Validators.required]],
      municipio:['', [Validators.required]],
      centroPoblado:['', [Validators.required]],
      nombreContacto:'',
      email:'',
      tipoCobro:this.tipoCobro[0],
      parametrosConsulta:['']
    })
    this.cambiarDMC();
    }

    guardarEditar() {
      if (this.forma.invalid) {
        return Object.values(this.forma.controls).forEach(control => {
          if (control instanceof FormGroup) {
            Object.values(control.controls).forEach(control => control.markAsTouched());
          } else {
             control.markAsTouched();
          }
        });
      }
      console.log(this.forma.value);
      this.cerrarEditar();
    }
    
    cerrarEditar() {
      var modal = document.getElementById('ventanaEditarProducto');
       $('#ventanaEditarProducto').modal('hide');
     }


  //Metodos comunes

  cancelar() {
    //this.forma.reset({});
  }

  servicioDepartamento(){
    this.serviciosService.getDepartamento('https://felec.computec.com/clienteproducto/api/v1/departamentos').subscribe( departamento =>{
      this.departamento = departamento;
    });
  }

  servicioMunicipio(numDepartamento){
    console.log(numDepartamento);
    this.serviciosService.getMunicipio('https://felec.computec.com/clienteproducto/api/v1/'+numDepartamento+'/municipios').subscribe( municipio =>{
      this.municipio = municipio;
    });
  }

  servicioCentroPoblado(numDepartamento, numMunicipio){
    console.log(numDepartamento + ' ' +numMunicipio);
    this.serviciosService.getCentroPoblado('https://felec.computec.com/clienteproducto/api/v1/'+numDepartamento+'/'+numMunicipio+'/centrosPoblados').subscribe( centroPoblado =>{
      this.centroPoblado = centroPoblado;
    });
  }

  servicioCliente(){
    this.serviciosService.getCliente('https://felec.computec.com/clienteproducto/api/v1/clientes').subscribe( cliente =>{
      this.cliente = cliente;
    });
  }

  cambiarDMC(){
    console.log('aca estoy');
    var val1 = this.departamento[0].codigo;
    var val2 = this.municipio[0].codigo;
    this.forma.get('departamento').valueChanges.subscribe(valor =>{
      val1 = valor;
      this.servicioMunicipio(valor);
    });
    this.forma.get('municipio').valueChanges.subscribe(valor =>{
      val2 = valor;
      this.servicioCentroPoblado(val1,valor);
      
    });

    
  }

  fechaActual(){
    let date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let anio = date.getFullYear()

    if(month < 10 && day < 10){let dia = 0+''+day;let mes = 0+''+month;return dia+"/"+mes+'/'+anio;
    }else if(month < 10){let mes = 0+''+month;return day+"/"+mes+'/'+anio;
    }else if(day < 10){let dia = 0+''+day;return dia+"/"+month+'/'+anio;
    }else{return day+"/"+month+'/'+anio;}
  }

  //GET
  get codigoProductoNoValido() { return this.forma.get('codigoProducto').invalid && this.forma.get('codigoProducto').touched; }
  get fechaCreacionNoValido() { return this.forma.get('fechaCreacion').invalid && this.forma.get('fechaCreacion').touched; }
  get estadoNoValido() { return this.forma.get('estado').invalid && this.forma.get('estadoNoValido').touched; }
  get llaveCruceNoValido() { return this.forma.get('llaveCruce').invalid && this.forma.get('llaveCruce').touched; }
  get clienteNoValido() { return this.forma.get('cliente').invalid && this.forma.get('cliente').touched; }
  get descripcionProductoNoValido() { return this.forma.get('descripcionProducto').invalid && this.forma.get('descripcionProducto').touched; }
  get departamentoNoValido() { return this.forma.get('departamento').invalid && this.forma.get('departamento').touched; }
  get municipioNoValido() { return this.forma.get('municipio').invalid && this.forma.get('municipio').touched; }
  get centroPobladoNoValido() { return this.forma.get('centroPoblado').invalid && this.forma.get('centroPoblado').touched; }
  get nombreContactoNoValido() { return this.forma.get('nombreContacto').invalid && this.forma.get('nombreContacto').touched; }
  get emailNoValido() { return this.forma.get('email').invalid && this.forma.get('email').touched; }
  get tipoCobroNoValido() { return this.forma.get('tipoCobro').invalid && this.forma.get('tipoCobro').touched; }
  get nombreCampoNoValido() { return this.forma.get('nombreCampo').invalid && this.forma.get('nombreCampo').touched; }
  get aliasNoValido() { return this.forma.get('alias').invalid && this.forma.get('alias').touched; }
  
}
