export class TaskEntity {
    public id: number;
    public content: string;
    public completed: boolean;

    constructor(id: number, content: string, completed:boolean = false) {
        this.id = id;
        this.content = content;
        this.completed = completed;
    }
}