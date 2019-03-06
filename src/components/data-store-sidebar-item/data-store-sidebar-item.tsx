
import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'data-store-sidebar-item',
  styleUrl: 'data-store-sidebar-item.scss',
  shadow: true
})
export class DataStoreSidebarItem {

  @Prop() header: string
  @Prop() tables = [
    { 'name': 'Comicbooks', 'records': 25 },
    { 'name': 'Movies', 'records': 100 },
    { 'name': 'Mobile Homes', 'records': 75 },
    { 'name': 'Reports', 'records': 50 },
  ]

  el!: HTMLElement
  headerEl!: HTMLElement


  render() {
    return (
      <div ref={(el) => this.el = el as HTMLElement}>
        <div class='header' ref={(el) => this.headerEl = el as HTMLElement}>
          {this.header}
        </div>
        <div class='table'>
          {this.tables.map((table) =>
            <div class='table-item'>
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
