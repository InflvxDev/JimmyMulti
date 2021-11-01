import { Injectable } from '@angular/core';
import { PerceptronResponse } from '../Models/PerceptronResponse';

@Injectable({
  providedIn: 'root'
})
export class LocalstoreService {

  constructor() { }

  set(key: string, data: PerceptronResponse) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }

  get(key: string){
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.log(error);
    }
  }
}
