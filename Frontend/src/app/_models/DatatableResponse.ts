import { IMis } from './IMis';

export class DataTablesResponse {
    data: IMis[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
  }