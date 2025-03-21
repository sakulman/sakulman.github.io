import { HomeTileType } from "../enums/HomeTileType";
import { ModalFormTab } from "./ModalFormTab.ts";

export class HomeTileForm extends ModalFormTab{
    position: number = 0;
    title?: string;
    year?: string;
    description?: string;
    format?: HomeTileType;
    image?: File | null;
    imageUrl?: string;
    tabNumber = 0;


    toJson() {
        return {
            position: this.position ?? 0,
            title: this.title ?? '',
            year: this.year ?? '',
            description: this.description ?? '',
            format: this.format ?? '',
            imageUrl: this.imageUrl ?? '',
        }
    }

    static fromJson(json: any): HomeTileForm { 
        const form = new HomeTileForm();
        form.position = json.position;
        form.title = json.title;
        form.year = json.year;
        form.description = json.description;
        form.format = json.format;
        form.imageUrl = json.imageUrl;
        return form;    
    }
}

