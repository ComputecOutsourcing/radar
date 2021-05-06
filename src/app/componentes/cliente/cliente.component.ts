import { Component, OnInit,  ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NumberValueAccessor, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { serviciosService } from '../../servicios/servicios.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
declare var $: any;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit{

  displayedColumns = ['fechaCreacion','codigo','tipoIdentificacion','numeroIdentificacion','razonSocial','direccion','telefono','sector','estado','editar'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  // CREA FORMULARIOS
  formaFiltro: FormGroup;
  formaCrea: FormGroup;
  formaEdita: FormGroup;

  // ARREGLOS
  prupru:any[] = [{num:1, letra:'c'},{num:5, letra:'g'},{num:10, letra:'z'},{num:3, letra:'a'},{num:8, letra:'l'}];
  departamento;
  municipio;
  centroPoblado: any[] = [];
  cliente;
  identificacioCliente: any[] = [];
  clienteCodigo:any;
  cod: any;
  sector: any[] = [
    { valor: '', indice: '' },
    { valor: 'FI', indice: 'FI' },
    { valor: 'FO', indice: 'FO' },
    { valor: 'OT', indice: 'OT' },
    { valor: 'SA', indice: 'SA' },
    { valor: 'SP', indice: 'SP' },
    { valor: 'TE', indice: 'TE' },
    { valor: null, indice: 'Null' }
  ];

  tipoIdentificacion: any[] = [
    { codigo: 7, nombre: 'Cedula Extranjeria', abreviatura: 'CE' },
    { codigo: 2, nombre: 'Cedula de Ciudadania', abreviatura: 'CC' },
    { codigo: 8, nombre: 'Fidecoismo', abreviatura: 'F' },
    { codigo: 1, nombre: 'NIT', abreviatura: 'NT' },
    { codigo: 11, nombre: 'NIT Extranjeria', abreviatura: 'NE' },
    { codigo: 9, nombre: 'NIT Menores', abreviatura: 'NM' },
    { codigo: 12, nombre: 'NIT Persona Natural', abreviatura: 'NP' },
    { codigo: 14, nombre: 'Num Unico Identif Personal', abreviatura: 'NU' },
    { codigo: 4, nombre: 'Pasaporte', abreviatura: 'P' },
    { codigo: 10, nombre: 'RIF', abreviatura: 'R' },
    { codigo: 13, nombre: 'Registro Civil', abreviatura: 'RC' },
    { codigo: 6, nombre: 'Sociedad Extranjera sin NIT', abreviatura: 'SE' },
    { codigo: 5, nombre: 'Tarjeta Seguro Social Extranjera', abreviatura: 'SS' },
    { codigo: 3, nombre: 'Tarjeta de Identidad', abreviatura: 'TI' },
    { codigo: 0, nombre: 'Tipo no Identificado', abreviatura: 'NA' }
  ];

    // VARIABLES
    datosConsulta;
    dataSource;
    codigoDepartamento;
    frase;
    

  constructor(private fb: FormBuilder, private serviciosService: serviciosService) {
    this.servicioCliente();
    this.servicioCodigoCliente();
    this.servicioDepartamento();
  } 
  
  ngOnInit(): void {
    this.filtro();
    this.crearFormulario();
    this.editarFormulario();
    //this.servicioConsultaCliente(this.formaFiltro.value);
  }


  //FILTRO

  filtro() {

    
    this.formaFiltro = this.fb.group(
      {
        codigoCliente: '',
        numeroIdentificacion: '',
        razonSocial: '',
        fechaInicio: '',
        fechaFin: ''
      });
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
    this.formaFiltro.get('fechaInicio').setValue(this.formatoFecha(this.formaFiltro.get('fechaInicio').value));
    this.formaFiltro.get('fechaFin').setValue(this.formatoFecha(this.formaFiltro.get('fechaFin').value));
    console.log(this.formaFiltro.value);
    this.servicioConsultaCliente(this.formaFiltro.value);
    this.formaFiltro.reset({});
  }
  
  // CREAR FORMULARIO
  
  abrirCrearFormulario() {
    this.crearFormulario();
  }

  crearFormulario():void {  
    
    this.formaCrea = this.fb.group({
      codigo: [this.cod, [Validators.required]],
      fechaCreacion: [this.fechaActual(), [Validators.required]],
      estado: ['N', [Validators.required]],
      tipoIdentificacion: [{ value: this.tipoIdentificacion[3].codigo, disabled: false }, [Validators.required]],
      numeroIdentificacion: [{ value: '', disabled: false },[Validators.required, Validators.pattern('[0-9]*'), Validators.min(0), this.validarIdentificacion()]],
      razonSocial: ['', [Validators.required]],
      direccion: [''],
      telefono: [''],
      departamento: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      centroPoblado: ['', [Validators.required]],
      sector: [this.sector[0].indice]
    })
  }
  
  guardarCrear(): void{
    if(this.formaCrea.valid){
      this.formaCrea.get('razonSocial').setValue(this.formaCrea.get('razonSocial').value.toUpperCase());
      console.log(this.formaCrea.value);
      //this.servicioCreaCliente(this.formaCrea.value);
      this.cerrarCrear();
      this.servicioCodigoCliente();
    }
  }

  cerrarCrear() {
    var modal = document.getElementById('ventanaCrearCliente');
    $('#ventanaCrearCliente').modal('hide');
  }

  //EDITAR FORMULARIO
  
  abrirEditarFormulario() {
    setTimeout(() => {
    this.formaEdita.setValue({
      codigo: this.clienteCodigo.codigo,
      fechaCreacion: this.clienteCodigo.fechaCreacion,
      estado: this.clienteCodigo.estado,
      tipoIdentificacion: this.clienteCodigo.tipoIdentificacion,
      numeroIdentificacion: this.clienteCodigo.numeroIdentificacion,
      razonSocial: this.clienteCodigo.razonSocial,
      direccion: this.clienteCodigo.direccion,
      telefono: this.clienteCodigo.telefono,
      departamento: this.clienteCodigo.departamento,
      municipio: this.clienteCodigo.municipio,
      centroPoblado: this.clienteCodigo.centroPoblado,
      sector: this.clienteCodigo.sector
    })},400);
    console.log('metodo',this.clienteCodigo.codigo);
  }

  editarFormulario() {
    this.formaEdita = this.fb.group({
      codigo: [''],
      fechaCreacion: [''],
      estado: [''],
      tipoIdentificacion: [''],
      numeroIdentificacion: [''],
      razonSocial: ['', [Validators.required]],
      direccion: [''],
      telefono: [''],
      departamento: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      centroPoblado: ['', [Validators.required]],
      sector: ['', [Validators.required]]
    })
  }

  guardarEditar(): void{
    if(this.formaEdita.valid){
      console.log(this.formaEdita.value);
      this.servicioActualizaCliente(this.formaEdita.value);
      this.cerrarEditar();
    }
  }

  cerrarEditar() {
    var modal = document.getElementById('ventanaEditarCliente');
    $('#ventanaEditarCliente').modal('hide');
  }

  // EVENTOS

  selectDept(e){
    this.codigoDepartamento = e;
    this.servicioMunicipio(e)
  }

  selectMuni(e){
    this.servicioCentroPoblado(this.codigoDepartamento, e);
  }

  selectCli(e){
    this.servicioClienteCodigo(e);
    //this.abrirEditarFormulario();
    setTimeout(() => {this.abrirEditarFormulario();},100);
  }

  //METODOS COMUNES

  cancelar() {
    //this.forma.reset({});
  }

  tip(a):string{
    return this.tipoIdentificacion[a].nombre;
  }

  formatoFecha(date):string{
    if(date){
    let dividir = date.split("-");
    let fecha = dividir[2] + '/' + dividir[1] + '/' + dividir[0];
    return fecha}
    return "";
  }

  fechaActual():string {
    let date = new Date()
    
    let day = date.getDate()
    let month = date.getMonth() + 1
    let anio = date.getFullYear()
    
    if (month < 10 && day < 10) {
      let dia = 0 + '' + day; let mes = 0 + '' + month; return dia + "/" + mes + '/' + anio;
    } else if (month < 10) {
      let mes = 0 + '' + month; return day + "/" + mes + '/' + anio;
    } else if (day < 10) {
      let dia = 0 + '' + day; return dia + "/" + month + '/' + anio;
    } else { return day + "/" + month + '/' + anio; }
  }
  
  // VALIDACIONES

  getValidaciones(control: string): AbstractControl{
    return this.formaCrea.get(control);
  }
  
  private validarIdentificacion(): ValidatorFn {
    
    return (control: AbstractControl): ValidationErrors | null => {
      if(!!this.formaCrea){
        let num = this.formaCrea.get('numeroIdentificacion').value;
        if(isNaN(num)){
          this.formaCrea.get('numeroIdentificacion').setErrors({ required: true });
        }else if(num >= 0){
          if(num){
            this.cliente.forEach((element, index) => {
              if(element.numeroIdentificacion === num){

                alert('Esta identificación ya existe ' + this.formaCrea.get('numeroIdentificacion').value);
                return;
              }else{
                this.formaCrea.get('numeroIdentificacion').setErrors({ required: true });
              }
            });
          }
        }
      }
      return null;
    };
    return null;
  }

  get tipoIdentificacionNoValido() { return this.formaCrea.get('tipoIdentificacion').invalid && this.formaCrea.get('tipoIdentificacion').touched; }
  get numeroIdentificacionNoValido() { return this.formaCrea.get('numeroIdentificacion').invalid && this.formaCrea.get('numeroIdentificacion').touched; }
  get razonSocialNoValido() { return this.formaCrea.get('razonSocial').invalid && this.formaCrea.get('razonSocial').touched; }
  get departamentoNoValido() { return this.formaCrea.get('departamento').invalid && this.formaCrea.get('departamento').touched; }
  get municipioNoValido() { return this.formaCrea.get('municipio').invalid && this.formaCrea.get('municipio').touched; }
  get centroPobladoNoValido() { return this.formaCrea.get('centroPoblado').invalid && this.formaCrea.get('centroPoblado').touched; }
  
  // SERVICIOS

  servicioDepartamento() {
    this.serviciosService.getDepartamento2().subscribe(departamento => {
      departamento.sort(function(a,b){
        if(a.descripcionDepartamento > b.descripcionDepartamento){
          return 1;
        }
        if(a.descripcionDepartamento < b.descripcionDepartamento){
          return -1;
        }
        return 0;
      });
      this.departamento = departamento;
    });
  }

  servicioMunicipio(numDepartamento) {
    this.serviciosService.getMunicipio2(numDepartamento).subscribe(municip => {
      municip.sort(function(a,b){
        if(a.descripcionMunicipio > b.descripcionMunicipio){
          return 1;
        }
        if(a.descripcionMunicipio < b.descripcionMunicipio){
          return -1;
        }
        return 0;
      });
      this.municipio = municip;
    });
  }

  servicioCentroPoblado(numDepartamento, numMunicipio) {
    this.serviciosService.getCentroPoblado2(numDepartamento, numMunicipio).subscribe(centroPobla => {
      centroPobla.sort(function(a,b){
        if(a.descripcionCentroPoblado > b.descripcionCentroPoblado){
          return 1;
        }
        if(a.descripcionCentroPoblado < b.descripcionCentroPoblado){
          return -1;
        }
        return 0;
      });
      this.centroPoblado = centroPobla;
    });
  }
  servicioCliente() {
    this.serviciosService.getCliente2().subscribe(data => {
      data.sort(function(a,b){
        if(a.descripcionCliente > b.descripcionCliente){
          return 1;
        }
        if(a.descripcionCliente < b.descripcionCliente){
          return -1;
        }
        return 0;
      });
      this.cliente = data;
    });

  }

  servicioClienteCodigo(cod){
    this.serviciosService.getClienteCodigoPintar(cod).subscribe(clienteCod => {
      this.clienteCodigo = clienteCod;
      console.log('servicio', clienteCod.codigo);
    })
  }

  servicioCodigoCliente() {
    this.serviciosService.getCodigoCliente('https://felec.computec.com/clienteproducto/api/v1/cliente').subscribe(codigo => {

      for (var key in codigo) {
        this.cod = codigo['codigo'];
      }
      
    });
  }

  servicioConsultaCliente(objeto) {
    this.serviciosService.postConsultaCliente('api/v1/clientes/consultar', objeto).subscribe(consulta => {
      this.datosConsulta = consulta;
      this.dataSource = new MatTableDataSource(this.datosConsulta);
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Resultados por página';
      
    });
  }

  servicioCreaCliente(objeto) {
    this.serviciosService.postCreaCliente('api/v1/cliente', objeto).subscribe(consulta => {
    });
  }

  servicioActualizaCliente(objeto){
  this.serviciosService.putActualizarCliente('api/v1/cliente', objeto).subscribe(consulta => {

  });
  }
}

