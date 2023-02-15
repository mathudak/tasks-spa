import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/core/providers';

@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id?: string;
    isOpen = false;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        this.modalService.add(this);
        document.body.appendChild(this.element);

        this.element.addEventListener('click', (el: any) => {
            if (el.target.className === 'app-modal') {
                this.close();
            }
        });
    }

    open() {
        this.element.style.display = 'block';
        document.body.classList.add('app-modal-open');
        this.isOpen = true;
    }

    close() {
        this.element.style.display = 'none';
        document.body.classList.remove('app-modal-open');
        this.isOpen = false;
    }

    ngOnDestroy() {
        this.modalService.remove(this);
        this.element.remove();
    }
}