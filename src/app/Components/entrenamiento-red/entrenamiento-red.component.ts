import { Component, OnInit } from '@angular/core';
import { Entrenamiento } from '../../Models/Entrenamiento';
import { Patron } from '../../Models/Patron';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { PercetronInit } from '../../Models/PercetronInit';
import { saveAs } from 'file-saver'
import { ThrowStmt } from '@angular/compiler';
import { EntrenamientoService } from '../../Services/entrenamiento.service';
import { PerceptronResponse } from '../../Models/PerceptronResponse';
import { LayerResponse } from '../../Models/LayerResponse';
import { LocalstoreService } from '../../Services/localstore.service';

@Component({
  selector: 'app-entrenamiento-red',
  templateUrl: './entrenamiento-red.component.html',
  styleUrls: ['./entrenamiento-red.component.css']
})
export class EntrenamientoRedComponent implements OnInit {
  fileContent: string | ArrayBuffer = '';
  datosEntrenamiento : Entrenamiento;
  datosPatrones : Patron[] = [];
  datosCapas : PercetronInit;
  patron : Patron;
  capa: PercetronInit;
  Redentrenada : PerceptronResponse;
  pesosoptimos : LayerResponse[] = [];

  errores : number[] = [];
  iniciarEntrenamiento : boolean = true;
  Ncapasocultas : number = 0;
  Nsalidas : number = 0;
  Nentradas : number = 0;
  Npatrones: number = 0;
  constructor(private formBuilder: FormBuilder, private EntrenamientoService: EntrenamientoService,private localstoreService: LocalstoreService) 
  { this.datosEntrenamiento = new Entrenamiento();
    this.capa = new PercetronInit();this.datosCapas = new PercetronInit();
  this.Redentrenada = new PerceptronResponse()}

  ngOnInit(): void {
  }


  //--------------------------------Cargar Archivo------------------------------------------- 

  public onChange(fileList: FileList): void {
    this.datosPatrones = [];
    this.Nentradas = 0;
    this.Nsalidas = 0;
    this.Npatrones = 0;
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    
    fileReader.onloadend = function(x) {
        
        self.fileContent = fileReader.result;
        console.log(typeof(self.fileContent));
        
        var s = self.fileContent.toString().split('\n');
        
        for (var index = 0; index < s.length; index++) {
          var w = s[index].toString().split(';');
            console.log(w.length);
           var j = 0;
          while (w.length > j) {
             var entradas = w[j].toString().split(',');
              var salidas = w[j+1].toString().split(',');
        
            j = w.length + 1;
          }
 
          self.ParsearEntradasySalidas(entradas, salidas);
       } 
        
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

      this.patron.entradas.push(parseFloat(entradas[index]));
    }
    for (let index = 0; index < salidas.length; index++) {

      this.patron.salidas.push(parseFloat(salidas[index]));
    }

    this.datosPatrones.push(this.patron);
    
  }
  //-----------------------------------   Grafica  --------------------------------------------- 
  view: any[] = [700, 300];

  //options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Iteracciones';
  yAxisLabel: string = 'Error';
  xAxisLabel2: string = 'NumeroPatrones';
  yAxisLabel2: string = 'Salidas';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#FF3100', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  multi = [
    
    {
      "name": "ErroresIteraccion",
      "series": [
        {
          "name": "0",
          "value": 1
        },
      ]
    }
  ]

  multi2 = [
    
    {
      "name": "Salida Esperada",
      "series": [
        {
          "name": "0",
          "value": 0
        },
      ]
    },
    {
      "name": "Salida Red",
      "series": [
        {
          "name": "0",
          "value": 0
        },
      ]
    }
  ]


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
   //--------------------------------Configuracion Red------------------------------------------- 




ConfigRedForm = this.formBuilder.group({
  factivacion: ['',Validators.required],
  nodes_per_layer: [''],
  activation_functions_names: [''],


});

ConfigRed2Form = this.formBuilder.group({
  niteracciones: ['',Validators.required],
  emp: ['',Validators.required],
  rataAprendizaje : ['',Validators.required],
});

agregarCapaO(){
  let npl = this.ConfigRedForm.get('nodes_per_layer').value;
  let afn = this.ConfigRedForm.get('activation_functions_names').value
  this.datosCapas.nodes_per_layer.push(npl);
  this.datosCapas.activation_functions_names.push(afn);
  this.Ncapasocultas = this.datosCapas.nodes_per_layer.length;
  this.onReset()
}

onReset(){
  this.ConfigRedForm.reset();
  this.ConfigRed2Form.reset();
}

ACred(){
  let afns = this.ConfigRedForm.get('factivacion').value
  this.datosCapas.activation_functions_names.push(afns)
  this.datosCapas.nodes_per_layer.push(this.Nsalidas)
  this.datosCapas.num_layers = this.datosCapas.nodes_per_layer.length
  this.datosCapas.num_inputs = this.Nentradas;

  this.iniciarEntrenamiento = false;
  console.log("----------DATOS CAPAS------------");

  console.log(this.datosCapas);

  console.log("--------------------------------");
  this.onReset()

  this.EntrenamientoService.postinit(this.datosCapas).subscribe(result => {
    console.log(result);
    alert("Se han inicializado Pesos y Umbrales")
  });
}

Inicializarentrenamiento(){

  this.datosEntrenamiento.epochs = this.ConfigRed2Form.get('niteracciones').value;
  this.datosEntrenamiento.tolerance = this.ConfigRed2Form.get('emp').value;
  this.datosEntrenamiento.learning_rate = this.ConfigRed2Form.get('rataAprendizaje').value;
  let input_temp : number[] = [];
  let output_temp : number[] = [];
  for (let i = 0; i < this.Npatrones; i++) {

    input_temp = this.datosPatrones[i].entradas;
    this.datosEntrenamiento.inputs.push(input_temp);

    output_temp = this.datosPatrones[i].salidas;
    this.datosEntrenamiento.outputs.push(output_temp)
      
  }
  console.log("----------DATOS ENTRENAMIENTO------------");
  console.log(this.datosEntrenamiento);
  console.log("--------------------------------");

  this.EntrenamientoService.postfit(this.datosEntrenamiento).subscribe(result => {
    this.Redentrenada = result;
    this.errores = result.errors;
    let iteraccion : number = 0;

    console.log(result);
    this.pesosoptimos = result.layers;

    this.localstoreService.set("data",this.Redentrenada);

    for (let i = 0; i < this.datosEntrenamiento.epochs; i++) {

     let copy = this.multi;
      copy[0].series.push({ name: iteraccion.toString(), value: this.errores[i] });
       this.multi = [...copy];

       iteraccion ++;
    }
    alert("El entrenamiento ha finalizado")
  });

  this.onReset()
}







}
