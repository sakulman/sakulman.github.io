
export class ProjectDetails{
    title?: string;
    year?: string;
    longDescription?: string;
    displayImageUrl?: string;
    location?: string;
    images?: string[];

    toJson() {
        return {
            title: this.title ?? '',
            year: this.year ?? '',
            longDescription: this.longDescription ?? '',
            displayImageUrl: this.displayImageUrl ?? '',
            location: this.location ?? '',
            images: this.images ?? [],
        }
    }

    static fromJson(json: any): ProjectDetails { 
        const form = new ProjectDetails();
        form.title = json.title;
        form.year = json.year;
        form.longDescription = json.longDescription;
        form.displayImageUrl = json.displayImageUrl;
        form.location = json.location;
        form.images = json.images;
        return form;    
    }
}

