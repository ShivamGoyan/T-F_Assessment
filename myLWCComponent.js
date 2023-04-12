import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getRelatedListData from '@salesforce/apex/ControllerForAssessment.getRelatedListData';
import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

export default class MyLWCComponent extends NavigationMixin(LightningElement) {
    @api relatedListLabel;
    @api recordId;
    @api objectApiName;
    @api fieldApiNames;
    @api sortedBy;
    @api sortedDirection;
    data;
    @track columns = [{label: 'Name', fieldName: 'Name', sortable: true, type: 'action', typeAttributes: { rowActions: actions }}];
    wiredResult;
    fieldNames = 'Name';

    connectedCallback()
    {
        console.log('1-$recordid - ', this.recordId);
        console.log('1-$objectApiName - ', this.objectApiName);
        console.log('1-$fieldApiNames - ', this.fieldApiNames);
    }

    @wire(getRelatedListData, { objectApiName: '$objectApiName', fieldApiNames: '$fieldNames' })
    wiredRecords(result) {
        this.wiredResult = result;
        console.log('result - ',result);
        console.log('$objectApiName - ', this.objectApiName);
        console.log('$recordid - ', this.recordId);
        if (result.data) {
            this.data = result.data;
            //this.columns = this.prepareColumns(result.data, this.fieldNames);
        }
    }

    // prepareColumns(data, fieldApiNames) {
    //     let columns = [];
    //     fieldApiNames.split(',').forEach(field => {
    //         columns.push({ label: this.getLabel(data, field), fieldName: field, sortable: true });
    //     });
    //     columns.push({ type: 'action', typeAttributes: { rowActions: actions } });
    //     return columns;
    // }

    // getLabel(data, field) {
    //     const fieldName = field.split('.')[0];
    //     return data[0][fieldName].fieldApiName;
    // }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        console.log('1-row id - ',row.Id);
        console.log('1-row - ',row);
        console.log('1-action - ',action);
        switch (action.name) {
            case 'edit':
                this.handleEdit(row);
                break;
            case 'delete':
                this.handleDelete(row);
                break;
            default:
                break;
        }
    }

    handleNew() {
        console.log('new clicked');
        // Navigate to the new record page
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectApiName,
                actionName: 'new'
            }
        });
    }

    handleEdit(row) {
        // Navigate to the edit record page
        console.log('row= ',row.Id);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: this.objectApiName,
                actionName: 'edit'
            }
        });
    }

    handleDelete(row) {
        // Call the Apex method to delete the record
        deleteRecord(row.Id)
            .then(() => {
                this.showToast('Record deleted', 'Record has been deleted successfully.', 'success');
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.showToast('Error deleting record', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}
