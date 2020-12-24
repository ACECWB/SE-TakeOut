import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem, Input, Row, Col} from'element-ui'
import {Card, Image, Divider, Link, Collapse, Transfer, CollapseItem, Message} from 'element-ui'


import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)

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
Vue.prototype.$message = Message