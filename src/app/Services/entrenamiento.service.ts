import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PercetronInit } from '../Models/PercetronInit';
import { Entrenamiento } from '../Models/Entrenamiento';
import { PerceptronResponse } from '../Models/PerceptronResponse';
@Injectable({
  providedIn: 'root'
})
export class EntrenamientoService {
  baseurl: string = 'http://localhost:8000/perceptron';

  constructor(private http: HttpClient) { }

  postinit(percetronInit: PercetronInit){
    return this.http.post(this.baseurl+'/init',percetronInit)
  }

  postfit(Entrenamiento: Entrenamiento){
    return this.http.post<PerceptronResponse>(this.baseurl+'/fit',Entrenamiento)
  }

  postset(Redentrenada: PerceptronResponse){
    return this.http.post<PerceptronResponse>(this.baseurl+'/set',Redentrenada)
  }

  eval(inputs: number[]){
    return this.http.patch<number[]>(this.baseurl+'/eval',{inputs: inputs})
  }
}
