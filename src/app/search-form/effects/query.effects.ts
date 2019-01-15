import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as fromQueryActions from '../actions/query.actions';
import * as fromResultActions from '../actions/result.actions';
import * as fromFacetActions from '../actions/facet.actions';
import * as fromBasketResultActions from '../actions/basket-result.actions';
import {catchError, debounceTime, distinctUntilChanged, filter, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {BackendSearchService} from '../../shared/services/backend-search.service';
import {of} from "rxjs";
import {BasketResult} from "../models/basket-result.model";


@Injectable()
export class QueryEffects {

  @Effect()
  makeSearchRequest$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.MakeSearchRequest),
    debounceTime(750),
    distinctUntilChanged(),
    map((action: fromQueryActions.MakeSearchRequest) => action.payload),
    switchMap(query =>
      this.backendSearchService.getBackendDataComplex(query).pipe(
        map(result => new fromQueryActions.SearchSuccess(result)
        ),
        catchError(err => of(new fromQueryActions.SearchFailure(err)))
      )),
  );

  @Effect()
  searchSuccess$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.SearchSuccess),
    map((action: fromQueryActions.SearchSuccess) => action.payload.response),
    filter(x => x),
    flatMap(res => [
      new fromResultActions.ClearResults(),
      new fromResultActions.AddResults({results: res.docs}),
      new fromFacetActions.UpdateTotal(res.numFound),
      new fromFacetActions.UpdateFacetFields(res.facet_counts ? res.facet_counts.facet_fields : {}),
      new fromFacetActions.UpdateFacetRanges(res.facet_counts ? res.facet_counts.facet_ranges : {}),
      new fromFacetActions.UpdateFacetQueries(res.facet_counts ? res.facet_counts.facet_queries : {})
      ]
    ));

  @Effect()
  searchFailure$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.SearchFailure),
    map((action: fromQueryActions.SearchFailure) => action.payload),
    tap(err => console.log(err)),
    flatMap(() => [
      new fromResultActions.ClearResults(),
      new fromFacetActions.ResetAll(),
    ]),
  );

  @Effect()
  makeBasketRequest$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.MakeBasketSearchRequest),
    debounceTime(750),
    distinctUntilChanged(),
    map((action: fromQueryActions.MakeBasketSearchRequest) => action.payload),
    switchMap(query =>
      this.backendSearchService.getBackendDataBasket(query).pipe(
        map(result => new fromQueryActions.BasketSearchSuccess(result.response.docs)
        ),
        catchError(err => of(new fromQueryActions.BasketSearchFailure(err)))
      )),
  );

  @Effect()
  basketSearchSuccess$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.BasketSearchSuccess),
    map((action: fromQueryActions.BasketSearchSuccess) => action.payload),
    filter((x: BasketResult[]) => x.length > 0),
    flatMap(res => [
      new fromBasketResultActions.ClearBasketResults(),
      new fromBasketResultActions.AddBasketResults({basketResults: res})
    ]));

  @Effect()
  basketSearchFailure$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.BasketSearchFailure),
    map((action: fromQueryActions.BasketSearchFailure) => action.payload),
    tap(err => console.log(err)),
    flatMap(() => [
      new fromBasketResultActions.ClearBasketResults(),
    ]),
  );

  constructor(private actions$: Actions,
              private backendSearchService: BackendSearchService) {
  }
}
