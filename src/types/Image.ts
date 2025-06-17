export class ProjectImageList{
    public projectId: number | undefined;
    public images: ProjectImage[];
}


export class ProjectImage{

    // constructor(Id: number, projectId: number, position: number, Url: string){
    //     this.Id = Id,
    //     this.projectId = projectId,
    //     this.position = position,
    //     this.Url = Url
    // }

    public Id: number;
    public projectId: number;
    public position: number;
    public Url: string;

}