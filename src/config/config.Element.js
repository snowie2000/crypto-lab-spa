import Vue from 'vue';
import {
    Select,
    Dialog,
    Card,
    Tree,
    Input,
    Button,
    ButtonGroup,
    Alert,
    RadioButton,
    RadioGroup,
    Option,
    OptionGroup,
    Tooltip,
    TableColumn,
    Table,
    Tabs,
    TabPane,
    Message,
    MessageBox,
    Loading
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Select)
Vue.use(Card)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(Input)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(Table)
Vue.use(Button)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(ButtonGroup)
Vue.use(OptionGroup)
Vue.use(TableColumn)
Vue.use(Loading)
Vue.use(Option)
Vue.use(Alert)
Vue.use(Tooltip)

Vue.prototype.$ELEMENT = {size: 'small'}
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

export default {}