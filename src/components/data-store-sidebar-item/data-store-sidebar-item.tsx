
import { Component, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core';

@Component({
  tag: 'data-store-sidebar-item',
  styleUrl: 'data-store-sidebar-item.scss',
  shadow: true
})
export class DataStoreSidebarItem {

  @Prop() tableName
  @Prop() records

  currentTable = null
  tableItem: HTMLElement
  @Element() el: HTMLElement

  @Event({ eventName: 'table', composed: true, bubbles: true, cancelable: false }) tableEvent: EventEmitter
  @Event({ eventName: 'highlight', composed: true, bubbles: true, cancelable: false }) highlightEvent: EventEmitter

  tableDataHandler(tableRef) {
    this.highlight(tableRef)
    this.tableEvent.emit(tableRef)
  }

  @Listen('body:highlight')
  highlightListener(event) {
    this.highlight(event.detail)
  }

  highlight(tableName) {
    // debugger
    if (tableName != this.tableName) {
      this.tableItem.style.backgroundColor = '#f7f7f7'
    } else if (this.tableItem.style.backgroundColor != 'rgba(0, 0, 0, 0.3)') {
      this.tableItem.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
      this.highlightEvent.emit(tableName)
    }
  }

  render() {
    return (
      <div class='table-item' onClick={() => this.tableDataHandler(this.tableName)} ref={(el) => this.tableItem = el as HTMLElement} >
        <div class='table-name'>
          {this.tableName}</div>
        <div class='records'>{this.records} records</div>
      </div>
    )
  }
}