import { Component, OnInit } from '@angular/core';
import { Entrenamiento } from 'src/app/Models/Entrenamiento';
import { Patron } from 'src/app/Models/Patron';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Capa } from '../../Models/Capa';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.css']
})
export class EntrenamientoComponent implements OnInit {
  fileContent: string | ArrayBuffer = '';
  datosEntrenamiento : Entrenamiento;
  datosPatrones : Patron[] = [];
  datosCapasO : Capa[] = [];
  patron : Patron;
  capaO: Capa;

  iniciarEntrenamiento : boolean = true;
  Nsalidas : number;
  Nentradas : number;
  Npatrones: number;
  constructor(private formBuilder: FormBuilder) {
    this.datosEntrenamiento = new Entrenamiento();
    this.capaO = new Capa();
   }

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
      this.datosCapasO = this.ConfigRedForm.get('capasO').value;
      
    }

    //--------------------------------Inicializar perso y umbrales------------------------------------------- 
    
    ConfigRed2Form = this.formBuilder.group({
      factivacionS : ['',Validators.required],
      algoritmo: ['',Validators.required],
      niteracciones: ['',Validators.required],
      emp: ['',Validators.required],
      rataAprendizaje : ['',Validators.required],
    });

    InicializarPesos(){
      this.iniciarEntrenamiento = false;
      
   
    }

    

    Inicializarentrenamiento(){
      this.datosEntrenamiento = this.ConfigRed2Form.value;
      console.log(this.datosEntrenamiento);
      console.log(this.datosPatrones);
      
    }

    
  
}
