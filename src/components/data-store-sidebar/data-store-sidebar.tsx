
import { Component, Prop, Listen, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'data-store-sidebar',
  styleUrl: 'data-store-sidebar.scss',
  shadow: true
})
export class DataStoreSidebar {

  @Prop() temp: string
  url = '/ic/data-store/manage/type'
  @State() experienceTables = []
  @State() studioTables = []
  addTableTag
  initialLoad = true
  test = [1, 2, 3, 4, 5, 6, 7, 8]
  namespace

  @Event({ eventName: 'table', composed: true, bubbles: true, cancelable: false }) tableEvent: EventEmitter
  @Event({ eventName: 'highlight', composed: true, bubbles: true, cancelable: false }) highlightEvent: EventEmitter

  componentWillLoad() {
    this.updateSidebar()
  }


  addTable() {
    this.addTableTag.updateColumns()
    this.addTableTag.style.display = 'flex'
  }

  @Listen('body:update')
  updateListener(event: CustomEvent) {
    this.tableEvent.emit(event.detail)
    return this.updateSidebar(event.detail)
  }

  @Listen('body:delete')
  deleteListener() {
    this.updateSidebar().then(() => {
      let highlightTable = null
      // debugger
      if (this.experienceTables.length > 0) {
        highlightTable = this.experienceTables[0].name
        this.tableEvent.emit(highlightTable)
        this.updateSidebar(highlightTable)
      } else if (this.studioTables.length > 0) {
        highlightTable = this.studioTables[0].name
        this.tableEvent.emit(highlightTable)
        this.updateSidebar(highlightTable)
      } else {
        this.tableEvent.emit(null)
      }
    })
  }

  setCurrentSchema(tableName) {
    this.tableEvent.emit(tableName)

    setTimeout(() => {
      //need timeout due to lifecycle bug
      this.highlightEvent.emit(tableName)
    }, 50)

  }

  getAuthToken() {
    var cookies = document.cookie.split(";")
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i].split("=")
      if (cookie[0].trim() == "pwa_jwt") {
        return cookie[1].trim()
      }
    }
  }

  updateSidebar(tableName = null) {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.getAuthToken()
    })

    return fetch(this.url, {
      headers: reqHeaders
    }).then(rsp => {
      return rsp.json()
    }).then(data => {
      this.experienceTables = []
      this.studioTables = []
      this.namespace = data.payload.namespace
      data.payload.data.forEach((table) => {
        if (table.scope == 'experience') {
          this.experienceTables.push(table)
        } else {
          this.studioTables.push(table)
        }
      })
      if (this.initialLoad) {
        this.initialLoad = false
        if (this.experienceTables.length > 0) {
          this.setCurrentSchema(this.experienceTables[0].name)
          // this.highlightRow()
        } else if (this.studioTables.length > 0) {
          this.setCurrentSchema(this.studioTables[0].name)
        } else{
          this.tableEvent.emit(null)
        }
      } else {
        setTimeout(() => {
          //need timeout due to lifecycle bug
          this.highlightEvent.emit(tableName)
        }, 200)
      }
    }).catch((err) => {
      console.error('Could not load data', err);
    })
  }

  render() {
    if (this.namespace) {
      return (
        <div id='parent'>
          <div id='wrapper'>
            {this.experienceTables.length > 0
              ? <div class='table-wrapper'>
                <div class='header'>
                  <div class='left-pad' /> Experience
                </div>
                <div class='tables'>

                  {this.experienceTables.map((table) =>
                    <div>
                      <data-store-sidebar-item table-name={table.name} records={table.records}></data-store-sidebar-item>
                    </div>
                  )}
                </div>
              </div>
              : <div hidden />
            }
            {this.studioTables.length > 0
              ? <div class='table-wrapper'>
                <div class='header'>
                  <div class='left-pad' />Studio
                </div>
                <div class='tables'>
                  {this.studioTables.map((table) =>
                    <data-store-sidebar-item table-name={table.name} records={table.records}></data-store-sidebar-item>
                  )}
                </div>
              </div>
              : <div hidden />
            }
          </div>

          <div>
            <luma-button id='add-table' class='add-table' text='Add Table' primary-color='#244862' onClick={() => this.addTable()}></luma-button>
          </div>
          <data-store-add-schema ref={(el) => this.addTableTag = el as HTMLElement}></data-store-add-schema>
        </div>
      )
    } else {
      return (
        <div id='parent'>
          <div id='wrapper'>
            {this.studioTables.length > 0
              ? <div class='table-wrapper'>
                <div class='tables'>
                  {this.studioTables.map((table) =>
                    <data-store-sidebar-item table-name={table.name} records={table.records}></data-store-sidebar-item>
                  )}
                </div>
              </div>
              : <div hidden />
            }
          </div>
          <div>
            <luma-button id='add-table' class='add-table' text='Add Table' primary-color='#244862' onClick={() => this.addTable()}></luma-button>
          </div>
          <data-store-add-schema ref={(el) => this.addTableTag = el as HTMLElement}></data-store-add-schema>
        </div>
      )
    }
  }
}
