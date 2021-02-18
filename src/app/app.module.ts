import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';


//Rutas
import {app_routing} from './app.routes';

//Servicios
import { HttpClientModule} from '@angular/common/http';

//Componentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { SubproductoComponent } from './componentes/subproducto/subproducto.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClienteComponent,
    ProductoComponent,
    SubproductoComponent
  ],
  imports: [
    BrowserModule,
    app_routing,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
