import { Neurona } from './Neurona';

export class Capa{
    nneuronas : number;
    factivacion : string;
    umbral : number[] = [];
    neuronas : Neurona[] = [];
    pesos : number[][] = [];
}