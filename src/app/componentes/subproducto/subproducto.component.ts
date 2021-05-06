import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NumberValueAccessor, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { serviciosService } from '../../servicios/servicios.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;


@Component({
  selector: 'app-subproducto',
  templateUrl: './subproducto.component.html',
  styleUrls: ['./subproducto.component.css']
})
export class SubproductoComponent implements OnInit {

  displayedColumns = ['codigoCliente','razonSocial','codigoSubproducto','descripcionSubproducto','estado','editar'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  //CREA FORMULARIOS
  formaFiltro: FormGroup;
  formaCrea: FormGroup;
  formaEdita: FormGroup;

  //ARREGLOS
  cliente:any[] = [];
  producto:any[] = [];
  cod:any;
  datosConsulta;
  dataSource;

  constructor(private fb: FormBuilder, private serviciosService:serviciosService) { 
    this.servicioCliente();
    this.servicioCodigoSubproducto();
  }

  ngOnInit(): void {
    this.filtro();
    this.crearFormulario();
  }

  //FILTRO

  filtro() {
    this.formaFiltro = this.fb.group(
      {
        codigoCliente: '',
        codigoProducto: ''
      })
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
    this.servicioConsultaSubproducto(this.formaFiltro.value);
    console.log(this.formaFiltro.value);
  }

  //CREAR FORMULARIO

  abrirCrearFormulario() {
    this.crearFormulario();
  }

  crearFormulario() {
    this.formaCrea = this.fb.group({
      codigoSubproducto: [this.cod, [Validators.required]],
      estado: ['N', [Validators.required]],
      codigoCliente: ['', [Validators.required]],
      codigoProducto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    })
      
  }

  guardarCrear(): void{
    if(this.formaCrea.valid){
      this.formaCrea.get('descripcion').setValue(this.formaCrea.get('descripcion').value.toUpperCase());
      console.log(this.formaCrea.value);
      this.servicioCreaSubproducto(this.formaCrea.value);
      this.cerrarCrear();
      this.servicioCodigoSubproducto();
    }
  }

  cerrarCrear() {
    var modal = document.getElementById('ventanaCrearSubproducto');
    $('#ventanaCrearSubproducto').modal('hide');
  }

  //EDITAR FORMULARIO

  editarFormulario() {
    this.formaEdita.get('cliente').disable();
    this.formaEdita.get('producto').disable();
      this.formaEdita = this.fb.group({
        codigoSubproducto: ['67890', [Validators.required]],
        fechaCreacion: [this.fechaActual(), [Validators.required]],
        estado: ['N', [Validators.required]],
        cliente: ['', [Validators.required]],
        producto: ['', [Validators.required]],
        descripcionSubproducto: ['', [Validators.required]]
      })
      
      //this.cambiarProducto();
  }

  guardarEditar() {
    if (this.formaEdita.invalid) {
      return Object.values(this.formaEdita.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    console.log(this.formaEdita.value);
    this.cerrarEditar();
  }

  cerrarEditar() {
    var modal = document.getElementById('ventanaEditarSubproducto');
    $('#ventanaEditarSubproducto').modal('hide');
  }

  //EVENTOS

  selectClie(e){
  this.servicioProducto(e);
  }

  //METODOS COMUNES

  cancelar(){}

  servicioCliente() {
    this.serviciosService.getCliente2().subscribe(data => {
      this.cliente = data;
    });

  }

  servicioProducto(numCliente) {
    this.serviciosService.getProducto2(numCliente).subscribe(product => {
      console.log(product);
      this.producto = product;
    });
  }

  servicioCodigoSubproducto() {
    this.serviciosService.getCodigoCliente('https://felec.computec.com/clienteproducto/api/v1/subproducto').subscribe(codigo => {
      for (var key in codigo) {
        this.cod = codigo['codigoSubproducto'];
      }
    });
  }

  servicioConsultaSubproducto(objeto) {
    this.serviciosService.postConsultaCliente('api/v1/subproductos/consultar', objeto).subscribe(consulta => {
      console.log('Respuesta Consulta',consulta);
      this.datosConsulta = consulta;
      this.dataSource = new MatTableDataSource(this.datosConsulta);
      this.dataSource.paginator = this.paginator;
    });
  }

  servicioCreaSubproducto(objeto) {
    this.serviciosService.postCreaSubproducto('api/v1/subproducto', objeto).subscribe(consulta => {
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
    get codigoSubproductoNoValido() { return this.formaCrea.get('codigoSubproducto').invalid && this.formaCrea.get('codigoSubproducto').touched; }
    get estadoNoValido() { return this.formaCrea.get('estado').invalid && this.formaCrea.get('estado').touched; }
    get clienteNoValido() { return this.formaCrea.get('codigoCliente').invalid && this.formaCrea.get('codigoCliente').touched; }
    get productoNoValido() { return this.formaCrea.get('codigoProducto').invalid && this.formaCrea.get('codigoProducto').touched; }
    get descripcionSubproductoNoValido() { return this.formaCrea.get('descripcion').invalid && this.formaCrea.get('descripcion').touched; }

}
