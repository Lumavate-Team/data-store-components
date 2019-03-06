
import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'data-store-header',
  styleUrl: 'data-store-header.scss',
  shadow: true
})
export class DataStoreHeader {

  @Prop() temp: string

  render() {
    return (
      <div id='header-row'>
        <div id='left'>
          <div id='table-name'>Table Name</div>
          <div id='left-row'>
            <div class='text'>Attributes</div>
            <div class='text'>-</div>
            <div class='text'>/ic/users</div>
          </div>
        </div>
        <div id='right'>
          <div id='right-row'>
            <div id='spacer'></div>
            <div id='nested-row'>
              <div id='edit'>edit</div>
              <div id='delete'>delete</div>
              <div id='button'>Import/Export XLS</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
