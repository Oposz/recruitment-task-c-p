import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {AsyncPipe, NgTemplateOutlet, UpperCasePipe} from "@angular/common";
import {CardDetails, CardType} from "../../constants/CardDetails";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CardDetailComponent} from "./card-detail/card-detail.component";
import {CounterComponent} from "../counter/counter.component";
import {MatBadgeModule} from '@angular/material/badge';


@Component({
    selector: 'app-card',
    standalone: true,
    imports: [
        AsyncPipe,
        MatCardModule,
        MatProgressSpinnerModule,
        CardDetailComponent,
        NgTemplateOutlet,
        CounterComponent,
        MatBadgeModule,
        UpperCasePipe
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
    @Input({required: true})
    cardDetails!: CardDetails

    protected readonly CardType = CardType;

    constructor() {
    }

}
