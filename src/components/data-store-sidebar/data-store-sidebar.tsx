
import { Component, Prop, Listen, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'data-store-sidebar',
  styleUrl: 'data-store-sidebar.scss',
  shadow: true
})
export class DataStoreSidebar {

  @Prop() temp: string
  url = 'http://localhost:5005/ic/data-store/type'
  @State() experienceTables = []
  @State() studioTables = []
  addTableTag
  experienceRepeater
  studioRepeater
  initialLoad = true

  @Event({ eventName: 'table', composed: true, bubbles: true, cancelable: false }) tableEvent: EventEmitter

  componentWillLoad() {
    // console.log('willLoad')
    this.updateSidebar()
  }

  componentWillUpdate() {
    // console.log('WillUpdate')
    this.studioRepeater.setData(this.studioTables)
    this.experienceRepeater.setData(this.experienceTables)
  }


  componentDidLoad() {
    // console.log('didLoad')
    let self = this
    let promises = [];
    promises.push(self.experienceRepeater.componentOnReady());
    promises.push(self.studioRepeater.componentOnReady());
    Promise.all(promises).then((_) => {
      // console.log('inside Promise All')
      if (self.experienceTables.length > 0) {
        self.experienceRepeater.setData(self.experienceTables)
      }
      self.studioRepeater.setData(self.studioTables)

      // if (self.initialLoad) {
      //   self.initialLoad = false
      //   if (self.experienceTables.length > 0) {
      //     self.highlightRow(self.experienceTables[0].name)
      //   } else {
      //     self.highlightRow(self.studioTables[0].name)
      //   }
      // }
    })
  }


@Listen('onRowPress')
onPressListener(event) {
  let repeater = event.path[0]
  let clickRow = event.detail.element
  let repeaterId = repeater.id
  if (repeaterId != 'add-schema-repeater') {
    this.setCurrentSchema(event.detail.data.name)
    this.experienceTables.map((_, index) => {
      this.experienceRepeater.getItem(index).then((rsp) => {
        let row = rsp.rowEl[0].parentElement.parentElement
        row.style.backgroundColor = 'white'
        if (repeaterId == 'experience-tables') {
          if (clickRow == row) {
            clickRow.style.backgroundColor = '#E1E1E1'
          }
        }
      })
      this.studioTables.map((_, index) => {
        this.studioRepeater.getItem(index).then((rsp) => {
          let row = rsp.rowEl[0].parentElement.parentElement
          row.style.backgroundColor = 'white'
          if (repeaterId == 'studio-tables') {
            if (clickRow == row) {
              clickRow.style.backgroundColor = '#E1E1E1'
            }
          }
        })
      })
    })
  }
}

addTable() {
  this.addTableTag.updateColumns()
  this.addTableTag.style.display = 'flex'
}

@Listen('body:update')
updateListener(event: CustomEvent) {
  this.tableEvent.emit(event.detail)
  return this.updateSidebar()
}

setCurrentSchema(tableName) {
  this.tableEvent.emit(tableName)
}

highlightRow(tableName) {
  let self = this
  let promises = [];
  promises.push(self.experienceRepeater.componentOnReady());
  promises.push(self.studioRepeater.componentOnReady());
  // console.log(tableName)
  Promise.all(promises).then((_) => {
    // console.log('insideHighlightRowPromise')
    this.experienceTables.map((_, index) => {
      this.experienceRepeater.getItem(index).then((rsp) => {
        let row = rsp.rowEl[0].parentElement.parentElement
        row.style.backgroundColor = 'white'
        if (tableName == rsp.data.name) {
          row.style.backgroundColor = '#E1E1E1'
        }
      })
    })
    self.studioTables.map((_, index) => {
      self.studioRepeater.getItem(index).then((rsp) => {
        let row = rsp.rowEl[0].parentElement.parentElement
        row.style.backgroundColor = 'white'
        if (tableName == rsp.data.name) {
          row.style.backgroundColor = '#E1E1E1'
        }
      })
    })

  })

}


getSingleUseToken() {
  return new Promise((resolve, reject) => {
    try {
      window['getSingleUseToken'](resolve, reject, reject);
    }
    catch (err) {
      reject('Error getting single use token');
    }
  });
}

getAuthToken() {
  var cookies = document.cookie.split(";");
  for (var i = 0, len = cookies.length; i < len; i++) {
    var cookie = cookies[i].split("=");
    if (cookie[0].trim() == "pwa_jwt") {
      return cookie[1].trim();
    }
  }
}



updateSidebar() {
  return this.getSingleUseToken().then((singleUseToken: string) => {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.getAuthToken(),
      "Luma-Proxy-Authorization": singleUseToken
    })
    console.log('Bearer ' + this.getAuthToken())
    console.log(singleUseToken)
    return fetch(this.url, {
      headers: reqHeaders
    }).then(rsp => {
      return rsp.json()
    }).then(data => {
      if (data && data.payload && data.payload.data.length > 0) {
        this.experienceTables = []
        this.studioTables = []
        // console.log('Data retrieved')
        // console.log(data.payload.data)
        data.payload.data.forEach((table) => {
          if (table.scope == 'experience') {
            this.experienceTables.push(table)
          } else {
            this.studioTables.push(table)
          }
        })
        if (this.initialLoad) {
          // this.initialLoad = false
          if (this.experienceTables.length > 0) {
            this.setCurrentSchema(this.experienceTables[0].name)
            // this.highlightRow()
          } else if (this.studioTables.length > 0) {
            this.setCurrentSchema(this.studioTables[0].name)
          }
        } else {
          // this.highlightRow(tableName)
          // console.log('Data processed' + tableName)
        }

      }
    }).catch((err) => {
      console.error('Could not load data', err);
    })
  })
}

