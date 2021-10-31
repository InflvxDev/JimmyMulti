import { Component, OnInit } from '@angular/core';
import { Entrenamiento } from '../../Models/Entrenamiento';
import { Patron } from '../../Models/Patron';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Capa } from '../../Models/Capa';

@Component({
  selector: 'app-entrenamiento-red',
  templateUrl: './entrenamiento-red.component.html',
  styleUrls: ['./entrenamiento-red.component.css']
})
export class EntrenamientoRedComponent implements OnInit {
  fileContent: string | ArrayBuffer = '';
  datosEntrenamiento : Entrenamiento;
  datosPatrones : Patron[] = [];
  datosCapas : Capa[] = [];
  patron : Patron;
  capa: Capa;

  Nsalidas : number;
  Nentradas : number;
  Npatrones: number;
  constructor(private formBuilder: FormBuilder) { this.datosEntrenamiento = new Entrenamiento();
    this.capa = new Capa(); }

  ngOnInit(): void {
  }

  //--------------------------------Cargar Archivo------------------------------------------- 

  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function(x) {
        
        self.fileContent = fileReader.result;
        console.log(typeof(self.fileContent));
        
        var s = self.fileContent.toString().split('\r\n');
        for (var index = 0; index < s.length; index++) {
          var w = s[index].toString().split(';');
           // console.log(w);
           var j = 0;
          while (w.length > j) {
             var entradas = w[j].toString().split(',');
              var salidas = w[j+1].toString().split(',');
        
            j = w.length + 1;
          }
 
          self.ParsearEntradasySalidas(entradas, salidas);
       } 
        console.log(self.fileContent);
        console.log(self.datosPatrones);
        self.Npatrones = self.datosPatrones.length;
        self.Nsalidas = self.datosPatrones[0].salidas.length;
        self.Nentradas = self.datosPatrones[0].entradas.length;
    }
    
    fileReader.readAsText(file);
    
  }
  
  public ParsearEntradasySalidas(entradas, salidas){
    this.patron = new Patron();

    for (let index = 0; index < entradas.length; index++) {

      this.patron.entradas.push(parseInt(entradas[index]));
    }
    for (let index = 0; index < salidas.length; index++) {

      this.patron.salidas.push(parseInt(salidas[index]));
    }

    this.datosPatrones.push(this.patron);
    
  }

   //--------------------------------Configuracion Red------------------------------------------- 
 get capasO(){
  return this.ConfigRedForm.get('capasO') as FormArray;
}



ConfigRedForm = this.formBuilder.group({
  factivacion: ['',Validators.required],
  capasO: this.formBuilder.array([])
});

agregarCapaO(){
  const capaOFormGroup  = this.formBuilder.group({
    nneuronas: ['',Validators.required],
    factivacion: ['',Validators.required]
  });
  this.capasO.push(capaOFormGroup);
}

removerCapa(i : number){
  this.capasO.removeAt(i);
}

ACred(){
  this.datosCapas = this.ConfigRedForm.get('capasO').value;

  
  this.capa.factivacion = this.ConfigRedForm.get('factivacion').value;
  this.capa.nneuronas = this.Nsalidas;

  this.datosCapas.push(this.capa);
  console.log(this.datosCapas);
  
}

}
