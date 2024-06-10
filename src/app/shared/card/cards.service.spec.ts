import {TestBed} from '@angular/core/testing';

import {HttpCardsService} from './http-cards.service';
import {provideHttpClient} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {PrefetchState} from "../../constants/PrefetchState";
import {AllEntities} from "../../constants/AllEntities";
import {ApplicationMode} from "../../constants/ApplicationMode";

describe('CardsServiceService', () => {
    let service: HttpCardsService;
    let httpMock: HttpTestingController;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(HttpCardsService);
        httpMock = TestBed.inject(HttpTestingController);

    });

    it('should be created ', () => {
        expect(service).toBeTruthy();
    });

    it('should prefetch IDs successfully', () => {
        const mockIds: AllEntities = {
            results: [{uid: '1', name: '', url: ''}],
            next: ''
        } as AllEntities;
        service.prefetchIds();

        const reqPeople = httpMock.expectOne('https://www.swapi.tech/api/people/');
        const reqStarships = httpMock.expectOne('https://www.swapi.tech/api/starships/');

        reqPeople.flush(mockIds);
        reqStarships.flush(mockIds);

        expect(service['peopleIds']).toEqual(['1']);
        expect(service['starshipsIds']).toEqual(['1']);
        expect(service.selectReadyForAction$().subscribe(state => {
            expect(state).toBe(PrefetchState.DONE);
        }));
    });

    it('should handle prefetch IDs error', () => {
        service.prefetchIds();

        const reqPeople = httpMock.expectOne('https://www.swapi.tech/api/people/');
        const mockErrorResponse = {status: 404, statusText: 'Not found'};

        reqPeople.flush(mockErrorResponse);

        expect(service.selectReadyForAction$().subscribe(state => {
            expect(state).toBe(PrefetchState.FAILED);
        }));
    });

    it('should notify and handle application mode', () => {
        const mockMode: ApplicationMode = ApplicationMode.STARSHIPS;

        service.notify(mockMode);

        service.selectFetchData$().subscribe(mode => {
            expect(mode).toBe(mockMode);
        });
    });
});
