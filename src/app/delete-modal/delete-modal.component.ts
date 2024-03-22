import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeleteService } from '../services/delete.service';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrl: './delete-modal.component.css'
})

export class DeleteModalComponent implements OnInit {

    @Input() url: any;
    @Output() isDeleting = new EventEmitter();

    constructor(private deleteservice: DeleteService) { }

    ngOnInit(): void {}

    delete() {
        this.deleteservice.customDeleteFunction(this.url).subscribe(
            (data) => {
                this.isDeleting.emit(false);
            }
        )
    }

    cancel() {
        this.isDeleting.emit(false);
    }

}
