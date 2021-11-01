import { Component, OnInit } from '@angular/core';
import { Patron } from '../../Models/Patron';
import { EntrenamientoService } from '../../Services/entrenamiento.service';
import { LocalstoreService } from '../../Services/localstore.service';
import { PerceptronResponse } from '../../Models/PerceptronResponse';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.css']
})
export class SimulacionComponent implements OnInit {
  datosPatrones : Patron[] = [];
  Redentrenada : PerceptronResponse;
  patron : Patron;
  fileContent: string | ArrayBuffer = '';
  entradas : number[] = [];
  salidasesp : number[] = [];
  salidared : number[] =[];
  Nsalidas : number = 0;
  Nentradas : number = 0;
  Npatrones: number = 0;
  activarsimulacion : boolean = true;
  constructor(private EntrenamientoService: EntrenamientoService,private localstoreService: LocalstoreService) {
    this.Redentrenada = new PerceptronResponse()
   }

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
        self.activarsimulacion = false;
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

  onSimulation(){
    this.patron = new Patron();
    this.Redentrenada = this.localstoreService.get("data");
    console.log(this.Redentrenada);

    this.patron = this.datosPatrones[0]
    this.EntrenamientoService.eval(this.patron.entradas).subscribe(result =>{
      this.salidared = result;
      this.salidasesp = this.patron.salidas
      this.entradas = this.patron.entradas

        var a = 1;
        for (let i = 0; i < this.salidared.length; i++) {
          let copy = this.multi2;
          copy[0].series.push({ name: a.toString(), value: this.salidasesp[i] });
          copy[1].series.push({ name: a.toString(), value: this.salidared[i] });
          this.multi2 = [...copy];
          a++;
        }
        

      console.log(this.salidared);
    })
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
      domain: ['#FF3100', '#5AA454', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
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

}
