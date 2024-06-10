import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardDetailComponent} from './card-detail.component';

describe('CardDetailComponent', () => {
    let component: CardDetailComponent;
    let fixture: ComponentFixture<CardDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardDetailComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CardDetailComponent);
        component = fixture.componentInstance;
    });

    it('should create and contain data', () => {
        component.detail = 'detail'
        component.label = 'label'
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.label).toEqual('label')
        expect(component.detail).toEqual('detail')
    });
});
