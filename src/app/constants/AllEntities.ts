export interface AllEntities {
    message: string
    total_records: number
    total_pages: number
    previous: any
    next: string
    results: EntityId[]
}

export interface EntityId {
    uid: string
    name: string
    url: string
}
