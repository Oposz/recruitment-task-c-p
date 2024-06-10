import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Person} from "../../constants/Person";
import {BehaviorSubject, EMPTY, expand, forkJoin, map, Observable, reduce, Subject, take} from "rxjs";
import {Starship} from "../../constants/Starship";
import {ApplicationMode} from "../../constants/ApplicationMode";
import {AllEntities, EntityId} from "../../constants/AllEntities";
import {getRandomElementFromArray} from "../../utils/RandomElement";
import {PrefetchState} from "../../constants/PrefetchState";

@Injectable({
    providedIn: 'root'
})
export class HttpCardsService {
    private getDataNotifier$: Subject<ApplicationMode> = new Subject();
    private peopleIds: string[] = [];
    private starshipsIds: string[] = [];
    private prefetched$: BehaviorSubject<number> = new BehaviorSubject(PrefetchState.NOT_STARTED);

    private static SWAPI_URL: string = 'https://www.swapi.tech/api'


    constructor(
        private readonly httpClient: HttpClient
    ) {
    }

    prefetchIds() {
        this.prefetched$.next(PrefetchState.IN_PROGRESS);
        forkJoin([
            this.prefetchedPeopleIds$(),
            this.prefetchedStarshipsIds$(),
        ]).subscribe({
            next: ([peopleIds, starshipsIds]) => {
                this.peopleIds = peopleIds;
                this.starshipsIds = starshipsIds
                this.prefetched$.next(PrefetchState.DONE);
            },
            error: () => {
                this.prefetched$.next(PrefetchState.FAILED)
            }
        })
    }

    selectNewPerson$(): Observable<Person> {
        return this.httpClient.get<Person>(`${HttpCardsService.SWAPI_URL}/people/${getRandomElementFromArray(this.peopleIds)}`)
            .pipe(
                take(1)
            )
    }

    selectNewStarship$(): Observable<Starship> {
        return this.httpClient.get<Starship>(`${HttpCardsService.SWAPI_URL}/starships/${getRandomElementFromArray(this.starshipsIds)}`)
            .pipe(
                take(1)
            )
    }

    notify(mode: ApplicationMode): void {
        this.getDataNotifier$.next(mode);
    }

    selectFetchData$(): Observable<ApplicationMode> {
        return this.getDataNotifier$.asObservable()
    }

    selectReadyForAction$(): Observable<number> {
        return this.prefetched$.asObservable()
    }

    private prefetchedPeopleIds$() {
        return this.httpClient.get<AllEntities>(`${HttpCardsService.SWAPI_URL}/people/`)
            .pipe(
                expand(people => people.next ? this.httpClient.get<AllEntities>(people.next) : EMPTY),
                reduce((acc: EntityId[], current: AllEntities) => acc.concat(current.results), []),
                map((data: EntityId[]) => data.map((person) => person.uid))
            )
    }

    private prefetchedStarshipsIds$() {
        return this.httpClient.get<AllEntities>(`${HttpCardsService.SWAPI_URL}/starships/`)
            .pipe(
                expand(people => people.next ? this.httpClient.get<AllEntities>(people.next) : EMPTY),
                reduce((acc: EntityId[], current: AllEntities) => acc.concat(current.results), []),
                map((data: EntityId[]) => data.map((person) => person.uid))
            )
    }
}
