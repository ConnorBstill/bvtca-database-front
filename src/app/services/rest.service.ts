import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JWTService } from './jwt.service';

import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(
    private readonly http: HttpClient,
    private readonly jwt: JWTService,
    @Inject('generateXhrLogs') @Optional() public generateXhrLogs?: boolean
  ) {}

  /**
   * @description Generates a console log
   * @param {string} type
   * @param {string} url
   * @param {*} [dataSent]
   * @param {*} [dataReturned]
   */
  protected generateLogs(type: string, url: string, dataSent?: any, dataReturned?: any): void {
    console.log(`%c ${type.toUpperCase()} API CALL TO`, 'background-color: #333; color: #98bccd;');
    console.log(url);
    console.log(`%c DATA SENT`, 'background-color: #333; color: #fac5c5;');
    console.table(dataSent);
    console.log(`%c DATA RETURNED`, 'background-color: #333; color: #f5f5f5;');
    console.table(dataReturned);
  }

  /**
   * @description Abstracts generating an HTTP promise
   * @param {string} httpMethod
   * @param {string} url
   * @param {*} [body=null]
   * @returns {Promise<any>}
   */
  private generateHttpPromise(httpMethod: string, url: string, body = null): Promise<any> {
    let promise: Promise<any> = null;
    console.log('httpMethod', httpMethod)
    if (body) {
        const method = this.http[httpMethod]
        promise = this.http[httpMethod](url, body, {
            headers: {'Content-Type': 'application/json'}
        })
        .toPromise()
        .catch(err => console.log(err));
        console.log('this.buildOptions', promise)
    } else {
      promise = this.http[httpMethod](url, {
        headers: this.buildOptions()
      })
        .toPromise()
        .catch(err => console.log(err));
    }

    if (!environment.production) {
      promise.then(res => {
        if (this.generateXhrLogs) {
          this.generateLogs(httpMethod, url, body, res);
        }
      });
    }

    return promise;
  }

  /**
   * Abstracts HTTP POST
   * @param  {string}       url
   * @param  {any}          body
   * @return {Promise<any>}
   */
  post(url: string, body?: any): Promise<any> {
    return this.generateHttpPromise('post', url, body);
  }

  /**
   * Abstracts HTTP GET
   * @param  {string}       url
   * @return {Promise<any>}
   */
  get(url: string): Promise<any> {
    return this.generateHttpPromise('get', url);
  }

  /**
   * Abstracts HTTP GET
   * @param  {string}       url
   * @return {Promise<any>}
   */
  resolve(url: string): Observable<any> {
    return this.http.get(url, {
      headers: this.buildOptions()
    });
  }

  /**
   * Abstracts HTTP DELETE
   * @param  {string}       url
   * @return {Promise<any>}
   */
  delete(url: string): Promise<any> {
    return this.generateHttpPromise('delete', url);
  }

  /**
   * Abstracts HTTP PUT
   * @param  {string}       url
   * @param  {any}          body
   * @return {Promise<any>}
   */
  put(url: string, body?: any): Promise<any> {
    return this.generateHttpPromise('put', url, body);
  }

  /**
   * Abstracts HTTP PATCH
   * @param  {string}       url
   * @param  {any}          body
   * @return {Promise<any>}
   */
  patch(url: string, body: any): Promise<any> {
    return this.generateHttpPromise('patch', url, body);
  }

  /**
   * Lets use set build options with auth token header on abstracted HTTP calls
   * @return {RequestOptionsArgs}
   */
  private buildOptions(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.jwt.checkToken()
    });
  }

  /**
   * Error handling for all abstracted calls, doesn't reject a Promise
   * @param  {any}          serverError
   */
  private handleError(serverError: any): void {
    try {
      console.log('Caught try', serverError);
    } catch (e) {
      console.log('Caught catch', e);
    }
  }
}
