import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { serviciosService } from '../../servicios/servicios.service';
declare var $: any;


@Component({
  selector: 'app-subproducto',
  templateUrl: './subproducto.component.html',
  styleUrls: ['./subproducto.component.css']
})
export class SubproductoComponent implements OnInit {

  forma: FormGroup;
  cliente:any[] = [];
  producto:any[] = [];
  constructor(private fb: FormBuilder, private serviciosService:serviciosService) { 
    this.nuevo();
    this.servicioCliente();
    this.servicioProducto('0');
  }

  ngOnInit(): void {
  }

  nuevo(){
    this.forma = this.fb.group({
      codigoSubproducto: new FormControl ({value: '', disabled: true}, Validators.required),
      fechaCreacion: new FormControl ({value: this.fechaActual(), disabled: true}, Validators.required),
      estado: new FormControl ({value: '', disabled: true}, Validators.required),
      cliente:'',
      producto:'',
      descripcionSubproducto:''
    })
  }

  //CREAR FORMULARIO

  crearFormulario() {
    this.forma.get('cliente').enable();
    this.forma.get('producto').enable();
      this.forma = this.fb.group({
        codigoSubproducto: ['12345', [Validators.required]],
        fechaCreacion: [this.fechaActual(), [Validators.required]],
        estado: ['N', [Validators.required]],
        cliente: ['', [Validators.required]],
        producto: ['', [Validators.required]],
        descripcionSubproducto: ['', [Validators.required]]
      })
      
      this.cambiarProducto();
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
    var modal = document.getElementById('ventanaCrearSubproducto');
    $('#ventanaCrearSubproducto').modal('hide');
  }

  //EDITAR FORMULARIO

  editarFormulario() {
    this.forma.get('cliente').disable();
    this.forma.get('producto').disable();
      this.forma = this.fb.group({
        codigoSubproducto: ['67890', [Validators.required]],
        fechaCreacion: [this.fechaActual(), [Validators.required]],
        estado: ['N', [Validators.required]],
        cliente: ['', [Validators.required]],
        producto: ['', [Validators.required]],
        descripcionSubproducto: ['', [Validators.required]]
      })
      
      this.cambiarProducto();
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
    var modal = document.getElementById('ventanaEditarSubproducto');
    $('#ventanaEditarSubproducto').modal('hide');
  }

  //METODOS COMUNES

  cancelar(){}

  servicioCliente(){
    this.serviciosService.getCliente('https://felec.computec.com/clienteproducto/api/v1/clientes').subscribe( cliente =>{
      this.cliente = cliente;
    });
  }

  servicioProducto(numCliente){
    console.log(numCliente);
    this.serviciosService.getProducto('https://felec.computec.com/clienteproducto/api/v1/'+numCliente+'/productos ').subscribe( producto =>{
      this.producto = producto;
    });
  }

  cambiarProducto(){
    console.log('aca estoy');
    this.forma.get('cliente').valueChanges.subscribe(valor =>{console.log(valor);
      this.servicioProducto(valor);
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
    get codigoSubproductoNoValido() { return this.forma.get('codigoSubproducto').invalid && this.forma.get('codigoSubproducto').touched; }
    get fechaCreacionNoValido() { return this.forma.get('fechaCreacion').invalid && this.forma.get('fechaCreacion').touched; }
    get estadoNoValido() { return this.forma.get('estado').invalid && this.forma.get('estado').touched; }
    get clienteNoValido() { return this.forma.get('cliente').invalid && this.forma.get('cliente').touched; }
    get productoNoValido() { return this.forma.get('producto').invalid && this.forma.get('producto').touched; }
    get descripcionSubproductoNoValido() { return this.forma.get('descripcionSubproducto').invalid && this.forma.get('descripcionSubproducto').touched; }

}
