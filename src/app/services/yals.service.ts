import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { YalsRequest } from '../models/yals.model';
import { ObservablesService } from './observables.service';

@Injectable()
export class YalsService {

  constructor(private obsv: ObservablesService, private _http: HttpClient) { }

  getRequest() {
    return this._http.get("/api/yals");
  }

  generateRequest(yals: YalsRequest, cuponid: String) {
    const client = this.obsv.currentUser;
    return this._http.post("/api/yals", { clientid: client._id, yals_request: yals, cuponid: cuponid });
  }

}
