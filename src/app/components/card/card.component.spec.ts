import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardComponent} from './card.component';
import {CardDetails, CardType} from "../../constants/CardDetails";
import {PersonDetails, PersonProperties} from "../../constants/Person";
import {StarshipDetails, StarshipProperties} from "../../constants/Starship";

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;
    const mockData: CardDetails = {
        type: CardType.PERSON,
        data: {
            properties: {
                mass: '1',
                skin_color: 'white',
                name: 'name',
                height: '180',
                hair_color: 'brown',
                gender: 'male',
                eye_color: 'blue'
            } as PersonProperties
        } as PersonDetails,
        comparable: '1',
        winner: false
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        component.cardDetails = mockData;
        fixture.detectChanges();
    });

    it('should create with correct data', () => {
        expect(component).toBeTruthy();
        checkData(component);
    });

    it('should react on changes', () => {
        expect(component).toBeTruthy();
        checkData(component);
        component.cardDetails = {
            type: CardType.STARSHIP,
            winner: true,
            comparable: '0',
            data: {
                properties: {
                    crew: '2',
                    starship_class: 'class',
                    manufacturer: 'manufacturer',
                    cargo_capacity: '18',
                    created: '1',
                    length: '3',
                    max_atmosphering_speed: '200',
                    model: 'model',
                    passengers: '2020'
                } as StarshipProperties
            } as StarshipDetails,
        };
        fixture.detectChanges();
        expect(component.cardDetails.type).toEqual(CardType.STARSHIP);
        expect(component.cardDetails.winner).toEqual(true);
        expect(component.cardDetails.comparable).toEqual('0');
        expect(component.cardDetails.data.properties.model).toEqual('model');
    });
});

function checkData(component: CardComponent) {
    expect(component.cardDetails.type).toEqual(CardType.PERSON);
    expect(component.cardDetails.winner).toEqual(false);
    expect(component.cardDetails.comparable).toEqual('1');
    expect(component.cardDetails.data.properties.name).toEqual('name');
}
