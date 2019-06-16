import { Component, OnInit, ViewChild } from '@angular/core';
import { IMis } from '../_models/IMis';
import { MisService } from '../_services/mis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private misService: MisService, private http: HttpClient, private userService: UserService, private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }
  model: IMis;
  editMode: Boolean = false;
  currentUser;
  allMISData: IMis[];
  @ViewChild(DataTableDirective)

  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngOnInit() {

    this.currentUser = this.userService.currentUser;

    this.model = { name: '', createdBy: this.currentUser._id, fname: '', mobile: 0, email: '', address: '' }
    this.getMisRecords();

  }
  getMisRecords = () => {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      serverSide: true,
      searching: false,
      processing: true,
      autoWidth: false,
      language: {
        processing: '<i class="fa fa-spinner fa-spin fa-fw text-primary"></i><span class="sr-only">Loading...</span>'
      },
      ajax: (dataTablesParameters: any, callback) => {
        that.misService.getData(this.currentUser._id, dataTablesParameters).subscribe(resp => {
          that.allMISData = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [{ data: 'name', width: '15%' }, { data: 'fname', width: '15%' }, { data: 'address', width: '20%' },
      { data: 'email', width: '10%' },
      { data: 'mobile', width: '10%' }, { data: '', orderable: false }]
    };
  }
  saveRecord = () => {
    this.openSpinner();
    this.misService.saveData(this.model).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success(apiResponse.message);
          // this.getMisRecords();
          this.rerender();
          this.model = { name: '', fname: '', mobile: 0, email: '', address: '', createdBy: '' }
        }
        else
          this.toastr.error(apiResponse.message);
      }, (error) => {
        this.toastr.error(error.message);
      }, () => {
        this.openSpinner(false)
      }
    );
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  edit = (data) => {
    this.model = data;
    this.editMode = true;
  }
  delete = (data) => {
    if (confirm('Do you really want to delete this data?')) {

      this.openSpinner();
      this.misService.deleteData(data.misId).subscribe((apiResponse) => {
        if (apiResponse.status === 202) {
          this.toastr.warning('Not deleted')
        } else {
          this.toastr.success(apiResponse.message);
          // this.allMISData = this.allMISData.filter(x => x.misId !== data.misId);
          this.rerender();
        }

      }, (error) => {
        this.toastr.error(error.message);
      }, () => {
        this.openSpinner(false);
      });
    }
  }
  updateData = () => {
    this.openSpinner();
    this.misService.edit(this.model).subscribe((apiResponse) => {
      if (apiResponse.status === 202) {
        this.toastr.warning('Not updated')
      } else {
        this.model = { name: '', fname: '', mobile: 0, email: '', address: '', createdBy: '' }
        this.toastr.success(apiResponse.message);
        this.editMode=false;
        // this.allMISData = this.allMISData.filter(x => x.misId !== data.misId);
        this.rerender();
      }

    }, (error) => {
      this.toastr.error(error.message);
    }, () => {
      this.openSpinner(false);
    })
  }
  cancel = () => {
    this.model = { name: '', fname: '', mobile: 0, email: '', address: '', createdBy: '' }
    this.editMode = false;
    this.rerender();
  }
  openSpinner = (isLoading: boolean = true) => {
    isLoading ? this.spinner.show() : this.spinner.hide();
  };//end of openSpinner function
}
