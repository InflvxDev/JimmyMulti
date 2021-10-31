import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrenamientoComponent } from './Components/entrenamiento/entrenamiento.component';
import { EntrenamientoRedComponent } from './Components/entrenamiento-red/entrenamiento-red.component';
import { SimulacionComponent } from './Components/simulacion/simulacion.component';


const routes: Routes = [
{path: "simulacion", component: SimulacionComponent},
{path: '', component: EntrenamientoRedComponent, pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
