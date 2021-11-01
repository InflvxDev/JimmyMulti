import { Neurona } from './Neurona';

export class Capa{
    nneuronas : number;
    factivacion : string;
    umbral : number[] = [];
    h : number[] = [];
    pesos : number[][] = [];
}