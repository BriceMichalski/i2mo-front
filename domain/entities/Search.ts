export interface GeoSearchResult {
    label: string
    value: string
    city: string
    postcode: string
    context: string
    geometry: Geometry
}

export interface GeoJsonItem {
    type: string
    geometry: Geometry
    properties: GeoSearchProperties
}

export interface Geometry {
    type: string
    coordinates: number[]
}

export interface GeoSearchProperties {
    label: string
    score: number
    id: string
    type: string
    name: string
    postcode: string
    citycode: string
    x: number
    y: number
    population: number
    city: string
    context: string
    importance: number
    municipality: string
}