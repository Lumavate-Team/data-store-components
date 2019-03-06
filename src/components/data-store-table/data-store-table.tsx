
import { Component, Prop} from '@stencil/core';

@Component({
  tag: 'data-store-table',
  styleUrl: 'data-store-table.scss',
  shadow: true
})
export class DataStoreTable{

  @Prop() temp:string

	render(){
		return (
      <div>
        table
      </div>
    )
	}



}
