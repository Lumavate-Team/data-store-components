
import { Component, Prop, State, Element, Event, EventEmitter, Method } from '@stencil/core';
// import { MDCTextField } from '@material/textfield';
// import { MDCSelect } from '@material/select';

@Component({
  tag: 'data-store-delete-table',
  styleUrl: 'data-store-delete-table.scss',
  shadow: true
})
export class DeleteTable {

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema
  url = '/ic/data-store-admin-ui/manage/type/'
  @Element() el: HTMLElement
  parent
  @State() tableName
  tableId
  @Event({ eventName: 'addSchema', composed: true, bubbles: true, cancelable: false }) addSchemaEvent: EventEmitter

  @Method()
  getTableInfo(tableId, tableName) {
    this.tableId = tableId
    this.tableName = tableName
  }

  cancel() {
    this.el.style.display = 'none'
  }

  delete() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json"
    })

      return fetch(this.url +this.tableId, {
        headers: reqHeaders,
        method: 'delete'
      }).then(rsp => {
        return rsp.json()
      }).then(() => {
        this.cancel()
      }).catch((err) => {
        console.error('Failed to delete table', err);
      })
  }

  render() {
    return (
      <div id='parent' ref={(el) => this.parent = el as HTMLElement}>
        Permanently delete table?
        <div class='row'>
          <button class='button' onClick={() => this.cancel()}>Cancel</button>
          <button class='button' onClick={() => this.delete()}>Delete</button>
        </div>
      </div>
    )
  }
}
