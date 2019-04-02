/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface DataStoreAddSchema {
    'header': boolean;
    'schema': any;
    'updateColumns': (tableName?: string) => void;
  }
  interface DataStoreAddSchemaAttributes extends StencilHTMLAttributes {
    'header'?: boolean;
    'onUpdate'?: (event: CustomEvent) => void;
    'schema'?: any;
  }

  interface DataStoreDeleteTable {
    'getTableInfo': (tableId: any, tableName: any) => void;
    'header': boolean;
    'schema': any;
  }
  interface DataStoreDeleteTableAttributes extends StencilHTMLAttributes {
    'header'?: boolean;
    'onDelete'?: (event: CustomEvent) => void;
    'schema'?: any;
  }

  interface DataStoreEditSchema {
    'componentWillUpdate': () => void;
    'header': boolean;
    'schema': any;
    'updateColumns': (tableName: any, columns: any) => void;
  }
  interface DataStoreEditSchemaAttributes extends StencilHTMLAttributes {
    'header'?: boolean;
    'onUpdate'?: (event: CustomEvent) => void;
    'schema'?: any;
  }

  interface DataStoreFileUtil {
    'header': boolean;
    'openFileUtil': (tableName: any, apiUrl: any) => void;
    'schema': any;
  }
  interface DataStoreFileUtilAttributes extends StencilHTMLAttributes {
    'header'?: boolean;
    'onUpdate'?: (event: CustomEvent) => void;
    'schema'?: any;
  }

  interface DataStoreSidebarItem {
    'records': any;
    'tableName': any;
  }
  interface DataStoreSidebarItemAttributes extends StencilHTMLAttributes {
    'onHighlight'?: (event: CustomEvent) => void;
    'onTable'?: (event: CustomEvent) => void;
    'records'?: any;
    'tableName'?: any;
  }

  interface DataStoreSidebar {
    'temp': string;
  }
  interface DataStoreSidebarAttributes extends StencilHTMLAttributes {
    'onHighlight'?: (event: CustomEvent) => void;
    'onTable'?: (event: CustomEvent) => void;
    'temp'?: string;
  }

  interface DataStoreTableItem {
    'header': boolean;
    'row': any;
  }
  interface DataStoreTableItemAttributes extends StencilHTMLAttributes {
    'header'?: boolean;
    'row'?: any;
  }

  interface DataStoreTable {
    'temp': string;
  }
  interface DataStoreTableAttributes extends StencilHTMLAttributes {
    'temp'?: string;
  }

  interface DataStoreToast {
    'line1': string;
    'line2': string;
    'line3': string;
  }
  interface DataStoreToastAttributes extends StencilHTMLAttributes {
    'line1'?: string;
    'line2'?: string;
    'line3'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'DataStoreAddSchema': Components.DataStoreAddSchema;
    'DataStoreDeleteTable': Components.DataStoreDeleteTable;
    'DataStoreEditSchema': Components.DataStoreEditSchema;
    'DataStoreFileUtil': Components.DataStoreFileUtil;
    'DataStoreSidebarItem': Components.DataStoreSidebarItem;
    'DataStoreSidebar': Components.DataStoreSidebar;
    'DataStoreTableItem': Components.DataStoreTableItem;
    'DataStoreTable': Components.DataStoreTable;
    'DataStoreToast': Components.DataStoreToast;
  }

  interface StencilIntrinsicElements {
    'data-store-add-schema': Components.DataStoreAddSchemaAttributes;
    'data-store-delete-table': Components.DataStoreDeleteTableAttributes;
    'data-store-edit-schema': Components.DataStoreEditSchemaAttributes;
    'data-store-file-util': Components.DataStoreFileUtilAttributes;
    'data-store-sidebar-item': Components.DataStoreSidebarItemAttributes;
    'data-store-sidebar': Components.DataStoreSidebarAttributes;
    'data-store-table-item': Components.DataStoreTableItemAttributes;
    'data-store-table': Components.DataStoreTableAttributes;
    'data-store-toast': Components.DataStoreToastAttributes;
  }


  interface HTMLDataStoreAddSchemaElement extends Components.DataStoreAddSchema, HTMLStencilElement {}
  var HTMLDataStoreAddSchemaElement: {
    prototype: HTMLDataStoreAddSchemaElement;
    new (): HTMLDataStoreAddSchemaElement;
  };

  interface HTMLDataStoreDeleteTableElement extends Components.DataStoreDeleteTable, HTMLStencilElement {}
  var HTMLDataStoreDeleteTableElement: {
    prototype: HTMLDataStoreDeleteTableElement;
    new (): HTMLDataStoreDeleteTableElement;
  };

  interface HTMLDataStoreEditSchemaElement extends Components.DataStoreEditSchema, HTMLStencilElement {}
  var HTMLDataStoreEditSchemaElement: {
    prototype: HTMLDataStoreEditSchemaElement;
    new (): HTMLDataStoreEditSchemaElement;
  };

  interface HTMLDataStoreFileUtilElement extends Components.DataStoreFileUtil, HTMLStencilElement {}
  var HTMLDataStoreFileUtilElement: {
    prototype: HTMLDataStoreFileUtilElement;
    new (): HTMLDataStoreFileUtilElement;
  };

  interface HTMLDataStoreSidebarItemElement extends Components.DataStoreSidebarItem, HTMLStencilElement {}
  var HTMLDataStoreSidebarItemElement: {
    prototype: HTMLDataStoreSidebarItemElement;
    new (): HTMLDataStoreSidebarItemElement;
  };

  interface HTMLDataStoreSidebarElement extends Components.DataStoreSidebar, HTMLStencilElement {}
  var HTMLDataStoreSidebarElement: {
    prototype: HTMLDataStoreSidebarElement;
    new (): HTMLDataStoreSidebarElement;
  };

  interface HTMLDataStoreTableItemElement extends Components.DataStoreTableItem, HTMLStencilElement {}
  var HTMLDataStoreTableItemElement: {
    prototype: HTMLDataStoreTableItemElement;
    new (): HTMLDataStoreTableItemElement;
  };

  interface HTMLDataStoreTableElement extends Components.DataStoreTable, HTMLStencilElement {}
  var HTMLDataStoreTableElement: {
    prototype: HTMLDataStoreTableElement;
    new (): HTMLDataStoreTableElement;
  };

  interface HTMLDataStoreToastElement extends Components.DataStoreToast, HTMLStencilElement {}
  var HTMLDataStoreToastElement: {
    prototype: HTMLDataStoreToastElement;
    new (): HTMLDataStoreToastElement;
  };

  interface HTMLElementTagNameMap {
    'data-store-add-schema': HTMLDataStoreAddSchemaElement
    'data-store-delete-table': HTMLDataStoreDeleteTableElement
    'data-store-edit-schema': HTMLDataStoreEditSchemaElement
    'data-store-file-util': HTMLDataStoreFileUtilElement
    'data-store-sidebar-item': HTMLDataStoreSidebarItemElement
    'data-store-sidebar': HTMLDataStoreSidebarElement
    'data-store-table-item': HTMLDataStoreTableItemElement
    'data-store-table': HTMLDataStoreTableElement
    'data-store-toast': HTMLDataStoreToastElement
  }

  interface ElementTagNameMap {
    'data-store-add-schema': HTMLDataStoreAddSchemaElement;
    'data-store-delete-table': HTMLDataStoreDeleteTableElement;
    'data-store-edit-schema': HTMLDataStoreEditSchemaElement;
    'data-store-file-util': HTMLDataStoreFileUtilElement;
    'data-store-sidebar-item': HTMLDataStoreSidebarItemElement;
    'data-store-sidebar': HTMLDataStoreSidebarElement;
    'data-store-table-item': HTMLDataStoreTableItemElement;
    'data-store-table': HTMLDataStoreTableElement;
    'data-store-toast': HTMLDataStoreToastElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
