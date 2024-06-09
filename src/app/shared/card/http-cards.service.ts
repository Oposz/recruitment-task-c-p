import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Person} from "../../constants/Person";
import {BehaviorSubject, EMPTY, expand, forkJoin, map, Observable, reduce, Subject, take} from "rxjs";
import {Starship} from "../../constants/Starship";
import {ApplicationMode} from "../../constants/ApplicationMode";
import {AllEntities, EntityId} from "../../constants/AllEntities";
import {getRandomElementFromArray} from "../../utils/RandomElement";

@Injectable({
    providedIn: 'root'
})
export class HttpCardsService {
    private getDataNotifier$: Subject<ApplicationMode> = new Subject();
    private peopleIds: string[] = ['1', '2'];
    private starshipsIds: string[] = ['2', '17']
    private prefetched$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private static SWAPI_URL: string = 'https://www.swapi.tech/api'


    constructor(
        private readonly httpClient: HttpClient
    ) {
    }

    prefetchIds() {
        forkJoin([
            this.prefetchedPeopleIds$(),
            this.prefetchedStarshipsIds$(),
        ]).subscribe(([peopleIds, starshipsIds]) => {
            this.peopleIds = peopleIds;
            this.starshipsIds = starshipsIds
            this.prefetched$.next(true);
        })
    }

    getNewPerson$(): Observable<Person> {
        if (!this.prefetched$.value) {
            this.prefetchIds();
        }
        return this.httpClient.get<Person>(`${HttpCardsService.SWAPI_URL}/people/${getRandomElementFromArray(this.peopleIds)}`)
            .pipe(
                take(1)
            )
    }

    getNewStarship$(): Observable<Starship> {
        if (!this.prefetched$.value) {
            this.prefetchIds();
        }
        return this.httpClient.get<Starship>(`${HttpCardsService.SWAPI_URL}/starships/${getRandomElementFromArray(this.starshipsIds)}`)
            .pipe(
                take(1)
            )
    }

    notify(mode: ApplicationMode): void {
        this.getDataNotifier$.next(mode);
    }

    observeFetchData$(): Observable<ApplicationMode> {
        return this.getDataNotifier$.asObservable()
    }

    observeReadyForAction$(): Observable<boolean> {
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
