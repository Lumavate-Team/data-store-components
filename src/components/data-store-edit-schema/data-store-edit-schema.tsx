
import { Component, Prop, State, Element, Event, EventEmitter, Method, Listen } from "@stencil/core";

@Component({
  tag: 'data-store-edit-schema',
  styleUrl: 'data-store-edit-schema.scss',
  shadow: true
})
export class EditSchema {

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema

  @Element() el: HTMLElement
  parent
  repeater
  cancelbtn
  savebtn
  headerInput
  addbtn
  selectMenu
  optionsInput
  invalidInput = false
  url = '/ic/data-store-admin-ui/manage/'
  @State() tableName
  @State() columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '', 'active': true, newColumn: true }]
  @Event({ eventName: 'update', composed: true, bubbles: true, cancelable: false }) addSchemaEvent: EventEmitter

  @Method()
  updateColumns(tableName, columns) {
    this.cancelbtn.style.width = ''
    this.cancelbtn.style.paddingRight = '10px'
    this.savebtn.style.width = ''
    this.addbtn.style.width = ''
    this.headerInput.style.width = '85%'
    this.repeater.style.width = '85%'
    this.tableName = tableName
    this.columns = columns
    this.repeater.setData(this.columns)
  }

  addColumn() {
    this.columns = [...this.columns, { columnName: '', type: '', devName: '', options: '', 'active': true, newColumn: true }]
    this.repeater.setData(this.columns)
  }




  @Method()
  componentWillUpdate() {
    this.headerInput.shadowRoot.querySelector('#input_edit-schema-header').pattern = '^[a-zA-Z1-9-]+$'
  }

  deleteColumn(index) {
    this.columns.splice(index, 1)
    this.columns = [...this.columns]
  }

  @Listen('onValueChange')
  handleInput(event) {
    if (event.srcElement.tagName == 'DATA-STORE-EDIT-SCHEMA') {
      // debugger
      let inputElId = event.detail.lumaElement.id
      if (inputElId == 'input_edit-schema-header') {
        this.tableName = event.detail.value
      } else {
        let lumaRowIndex = event.path[0].getAttribute('luma-row-index')
        let rowKey = event.path[0].getAttribute('row-key')
        this.columns[lumaRowIndex][rowKey] = event.detail.value
        if (rowKey == 'columnName') {
          let newColumn = this.columns[lumaRowIndex]['newColumn']
          this.repeater.getItem(lumaRowIndex).then((rsp) => {
            let devNameInput = rsp.rowEl.children[2]
            if (newColumn) {
              devNameInput.value = this.camelCase(event.detail.value)
              this.columns[lumaRowIndex]['devName'] = this.camelCase(event.detail.value)
            }
          })
        }
        if (rowKey == 'type') {
          this.columns[lumaRowIndex][rowKey] = event.detail.value
          let optionsInput = null
          if (event.detail.value == 'Dropdown') {
            this.repeater.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl.children[3]
              optionsInput.disabled = false
            })
          } else {
            this.repeater.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl.children[3]
              optionsInput.value = ''
              optionsInput.disabled = true
            })
          }
        }
        if (rowKey == 'toggle') {
          this.columns[lumaRowIndex][rowKey] = event.detail.value
        }
      }
    }
    //add update item call to repeater
  }

  camelCase(str) {
    return str.replace(/[-]/g, ' ') // convert hyphens to spaces
      .replace(/\s[a-z]/g, this.upperCase)//uppercase first letter of words
      .replace(/\s+/g, '') // remove spaces
      .replace(/^[A-Z]/g, this.lowerCase)// lowercase first letter
  }

  upperCase(str) {
    return str.toUpperCase()
  }

  lowerCase(str) {
    return str.toLowerCase()
  }


  handleHeaderInput(event) {
    this.tableName = event.target.value
  }
  cancel() {
    this.el.style.display = 'none'
    this.columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '', 'active': true, newColumn: true }]
    this.tableName = ''
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


  checkInputs() {
    let self = this
    self.invalidInput = false
    return new Promise((resolve) => {
      self.columns.forEach((_, index) => {
        let promises = []
        promises.push(self.repeater.getItem(index))
        Promise.all(promises).then(rsp => {
          rsp.forEach((row) => {
            let childPromises = []
            row.rowEl.childNodes.forEach((child) => {
              childPromises.push(child.getInputData())
            })
            Promise.all(childPromises).then(r => {
              r.forEach(inputField => {
                if (inputField.isValid == false) {
                  self.invalidInput = true
                }
              })
              resolve()
            })
          })
        })
      })
    })
  }

  saveTable() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.getAuthToken()
    })

    this.checkInputs().then(() => {
      if (this.invalidInput) {
        console.log('no table for you')
      } else {
        return fetch(this.url + this.tableName + '/schema', {
          headers: reqHeaders,
          method: 'put',
          body: JSON.stringify(this.columns)
        }).then(rsp => {
          return rsp.json()
        }).then(() => {
          this.addSchemaEvent.emit(this.tableName)
          this.cancel()
        }).catch((err) => {
          console.error('Failed to add schema to table', err);
        })
      }
    }
    )
  }

    // fetch(this.url + this.tableName + '/schema', {
    //   headers: reqHeaders,
    //   method: 'put',
    //   body: JSON.stringify(this.columns)
    // }).then(rsp => {
    //   return rsp.json()
    // }).then(() => {
    //   this.addSchemaEvent.emit(this.tableName)
    //   this.cancel()
    // }).catch((err) => {
    //   console.error('Failed to add schema to table', err);
    // })
    render() {
      let template = `
    <luma-input-text id="columnName" row-key="columnName" class="edit-schema-row-item" primary-color="#244862" placeholder="Column Name" input-style="filled" value={columnName} required></luma-input-text>
    <luma-select id="type" row-key="type" class="edit-schema-row-item" primary-color="#244862" option-csv="Text,Numeric,Dropdown,Image" selected-value={type} placeholder="Select Type" select-style="filled"></luma-select>
    <luma-input-text id="devName" row-key="devName" class="edit-schema-row-item" primary-color="#244862" placeholder="Dev Name" input-style="filled" value={devName} readonly="true"></luma-input-text>
    <luma-input-text id="options" row-key="options" class="edit-schema-row-item" primary-color="#244862" pattern='^[a-zA-Z0-9-]+(,[a-zA-Z0-9-]+)*$' placeholder="Options" input-style="filled" value={options} disabled="true"></luma-input-text>
    <luma-toggle id='column-toggle'row-key="active" secondary-color='#244862' value={active} ></luma-toggle>`

      let styles = `
  .edit-schema-row-item{
    padding-right: 32px;
  }
  .mdc-list{
    margin: 0px;
    padding: 0px;
    // width: 100%;
  }
  .mdc-list-item{
    margin: 0px;
    padding: 0px;
    // height:70px;
  }

  .mdc-list .mdc-list-item{
    height: auto;
    padding:0px;
  }

  #column-toggle{
    padding-bottom: 19px;
  }
  `

      return (
        <div id="parent" ref={(el) => this.parent = el as HTMLElement}>
          <luma-input-text id="edit-schema-header" class="edit-schema-header" readonly="true" input-style="filled" value={this.tableName} primary-color="#244862" ref={(el) => this.headerInput = el as HTMLElement}></luma-input-text>
          <luma-repeater id="edit-schema-repeater" class="row-container" template={template} template-css-classes={styles} ref={(el) => this.repeater = el as HTMLElement}></luma-repeater>
          <luma-button id="add-row" class='add-row' text="Add" icon="control_point" button-type="flat" primary-color="#FFF" onClick={() => this.addColumn()} ref={(el) => this.addbtn = el as HTMLElement}></luma-button>
          <div class="edit-schema-footer">
            <div id="bottom-row-spacer"></div>
            <luma-button id="cancel-schema" text="Cancel" primary-color="#244862" onClick={() => this.cancel()} ref={(el) => this.cancelbtn = el as HTMLElement}></luma-button>
            <luma-button id="save-schema" text="Save" primary-color="#244862" onClick={() => this.saveTable()} ref={(el) => this.savebtn = el as HTMLElement}></luma-button>
          </div>
        </div>
      )
    }
  }
