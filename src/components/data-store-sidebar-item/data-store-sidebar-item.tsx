
import { Component, Prop, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'data-store-sidebar-item',
  styleUrl: 'data-store-sidebar-item.scss',
  shadow: true
})
export class DataStoreSidebarItem {

  @Prop() header: string
  @Prop() tables = []
  currentTable = null

  el!: HTMLElement
  headerEl!: HTMLElement

  @Event({eventName:'table',composed:true, bubbles:true, cancelable:false})tableEvent: EventEmitter

  tableDataHandler(tableRef){
    
    this.tableEvent.emit(tableRef)
  }

  render() {
    return (
      <div id='parent' ref={(el) => this.el = el as HTMLElement}>
        <div class='header' ref={(el) => this.headerEl = el as HTMLElement}>
          {this.header}
        </div>
        <div class='table'>
          {this.tables.map((table) =>
            <div class='table-item' onClick={() => this.tableDataHandler(table.name)}>
              <div class='table-name'>
              {table.name}</div>
              <div class='records'>{table.records} records</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}