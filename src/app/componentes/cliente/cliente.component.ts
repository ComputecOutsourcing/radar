import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { serviciosService } from '../../servicios/servicios.service';
import { Observable } from 'rxjs';
declare var $: any;

interface ErrorValidate{
  [s:string]:boolean
}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  forma: FormGroup;
  formaFiltro: FormGroup;
  codigo:any;
  departamento:any[] = [];
  municipio:any[] = [];
  centroPoblado:any[] = [];
  cliente:any[] = [];
  
  sector:any[] = [
    {valor:'', indice:''},
    {valor:'FI', indice:'FI'}, 
    {valor:'FO', indice:'FO'},
    {valor:'OT', indice:'OT'},
    {valor:'SA', indice:'SA'},
    {valor:'SP', indice:'SP'},
    {valor:'TE', indice:'TE'},
    {valor: null, indice: 'Null'}];
  cod:any;
  id:any[]=[];
  tipoIdentificacion:any[] = [
    {codigo:0,nombre:'Tipo no Identificado',abreviatura:'NA'},
    {codigo:1,nombre:'NIT',abreviatura:'NT'},
    {codigo:2,nombre:'Cedula de Ciudadania',abreviatura:'CC'},
    {codigo:3,nombre:'Tarjeta de Identidad',abreviatura:'TI'},
    {codigo:4,nombre:'Pasaporte',abreviatura:'P'},
    {codigo:5,nombre:'Tarjeta Seguro Social Extranjera',abreviatura:'SS'},
    {codigo:6,nombre:'Sociedad Extranjera sin NIT',abreviatura:'SE'},
    {codigo:7,nombre:'Cedula Extranjeria',abreviatura:'CE'},
    {codigo:8,nombre:'Fidecoismo',abreviatura:'F'},
    {codigo:9,nombre:'NIT Menores',abreviatura:'NM'},
    {codigo:10,nombre:'RIF',abreviatura:'R'},
    {codigo:11,nombre:'NIT Extranjeria',abreviatura:'NE'},
    {codigo:12,nombre:'NIT Persona Natural',abreviatura:'NP'},
    {codigo:13,nombre:'Registro Civil',abreviatura:'RC'},
    {codigo:14,nombre:'Num Unico Identif Personal',abreviatura:'NU'}];

  constructor(private fb: FormBuilder, private serviciosService:serviciosService) {
    this.servicioCodigoCliente();
    this.filtro();
    this.nuevo();
    this.servicioDepartamento();
    this.servicioMunicipio('0');
    this.servicioCentroPoblado('0','0');
    this.servicioCliente();
   
  }

  ngOnInit(): void {}

  nuevo(){
    this.forma = this.fb.group({
      codigoCliente: new FormControl ({value: '', disabled: true}, Validators.required),
      fechaCreacion: new FormControl ({value: this.fechaActual(), disabled: true}, Validators.required),
      estado: new FormControl ({value: '', disabled: true}, Validators.required),
      tipoIdentificacion:'',
      numeroIdentificacion:'',
      razonSocial:'',
      direccion: '',
      telefono:'',
      departamento:'',
      municipio:'',
      centroPoblado:'',
      sector:''
    })
  }

  //FILTRO

  filtro(){
    this.formaFiltro = this.fb.group(
    {codigoCliente : '',    
    numeroIdentificacion : '',     
    razonSocial : '',     
    fechaInicio : '',     
    fechaFin : ''})
  }

  guardarFiltro() {
    if (this.formaFiltro.invalid) {
      return Object.values(this.formaFiltro.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    this.servicioConsultaCliente(this.formaFiltro.value);
    this.formaFiltro.reset({});

  }

  // CREAR FORMULARIO

  crearFormulario() {
  this.forma.get('tipoIdentificacion').enable();
  this.forma.get('numeroIdentificacion').enable();
  this.servicioCodigoCliente();
  this.servicioCliente();
    this.forma = this.fb.group({
      codigoCliente: [this.cod, [Validators.required]],
      fechaCreacion: [this.fechaActual(), [Validators.required]],
      estado: ['N', [Validators.required]],
      tipoIdentificacion: [this.tipoIdentificacion[1].codigo, [Validators.required]],
      numeroIdentificacion: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      direccion: [''],
      telefono: [''],
      departamento: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      centroPoblado: ['', [Validators.required]],
      sector: [this.sector[0].indice]
    })
    this.servicioCliente();
    this.cambiarDMC();
    this.validarIdentificacion();
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
    var modal = document.getElementById('ventanaCrearCliente');
    $('#ventanaCrearCliente').modal('hide');
  }

  //EDITAR FORMULARIO

  editarFormulario() {
    this.forma.get('tipoIdentificacion').disable();
    this.forma.get('numeroIdentificacion').disable();
    this.forma = this.fb.group({
      codigoCliente: ['67890', [Validators.required]],
      fechaCreacion: [this.fechaActual(), [Validators.required]],
      estado: ['N', [Validators.required]],
      tipoIdentificacion: [this.tipoIdentificacion[1].codigo, [Validators.required]],
      numeroIdentificacion: ['222', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      direccion: [''],
      telefono: [''],
      departamento: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      centroPoblado: ['', [Validators.required]],
      sector: [this.sector[0]]
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
    var modal = document.getElementById('ventanaEditarCliente');
    $('#ventanaEditarCliente').modal('hide');
  }

  //METODOS COMUNES

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

  servicioConsultaCliente(objeto){
      this.serviciosService.postConsultaCliente('api/v1/clientes/consultar',objeto).subscribe( consulta =>{
        
        console.log(consulta);
      
    });
  }

  servicioCodigoCliente(){
    this.serviciosService.getCodigo('https://felec.computec.com/clienteproducto/api/v1/cliente').subscribe( codigo =>{
      
      for (var key in codigo) {
        this.cod = codigo['codigo'];
     }
    });
  }

  cambiarDMC(){
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
  get codigoClienteNoValido() { return this.forma.get('codigoCliente').invalid && this.forma.get('codigoCliente').touched; }
  get fechaCreacionNoValido() { return this.forma.get('fechaCreacion').invalid && this.forma.get('fechaCreacion').touched; }
  get estadoNoValido() { return this.forma.get('estado').invalid && this.forma.get('estado').touched; }
  get tipoIdentificacionNoValido() { return this.forma.get('tipoIdentificacion').invalid && this.forma.get('tipoIdentificacion').touched; }
  get numeroIdentificacionNoValido() { return this.forma.get('numeroIdentificacion').invalid && this.forma.get('numeroIdentificacion').touched; }
  get razonSocialNoValido() { return this.forma.get('razonSocial').invalid && this.forma.get('razonSocial').touched; }
  get direccionNoValido() { return this.forma.get('direccion').invalid && this.forma.get('direccion').touched; }
  get telefonoNoValido() { return this.forma.get('telefono').invalid && this.forma.get('telefono').touched; }
  get departamentoNoValido() { return this.forma.get('departamento').invalid && this.forma.get('departamento').touched; }
  get municipioNoValido() { return this.forma.get('municipio').invalid && this.forma.get('municipio').touched; }
  get centroPobladoNoValido() { return this.forma.get('centroPoblado').invalid && this.forma.get('centroPoblado').touched; }
  get sectorNoValido() { return this.forma.get('sector').invalid && this.forma.get('sector').touched; }

  transformar(valor:string): string {
    let primero = valor.substr(0,1).toUpperCase();
    let completo = primero+valor.substr(1).toLowerCase();
    return completo
  }

  validarIdentificacion(){
    this.forma.get('numeroIdentificacion').valueChanges.subscribe(valor =>{
      for(var cli in this.cliente){
            if(valor === this.cliente[cli].numeroIdentificacion){
              console.log('encontre');
            }
            
           }
    });
    
  }

  
}
