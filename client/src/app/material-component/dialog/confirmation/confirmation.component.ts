import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  onEmitStatusChange = new EventEmitter();
  details: any = {};

  //this will allow dialog component to accept this data
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.confirmation) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }
}
