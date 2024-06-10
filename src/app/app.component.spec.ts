import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {provideHttpClient} from "@angular/common/http";
import {HttpCardsService} from "./shared/card/http-cards.service";
import {ApplicationMode} from "./constants/ApplicationMode";
import {filter, of} from "rxjs";
import {PrefetchState} from "./constants/PrefetchState";
import {Person} from "./constants/Person";
import {Starship} from "./constants/Starship";

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let mockHttpCardsService: HttpCardsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideHttpClient()
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        mockHttpCardsService = TestBed.inject(HttpCardsService);
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should prefetch IDs on init', () => {
        const spy = jest.spyOn(mockHttpCardsService, 'prefetchIds')
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should observe for duel beginning', () => {
        const spy = jest.spyOn(mockHttpCardsService, 'selectFetchData$')
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should assign starship card details correctly', () => {
        const spy = jest.spyOn(mockHttpCardsService, 'selectNewStarship$')
        spy.mockReturnValue(of({
            result: {
                properties: {
                    crew: '0'
                }
            }
        } as Starship))

        component.ngOnInit();
        mockHttpCardsService.notify(ApplicationMode.STARSHIPS);

        expect(spy).toHaveBeenCalledTimes(2);
        expect(component.cardsDetails.length).toBe(2);
    });

    it('should assign people card details correctly', () => {
        const spy = jest.spyOn(mockHttpCardsService, 'selectNewPerson$')
        spy.mockReturnValue(of({
            result: {
                properties: {
                    mass: '0'
                }
            }
        } as Person))
        component.ngOnInit();
        mockHttpCardsService.notify(ApplicationMode.PEOPLE);

        expect(spy).toHaveBeenCalledTimes(2);
        expect(component.cardsDetails.length).toBe(2);
    });

    it('should update view after fetching', () => {
        expect(component).toBeTruthy();
        component.ngOnInit();

        component.appPrefetched$.pipe(
            filter((state) => state === PrefetchState.DONE)
        ).subscribe(() => {
            expect(component.loader).toBeFalsy();
        })
    });

    it('should determine duel winner correctly', () => {
        const spy = jest.spyOn(mockHttpCardsService, 'selectNewStarship$')

        spy.mockReturnValue(of({result: {properties: {crew: '2'}}} as Starship))
        spy.mockReturnValueOnce(of({result: {properties: {crew: '0'}}} as Starship))

        component.ngOnInit();
        mockHttpCardsService.notify(ApplicationMode.STARSHIPS);

        expect(component.cardsDetails[1].winner).toBeTruthy();
    });


    it('should handle a draw correctly', () => {
        const spy = jest.spyOn(mockHttpCardsService, 'selectNewStarship$')

        spy.mockReturnValue(of({result: {properties: {crew: '2'}}} as Starship))

        component.ngOnInit();
        mockHttpCardsService.notify(ApplicationMode.STARSHIPS);

        expect(component.cardsDetails[1].winner).toBeTruthy();
        expect(component.cardsDetails[0].winner).toBeTruthy();
    });
});
