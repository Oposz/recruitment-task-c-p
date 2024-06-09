export interface Starship {
    message: string
    result: StarshipDetails
}

export interface StarshipDetails {
    properties: StarshipProperties
    description: string
    _id: string
    uid: string
    __v: number
}

export interface StarshipProperties {
    model: string
    starship_class: string
    manufacturer: string
    cost_in_credits: string
    length: string
    crew: string
    passengers: string
    max_atmosphering_speed: string
    hyperdrive_rating: string
    MGLT: string
    cargo_capacity: string
    consumables: string
    pilots: any[]
    created: string
    edited: string
    name: string
    url: string
}
