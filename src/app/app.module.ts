import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulacionComponent } from './Components/simulacion/simulacion.component';
import { NavComponent } from './Components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntrenamientoRedComponent } from './Components/entrenamiento-red/entrenamiento-red.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulacionComponent,
    NavComponent,
    EntrenamientoRedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
