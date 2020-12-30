import Vue from 'vue'
import { Button, Dialog,MessageBox} from 'element-ui'
import {Form, FormItem, Input, Row, Col, Menu, Submenu, MenuItemGroup, MenuItem,Tooltip, Pagination} from'element-ui'
import {Card, Image, Divider, Link, Collapse, Transfer, CollapseItem, Message, Container, Header, Aside, Main, Breadcrumb,BreadcrumbItem, Table, TableColumn, Switch} from 'element-ui'
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.prototype.$confirm = MessageBox.confirm

Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Card)
Vue.use(Image)
Vue.use(Divider)
Vue.use(Link)
Vue.use(Collapse)
Vue.use(Transfer)
Vue.use(CollapseItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message