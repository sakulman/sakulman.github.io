import { HomeTileType } from "../enums/HomeTileType";

export interface ModalTab{
    title: string;
    
}

export interface HomeTileForm extends ModalTab{
    year: string;
    description: string;
    format: HomeTileType;
    image: File | undefined;
    imageUrl: string;
    homeTileOrder: number | undefined;
 };