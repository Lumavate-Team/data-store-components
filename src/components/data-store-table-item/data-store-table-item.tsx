
import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'data-store-table-item',
  styleUrl: 'data-store-table-item.scss',
  shadow: true
})
export class DataStoreTableItem {

  @Prop() row: any
  @Prop() header: boolean = false

  render() {
    if (this.header) {
      return (
        <div id='parent' class='header'>
          <div class='spacer'></div>
          <div class='row-item' >{this.row['columnName']}</div>
          <div class='row-item' >{this.row['type']}</div>
          <div class='row-item' >{this.row['devName']}</div>
          <div class='row-item' >{this.row['options']}</div>
          <div class='row-item' >{this.row['active']}</div>
          <div class='spacer'></div>
        </div>
      )
    }
    else {
      return (
        <div id='parent'>
          <div class='spacer'></div>
          <div class='row-item' >{this.row['columnName']}</div>
          <div class='row-item' >{this.row['type']}</div>
          <div class='row-item' >{this.row['devName']}</div>
          <div class='row-item options' >{this.row['options']}</div>
          {this.row['active']
            ? <div class='row-item' >Active</div>
            : <div class='row-item' >Inactive</div> }
          <div class='spacer'></div>
        </div>
      )
    }
  }
}
