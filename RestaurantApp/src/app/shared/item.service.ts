import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';

import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  items: Item[];
  readonly baseURL = 'http://localhost:3001/items';

  constructor(private http: HttpClient) { }

  getItemList() {
    return this.http.get(this.baseURL);
  }

}
