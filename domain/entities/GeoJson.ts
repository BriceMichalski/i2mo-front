export interface GeoProperties {
    code: string
    zip: string
    name: string
}

export interface Stats {
    zip_code: string
    insee_code: string
    ads_count: number
    created_at: string
    m2: AttrStats
    area_count: AttrStats
    price: AttrStats
    price_m2: AttrStats
}

export interface AttrStats {
    count: number
    mean: number
    std: number
    min: number
    max: number
    p25: number
    p50: number
    p75: number
}

