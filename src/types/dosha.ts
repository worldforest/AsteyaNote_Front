export type DoshaType = 'vata' | 'pitta' | 'kapha';

export interface DoshaQuestion {
    id: number;
    text: string;
    type: DoshaType;
}

export interface DoshaResult {
    vata: number;
    pitta: number;
    kapha: number;
    dominant: DoshaType;
}
