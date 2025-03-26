import { HomeTileType } from "../enums/HomeTileType";

export class Project{
    projectId?: string;
    title?: string;
    year?: number;
    date?: string;
    location?: string;
    summary?: string;
    longDescription?: string;
    displayImage?: string;
    images?: string[];
    format?: HomeTileType;
    url?: string;


    constructor(
        projectId: string,
        title: string,
        year: number,
        date: string,
        location: string,
        summary: string,
        longDescription: string,
        displayImage: string,
        images: string[],
        format: HomeTileType,
        url: string
    ){
        this.projectId = projectId;
        this.title = title;
        this.year = year;
        this.date = date;
        this.location = location;
        this.summary = summary;
        this.longDescription = longDescription;
        this.displayImage = displayImage;
        this.images = images;
        this.format = format;
        this.url = url;
    }

    toJson() {
        return {
            projectId: this.projectId || '',
            title: this.title || '',
            year: this.year || 0,
            date: this.date || '',
            location: this.location || '',
            summary: this.summary || '',
            longDescription: this.longDescription || '',
            displayImage: this.displayImage || '',
            images: this.images || [],
            format: this.format || '',
            url: this.url || ''
        }
    }

    static fromJson(json: any): Project{
        const newProj: Project = new Project(
            json.projectId,
            json.title,
            json.year,
            json.date,
            json.location,
            json.summary,
            json.longDescription,
            json.displayImage,
            json.images,
            json.format,
            json.url
        );
        return newProj;
    }
}