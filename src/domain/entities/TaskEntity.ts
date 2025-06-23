export class TaskEntity {
    public id: number;
    public content: string;

    constructor(id: number, content: string) {
        this.id = id;
        this.content = content;
    }
}