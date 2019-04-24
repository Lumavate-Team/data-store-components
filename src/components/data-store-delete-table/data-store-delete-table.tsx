
import { Component, Prop, State, Element, Event, EventEmitter, Method } from '@stencil/core';
// import { MDCTextField } from '@material/textfield';
// import { MDCSelect } from '@material/select';

@Component({
  tag: 'data-store-delete-table',
  styleUrl: 'data-store-delete-table.scss',
  shadow: true
})
export class DeleteTable {

  tableId
  body
  containsDataEl
  deleteEl
  url = '/ic/data-store/manage/type/'
  parent

  @Element() el: HTMLElement

  @State() tableName

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema

  @Event({ eventName: 'delete', composed: true, bubbles: true, cancelable: false }) deleteSchemaEvent: EventEmitter

  @Method()
  getTableInfo(tableId, tableName) {
    this.tableId = tableId
    this.tableName = tableName
    this.deleteEl.style.display = 'flex'
    this.containsDataEl.style.display = 'none'
  }

  action() {
    this.deleteEl.style.display = 'none'
    this.containsDataEl.style.display = 'flex'
    this.containsDataEl.style.flexDirection = 'column'
    this.containsDataEl.style.justifyContent = 'center'
    this.containsDataEl.style.alignItems = 'center'

  }

  cancel() {
    this.el.style.display = 'none'
  }

  delete() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json"
    })

    return fetch(this.url + this.tableId, {
      headers: reqHeaders,
      method: 'delete'
    }).then(rsp => {
      return rsp
    }).then((r) => {
      if (r.status == 400) {
        this.action()
      } else {
        this.deleteSchemaEvent.emit()
        this.cancel()
      }
    }).catch((err) => {
      console.error('Failed to delete table', err);
    })
  }

  render() {
    return (
      <div id='parent' ref={(el) => this.parent = el as HTMLElement}>
        <div id='delete' ref={(el) => this.deleteEl = el as HTMLElement}>
          <div class='header'>
            Permanently delete table?
          </div>
          <div class='row'>
            <div class='inner-row'>
              <luma-button id='ds-cancel' text='Cancel' primary-color='#244862' onClick={() => this.cancel()}></luma-button>
            </div>
            <div class='inner-row'>
              <luma-button id='ds-delete' text='Delete' primary-color='#244862' onClick={() => this.delete()}></luma-button>
            </div>
          </div>
        </div>
        <div id='contains-data' ref={(el) => this.containsDataEl = el as HTMLElement}>
          <div class='header'>
            Unable to delete because table contains data.
          </div>
          To delete table, download and set "ACTION" to DELETE
          <div class='row-ok'>
            <luma-button id='ds-okay' text='Ok' primary-color='#244862' onClick={() => this.cancel()}></luma-button>
          </div>
        </div>
      </div>
    )
  }
}
