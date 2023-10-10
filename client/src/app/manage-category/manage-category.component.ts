import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { CategoryComponent } from '../material-component/dialog/category/category.component';
import { __values } from 'tslib';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss'],
})
export class ManageCategoryComponent implements OnInit {
  displayedNameColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); //remove white space and MatTableDataSource defaults to lowercase matches
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    //After event emit and call the dialog
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    //recall the table data -> api call get categories
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };

    dialogConfig.width = '850px';

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    //After event emit and call the dialog
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    //recall the table data -> api call get categories
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }
}
