
import { Component, Prop, Listen, State } from '@stencil/core';


@Component({
  tag: 'data-store-table',
  styleUrl: 'data-store-table.scss',
  shadow: true
})
export class DataStoreTable {

  @Prop() temp: string
  url = '/ic/data-store-admin-ui/manage/'
  header = { 'columnName': 'Column', 'type': 'Type', 'devName': 'Dev Name', 'options': 'Options', 'Header': true }
  @State() tableData = []
  editTableTag
  deleteTableTag
  fileUtilTag
  tableName
  tableId

  getAuthToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i].split("=");
      if (cookie[0].trim() == "pwa_jwt") {
        return cookie[1].trim();
      }
    }
  }

  @Listen('body:table')
  getTableHandler(event: CustomEvent) {
    this.tableName = event.detail
      let reqHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.getAuthToken()
      })
      fetch(this.url + event.detail + '/schema', {
        headers: reqHeaders
      }).then(rsp => {
        return rsp.json()
      }).then(data => {
        this.tableId = data.payload.data.type_id
        this.tableData = data.payload.data.columns
      }).catch((err) => {
        console.error('Could not load data', err);
      })
  };

  openFileUtilModal() {
    console.log(this.fileUtilTag)
    this.fileUtilTag.openFileUtil(this.tableName, this.url)
    this.fileUtilTag.style.display = 'flex'
  }

  editSchema() {
    this.editTableTag.updateColumns(this.tableName, this.tableData)
    this.editTableTag.style.display = 'flex'
  }

  deleteTable() {
    this.deleteTableTag.getTableInfo(this.tableId, this.tableName)
    this.deleteTableTag.style.display = 'flex'
  }

  render() {
    return (
      <div id='parent'>
        <div id='header-row'>
          <div id='left'>
            <div id='table-name'>{this.tableName}</div>
            <div id='left-row'>
              <div class='text'>{this.tableData.length} Attributes</div>
              <div class='text'> -</div>
              <div class='text'>/ic/{this.tableName}</div>
            </div>
          </div>
          <div id='right'>
            <div id='right-row'>
              <div id='spacer'></div>
              <div id='nested-row'>
                <i class='material-icons' id='edit' onClick={() => this.editSchema()}>edit</i>
                <i class='material-icons' id='delete' onClick={() => this.deleteTable()}>delete</i>
                <luma-button id='import-export' text='Export/Import' primary-color='#244862' onClick={() => this.openFileUtilModal()}></luma-button>
              </div>
            </div>
          </div>
        </div>
        <div id='table'>
          <data-store-table-item row={this.header} header={this.header['Header']}></data-store-table-item>
          {this.tableData.map((row) =>

            <data-store-table-item row={row} >
            </data-store-table-item>
          )}
        </div>

        <data-store-file-util ref={(el) => this.fileUtilTag = el as HTMLElement}></data-store-file-util>
        <data-store-delete-table ref={(el) => this.deleteTableTag = el as HTMLElement}></data-store-delete-table>
        <data-store-edit-schema ref={(el) => this.editTableTag = el as HTMLElement}></data-store-edit-schema>
      </div>
    )
  }
}