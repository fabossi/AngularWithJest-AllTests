import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MainComponent } from "./main.component";
import { TodosService } from "../../services/todos.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TodoInterface } from "../../types/todo.interface";
import { TodoComponent } from "../todo/todo.component";
import { By } from "@angular/platform-browser";

// Shallow Testing

@Component({
    standalone: true,
    selector: 'app-todos-todo',
    template: ''
})
class TodoComponentMock {
    @Input({ required: true }) todo!: TodoInterface;
    @Input({ required: true }) isEditing!: boolean;
    @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();
}

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let todosService: TodosService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MainComponent, HttpClientTestingModule],
        })
            .overrideComponent(MainComponent, {
                remove: { imports: [TodoComponent] },
                add: { imports: [TodoComponentMock] }
            })
            .compileComponents();

        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        todosService = TestBed.inject(TodosService);
        fixture.detectChanges();
    });

    it('creates a component', () => {
        expect(component).toBeTruthy();
    });

    describe('component visibility', () => {
        it('should be hidden without todos', () => {
            const main = fixture.debugElement.query(
                By.css('[data-testid="main"]')
            )
            expect(main.classes['hidden']).toEqual(true);
        });

        it('should be visible with todos', () => {
            todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
            fixture.detectChanges();
            const main = fixture.debugElement.query(
                By.css('[data-testid="main"]')
            )
            expect(main.classes['hidden']).not.toBeDefined();
        })

        it('should highlight toggle all checkbox', () => {
            todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: true }]);
            fixture.detectChanges();
            const toggleAllElement = fixture.debugElement.query(By.css('[data-testid="toggleAll"]'));
            expect(toggleAllElement.nativeElement.checked).toEqual(true);
        })

        it('should toggle all todos', () => {
            jest.spyOn(todosService, 'toggleAll').mockImplementation(() => { });
            todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: true }]);
            fixture.detectChanges();
            const toggleAllElement = fixture.debugElement.query(By.css('[data-testid="toggleAll"]'));
            toggleAllElement.nativeElement.click();
            expect(todosService.toggleAll).toHaveBeenCalledWith(false);
        })

        it('should render list of todos', () => {
            todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
            fixture.detectChanges();
            const todos = fixture.debugElement.queryAll(By.css('[data-testid="todo"]'));
            expect(todos.length).toEqual(1);
            expect(todos[0].componentInstance.todo).toEqual({
                id: '1',
                text: 'foo',
                isCompleted: false
            });
            expect(todos[0].componentInstance.isEditing).toEqual(false);
        });

        it('should change editingId', () => {
            todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: true }]);
            fixture.detectChanges();
            const todos = fixture.debugElement.queryAll(By.css('[data-testid="todo"]'));
            todos[0].componentInstance.setEditingId.emit('1');
            expect(component.editingId).toEqual('1');
        })
    });
});