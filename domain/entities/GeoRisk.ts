export interface RiskResponse {
    results: number
    page: number
    total_pages: number
    data: RiskData[]
    response_code: number
    message: any
    next: any
    previous: any
}

export interface RiskData {
    risques_detail: RiskDetail[]
    code_insee: string
    libelle_commune: string
}

export interface RiskDetail {
    num_risque: string
    libelle_risque_long: string
    zone_sismicite: any
}