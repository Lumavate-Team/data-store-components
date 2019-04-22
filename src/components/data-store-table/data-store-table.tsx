
import { Component, Prop, Listen, State } from '@stencil/core';


@Component({
  tag: 'data-store-table',
  styleUrl: 'data-store-table.scss',
  shadow: true
})
export class DataStoreTable {

  @Prop() temp: string
  url = '/ic/data-store/manage/'
  header = { 'columnName': 'Column', 'type': 'Type', 'devName': 'Dev Name', 'options': 'Options', 'Header': true }
  @State() tableData = []
  editTableTag
  deleteTableTag
  fileUtilTag
  tableName = ''
  tableId
  scope
  namespace

  getAuthToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i].split("=");
      if (cookie[0].trim() == "pwa_jwt") {
        return cookie[1].trim();
      }
    }
  }

  componentWillLoad() {
    let urlParams = new URLSearchParams(window.location.search)
    // urlParams.set('namespace', '1234')
    this.namespace = urlParams.get('namespace')
  }

  @Listen('body:table')
  getTableHandler(event: CustomEvent) {
    this.tableName = event.detail
    if (this.tableName != null) {
      let reqHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.getAuthToken()
      })
      return fetch(this.url + event.detail + '/schema?expand=type', {
        headers: reqHeaders
      }).then(rsp => {
        return rsp.json()
      }).then(data => {
        this.tableId = data.payload.data.type_id
        this.tableData = data.payload.data.columns
        this.scope = data.payload.data.expand.type.scope
        console.log(this.scope)
      }).catch((err) => {
        console.error('Could not load data', err);
      })
    } else {
      this.tableName = ''
      this.tableData = []
    }
  }

  openFileUtilModal() {
    this.fileUtilTag.openFileUtil(this.tableName, this.url)
    this.fileUtilTag.style.display = 'flex'
  }

  editSchema() {
    let test = this.tableData
    // let cloneTableData  = Object.assign([], this.tableData);
    this.editTableTag.updateColumns(this.tableName, test)
    this.editTableTag.style.display = 'flex'
  }

  deleteTable() {
    this.deleteTableTag.getTableInfo(this.tableId, this.tableName)
    this.deleteTableTag.style.display = 'flex'
  }

  render() {
    if (this.tableName == '') {
      return (
        <div>
          No Table(s) Placeholder
        </div>
      )
    }
    else {
      if (this.namespace) {
        return (
          <div id='parent'>
            <div id='header-row'>
              <div id='left'>
                <div id='table-name'>{this.tableName}</div>
                <div id='left-row'>
                  {this.tableData.length == 1
                    ? <div class='text'>{this.tableData.length} Attribute</div>
                    : <div class='text'>{this.tableData.length} Attributes</div>
                  }
                  <div class='text dash'> -</div>
                  <div class='text'>/ic/{this.tableName}</div>
                </div>
              </div>
              <div id='right'>
                <div id='right-row'>
                  <div id='spacer'></div>
                  {this.scope == 'experience'
                    ? <div id='nested-row'>
                      <i class='material-icons' id='edit' onClick={() => this.editSchema()}>edit</i>
                      <i class='material-icons' id='delete' onClick={() => this.deleteTable()}>delete</i>
                      <div>
                        <luma-button id='import-export' text='Export/Import' primary-color='#244862' onClick={() => this.openFileUtilModal()}></luma-button>
                      </div>
                    </div>
                    : <div id='nested-row-studio'>
                      <div>
                        <luma-button id='import-export' text='Export/Import' primary-color='#244862' onClick={() => this.openFileUtilModal()}></luma-button>
                      </div>
                    </div>
                  }
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
      } else {
        return (
          <div id='parent'>
            <div id='header-row'>
              <div id='left'>
                <div id='table-name'>{this.tableName}</div>
                <div id='left-row'>
                  {this.tableData.length == 1
                    ? <div class='text'>{this.tableData.length} Attribute</div>
                    : <div class='text'>{this.tableData.length} Attributes</div>
                  }
                  <div class='text dash'> -</div>
                  <div class='text'>/ic/{this.tableName}</div>
                </div>
              </div>
              <div id='right'>
                <div id='right-row'>
                  <div id='spacer'></div>
                  <div id='nested-row'>
                    <i class='material-icons' id='edit' onClick={() => this.editSchema()}>edit</i>
                    <i class='material-icons' id='delete' onClick={() => this.deleteTable()}>delete</i>
                    <div>
                      <luma-button id='import-export' text='Export/Import' primary-color='#244862' onClick={() => this.openFileUtilModal()}></luma-button>
                    </div>
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
  }
}