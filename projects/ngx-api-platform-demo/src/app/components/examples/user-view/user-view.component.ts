import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ResourceServiceTokenFor } from 'ngx-api-platform';
import { of, Subscription, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../../resources/user';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
})
export class UserViewComponent implements OnInit, OnDestroy {
  activateTabId: string;

  user: User;

  subscription: Subscription;

  constructor(
    @Inject(ResourceServiceTokenFor(User)) private userApiService: ResourceService<User>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subscription = zip(
      this.activatedRoute.params,
      this.activatedRoute.fragment,
    )
      .pipe(
        switchMap(([params, fragment]) => {
          this.activateTabId = fragment;

          if (params.hasOwnProperty('user')) {
            return this.userApiService.getResource(params.user);
          }

          return of(null);
        }),
      )
      .subscribe((user: User) => this.user = user);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  updateFragmentForActiveTab(activeId: string): void {
    if (activeId) {
      this.router.navigate([], {fragment: activeId});
    }
  }
}
