import { NodeResponse } from "./NodeResponse"

export class LayerResponse{
    num_inputs: number;
    nodes: NodeResponse[] = [];
    activation_function_name: string;
}