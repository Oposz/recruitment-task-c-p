import {StarshipDetails} from "./Starship";
import {PersonDetails} from "./Person";

export enum CardType {
    STARSHIP = 'starship',
    PERSON = 'person'
}

export type CardDetails = {
    type: CardType.STARSHIP
    data: StarshipDetails
    comparable: string
    winner: boolean
} | {
    type: CardType.PERSON
    data: PersonDetails
    comparable: string
    winner: boolean

}
