import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {select, Store} from '@ngrx/store';

import * as fromSearch from '../reducers';
import * as fromSavedQueryActions from '../actions/saved-query.actions';
import * as fromFormActions from '../actions/form.actions';

@Component({
  selector: 'app-manage-saved-queries',
  template: `
    <hr *ngIf="(numberOfSavedQueries$ | async)">
    <div class="mt-2" *ngIf="(numberOfSavedQueries$ | async)">
      <div class="h6">Meine Suchen</div>
      <div class="no-gutters">
        <div *ngFor="let savedQuery of savedQueries$ | async"
             class="input-group input-group-sm col-md-6 mt-1">
      <span class="input-group-btn">
              <button class="btn btn-primary fa fa-play"
                      type="button"
                      (click)="loadUserQuery(savedQuery.id)">
              </button>
            </span>
          <input type="text"
                 class="form-control"
                 disabled
                 title="Name der Query"
                 [value]=savedQuery.name>
          <span class="input-group-btn">
              <app-copy-link
                [data]="savedQuery.query">
              </app-copy-link>
            </span>
          <span class="input-group-btn">
              <button class="btn btn-danger fa fa-trash"
                      type="button"
                      (click)="deleteUserQuery(savedQuery.id)"></button>
            </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-group-btn select {
      border-color: #ccc;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSavedQueriesComponent {
  savedQueries$: Observable<any>;
  private savedQueryEntities: any;
  numberOfSavedQueries$: Observable<number>;

  constructor(private searchState: Store<fromSearch.State>) {
    this.savedQueries$ = searchState.pipe(select(fromSearch.getAllSavedQueries));
    searchState.pipe(select(fromSearch.getSavedQueryEntities)).subscribe(entities => this.savedQueryEntities = entities);
    this.numberOfSavedQueries$ = searchState.pipe(select(fromSearch.getSavedQueriesCount));
  }

  loadUserQuery(index: string) {
    const key = 'queryParams';
    const {[key]: value, ...formValues} = this.savedQueryEntities[index].query;
    this.searchState.dispatch(new fromFormActions.UpdateEntireForm(formValues));
  }

  deleteUserQuery(index: string) {
    this.searchState.dispatch(new fromSavedQueryActions.DeleteSavedQuery({id: index}));
  }

}
