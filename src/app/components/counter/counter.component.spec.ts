import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CounterComponent} from './counter.component';
import {CounterService} from "../../shared/counter/counter.service";

describe('CounterComponent', () => {
    let component: CounterComponent;
    let fixture: ComponentFixture<CounterComponent>;
    let counterService: CounterService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CounterComponent],
            providers: [CounterService]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CounterComponent);
        component = fixture.componentInstance;
        counterService = new CounterService();
        fixture.detectChanges();
    });

    it('should create with initial data', () => {
        expect(component).toBeTruthy();
        component.leftCounter.subscribe((data) => {
            expect(data).toEqual(0)
        })
    });

    it('should react on changes in counterService', () => {
        expect(component).toBeTruthy();
        counterService.draw();
        component.leftCounter.subscribe((data) => {
            expect(data).toEqual(1);
        })
        component.rightCounter.subscribe((data) => {
            expect(data).toEqual(1);
        })
    });
});
