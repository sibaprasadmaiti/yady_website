import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');

  constructor(private router: Router, private translateService: TranslateService) { }

  ngOnInit() {

	  if(this.logtoken == '' || this.logtoken == null) {
			this.router.navigateByUrl('/')
				.then(() => {
					localStorage.clear();
				//window.location.reload();
			});
		}


  }

}