render() {
  let template = `<div class='table-item'>
      <div class='table-name'>
      {name}</div>
      <div class='records'>{records} records</div>
      </div>`

  let styles = `.table-item{
      font-family: 'Roboto', sans-serif;
      height: 48px;
      display: flex;
      align-content: stretch;
      padding-left: 10px;
      cursor: pointer;
    }

    .table-name{
      flex: 1 65%;
      align-self: center;
      justify-self: left;
      font-size: 22;
      font-weight: 700;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
    }

    .records{
      flex: 1 35%;
      align-self: center;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }

    ul.mdc-list{
      padding:0px;
    }
    li.mdc-list-item.mdc-ripple-upgraded{
      padding:0px;
    }
    `
  // if (this.experienceTables.length > 0) {
  // console.log('experience + studio render')
  return (
    <div id='parent'>
      <div id='wrapper'>
        {this.experienceTables.length > 0
          ? <div class='table-wrapper'>
            <div class='header'>
              Experience
              </div>
            <div class='tables'>
              <luma-repeater id='experience-tables' template={template}
                template-css-classes={styles}
                ref={(el) => this.experienceRepeater = el as HTMLElement}></luma-repeater>
            </div>
          </div>
          : <div class='table-wrapper' hidden>
            <div class='header'>
              Experience
                  </div>
            <div class='tables'>
              <luma-repeater id='experience-tables' template={template}
                template-css-classes={styles}
                ref={(el) => this.experienceRepeater = el as HTMLElement}></luma-repeater>
            </div>
          </div>
        }
        <div class='table-wrapper'>
          <div class='header'>
            Studio
              </div>
          <div class='tables'>
            <luma-repeater id='studio-tables' template={template}
              template-css-classes={styles}
              ref={(el) => this.studioRepeater = el as HTMLElement}></luma-repeater>
          </div>
        </div>
      </div>

      <luma-button id='add-table' class='add-table' text='Add Table' primary-color='#244862' onClick={() => this.addTable()}></luma-button>
      <data-store-add-schema ref={(el) => this.addTableTag = el as HTMLElement}></data-store-add-schema>
    </div>
  )
  // } else {
  //   console.log('studio only render')
  //   return (
  //     <div id='parent'>
  //       <div id='wrapper'>
  //         <div class='table-wrapper' hidden>
  //           <div class='header'>
  //             Experience
  //           </div>
  //           <div class='tables'>
  //             <luma-repeater id='experience-tables' template={template}
  //               template-css-classes={styles}
  //               ref={(el) => this.experienceRepeater = el as HTMLElement}></luma-repeater>
  //           </div>
  //         </div>
  //         <div class='table-wrapper'>
  //           <div class='header'>
  //             Studio
  //           </div>
  //           <div class='tables'>
  //             <luma-repeater id='studio-tables' template={template} template-css-classes={styles} ref={(el) => this.studioRepeater = el as HTMLElement}></luma-repeater>
  //           </div>
  //         </div>
  //       </div>

  //       <button class='add-table' onClick={() => this.addTable()}>(+) Add Table</button>
  //       <data-store-add-schema ref={(el) => this.addTableTag = el as HTMLElement}></data-store-add-schema>
  //     </div>
  //   )
  // }
}
}
