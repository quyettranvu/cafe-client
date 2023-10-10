import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { ProductComponent } from '../material-component/dialog/product/product.component';
import { ConfirmationComponent } from '../material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  displayedNameColumns: string[] = [
    'name',
    'categoryName',
    'description',
    'price',
    'edit',
  ];
  dataSource: any;
  responseMessage: any;
  constructor(
    private productService: ProductService,
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
    this.productService.getProducts().subscribe(
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

    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    //After event emit and call the dialog
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    //recall the table data -> api call get categories
    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
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

    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    //After event emit and call the dialog
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    //recall the table data -> api call get categories
    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' product',
      confirmation: true,
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    );
  }

  deleteProduct(id: any) {
    this.productService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
      }
    );
    this.snackbarService.openSnackBar(
      this.responseMessage,
      GlobalConstants.error
    );
  }

  onChange(status: any, id: any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id,
    };
    console.log('Data: ', data);

    this.productService.updateStatus(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
      }
    );
    this.snackbarService.openSnackBar(
      this.responseMessage,
      GlobalConstants.error
    );
  }
}
