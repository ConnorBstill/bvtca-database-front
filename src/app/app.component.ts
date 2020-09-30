import { Component, OnInit } from '@angular/core';

import { RestService } from './services/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bvtca-database-front';

  constructor(readonly rest: RestService) {}

  ngOnInit() {
    this.rest.post(`http://localhost:3000/register`, {
      email: 'connor@lamarsoftware.io',
      password: 'password'
    }).then(res => {
      console.log('res', res)
    }).catch(err => {
      console.log('err', err)
    })


    console.log('On Init')
  }
}
