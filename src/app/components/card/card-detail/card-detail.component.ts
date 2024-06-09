import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-card-detail',
    standalone: true,
    imports: [],
    templateUrl: './card-detail.component.html',
    styleUrl: './card-detail.component.scss'
})
export class CardDetailComponent {
    @Input({required: true})
    detail!: string

    @Input({required: true})
    label!: string

}
