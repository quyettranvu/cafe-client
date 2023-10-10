import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
    role: '',
  },
  {
    state: 'category',
    name: 'Category',
    type: 'link',
    icon: 'category',
    role: '', //if specify here '' then user can see it but can not access it
  },
  {
    state: 'product',
    name: 'Product',
    type: 'link',
    icon: 'local_cafe',
    role: '', //if specify here '' then user can see it but can not access it
  },
  {
    state: 'order',
    name: 'Order',
    type: 'link',
    icon: 'shopping_cart',
    role: '', //if specify here '' then user can see it but can not access it
  },
  {
    state: 'bill',
    name: 'Bill',
    type: 'link',
    icon: 'backup_table',
    role: '', //if specify here '' then user can see it but can not access it
  },
  {
    state: 'user',
    name: 'User',
    type: 'link',
    icon: 'people',
    role: '', //if specify here '' then user can see it but can not access it
  },
];

@Injectable()
export class MenuItems {
  getMenuItem(): Menu[] {
    return MENUITEMS;
  }
}
