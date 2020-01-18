import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  serviceUrl = "https://nominatim.openstreetmap.org/search?"
  header = { "Content-Type": 'application/json' }
  //street=mitre 750&city=avellaneda&country=argentina&state=buenos aires&format=json

  constructor(private http: HTTP) { }

  getLocation(domicilio, ciudad, provincia) {

    var params = {
      "street" : domicilio,
      "city" : ciudad,
      "country": "Argentina",
      "state": provincia,
      "format": "json"
    }

    return this.http.get(this.serviceUrl, params, this.header)
  }
}
