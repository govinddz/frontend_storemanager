import {environment} from '../../environments/environment';


export class Constants {
  /**
   * Define base url for api endpoints
   */
  public static readonly BASE_URL = environment.apiUrl + environment.apiVersion;

  /**
   *  Define endpoints here for auth APIs
   */
  public static readonly createNewShop = Constants.BASE_URL + '/shop';

  public static readonly storeShopsDetail = Constants.BASE_URL + '/shops';


}
