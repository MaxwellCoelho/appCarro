/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class SortModel {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  constructor(
    private http: HttpClient,
  ) { }

  public getItens(action: string, page?: string, perPage?: string): any {
    const url = `${environment.middlewareEndpoint}/${action}`;
    const params = {};
    if (page && perPage) {
      params['page'] = page;
      params['perpage'] = perPage;
    }
    return this.http.get(url, { params });
  }

  public deleteItem(action: string, itemId: string): any {
    const myAction = `${action}/${itemId}`;
    const url = `${environment.middlewareEndpoint}/${myAction}`;
    return this.http.delete(url, { withCredentials: true });
  }

  public createItem(action: string, data: any, itemId?: string): any {
    const myAction = itemId ? `${action}/${itemId}` : action;

    const url = `${environment.middlewareEndpoint}/${myAction}`;
    return this.http.post(url, data, { withCredentials: true });
  }

  public filterItem(action: string, data: any, page?: string, perPage?: string, sortBy?: SortModel[]): any {
    const url = `${environment.middlewareEndpoint}/${action}`;
    const params = {};
    if (page && perPage) {
      params['page'] = page;
      params['perpage'] = perPage;
    }

    if (sortBy && sortBy.length) {
      sortBy.forEach(sortItem => {
        params[`sort.${sortItem.name}`] = sortItem.value;
      });
    }
    return this.http.post(url, data, { params, withCredentials: true });
  }
}
