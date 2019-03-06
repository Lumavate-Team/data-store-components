
import { Component, Prop} from '@stencil/core';

@Component({
  tag: 'data-store-sidebar',
  styleUrl: 'data-store-sidebar.scss',
  shadow: true
})
export class DataStoreSidebar{

  @Prop() temp:string

	render(){
		return (
      <div>
        <data-store-sidebar-item header='Experience'></data-store-sidebar-item>
        <data-store-sidebar-item header='Studio'></data-store-sidebar-item>
        <div class='add-table'>(+) Add Table</div>
      </div>
    )
	}



}
