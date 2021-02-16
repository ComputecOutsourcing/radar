import{RouterModule, Routes} from '@angular/router';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { SubproductoComponent } from './componentes/subproducto/subproducto.component';




const app_routes:Routes = [
    {path: 'clientes', component: ClienteComponent},
    {path: 'productos', component: ProductoComponent},
    {path: 'subproductos', component: SubproductoComponent},
    {path: '**', pathMatch: 'full', redirectTo:'clientes'}
];

export const app_routing = RouterModule.forRoot(app_routes);