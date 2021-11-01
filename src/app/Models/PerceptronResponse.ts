import { LayerResponse } from './LayerResponse';
export class PerceptronResponse{
    num_inputs: number;
    num_layers: number;
    layers: LayerResponse[] = [];
    errors: number[] = [];
}