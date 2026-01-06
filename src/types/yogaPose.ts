import type { DoshaType } from './dosha';

export interface YogaPose {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    doshaType: DoshaType;
    benefits: string[];
    imageUrl?: string;
}

export interface UserYogaPose extends YogaPose {
    isCustom: boolean;
    createdAt: string;
}
