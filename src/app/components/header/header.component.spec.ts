import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {provideHttpClient} from "@angular/common/http";
import {HttpCardsService} from "../../shared/card/http-cards.service";
import {ApplicationMode} from "../../constants/ApplicationMode";

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let cardsService: HttpCardsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                provideHttpClient()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        cardsService = TestBed.inject(HttpCardsService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should correctly notify service to start game', () => {
        expect(component).toBeTruthy();
        const spy = jest.spyOn(cardsService, "notify")
        component.getCardsForDuel();
        expect(spy).toHaveBeenCalledWith(ApplicationMode.PEOPLE)
        component.starshipsMode = true;
        component.getCardsForDuel();
        expect(spy).toHaveBeenCalledWith(ApplicationMode.STARSHIPS)
    });
});
