function timeDifference(date1, date2) {
    let time1 = new Date(date1).valueOf(),
        time2 = new Date(date2).valueOf(),
        time = time2 - time1,
        _time = time;

    let divMap = [1000, 60, 60, 24, 365, 100], nameMap = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'years'], returnObj = {};
    for (const [index, value] of divMap.entries()) {
        returnObj[nameMap[index]] = _time % value;
        _time = Math.floor(_time / value);
    }
    returnObj.time = time;
    return returnObj;
}
function counter({ count, doing, done } = {}) {
    function _countDown() {
        if (count) {
            doing && doing(count);
            count--;
            setTimeout(() => {
                _countDown();
            }, 1000);
        } else {
            done && done();
        }
    }
    _countDown();
}

Vue.component('input-account', {
    inheritAttrs: false,
    props: ['value'],
    template: `
        <div class="form-group form-row">
            <label class="col-3 col-form-label">账号：</label>
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" type="text" name="account" class="form-control col-9" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}">
        </div>
        `
});

Vue.component('input-password', {
    inheritAttrs: false,
    props: ['value'],
    template: `
        <div class="form-group form-row">
            <label class="col-3 col-form-label">密码：</label>
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" type="password" name="password" class="form-control col-9" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}">
        </div>
        `
});

Vue.component('input-radio', {
    inheritAttrs: false,
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        radios: Array, name: String, checked: String
    },
    data() {
        return { in_checked: this.checked }
    },
    watch: {
        checked() {
            this.in_checked = this.checked;
        },
        in_checked() {
            this.$emit('change', this.$data.in_checked);
        }
    },
    template: `
    <div>
        <div v-for="(radio,index) of radios" class="custom-control custom-radio custom-control-inline">
            <input v-bind="$attrs" v-model="in_checked" :value="radio.val" type="radio" :name="name" :id="name+'-'+index" class="custom-control-input">
            <label :for="name+'-'+index" class="custom-control-label">{{radio.des}}</label>
        </div>
    </div>
    `
});

Vue.component('input-checkbox', {
    inheritAttrs: false,
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checkboxs: Array, name: String, checked: [Array, Boolean]
    },
    data() {
        return { in_checked: this.checkboxs.length > 1 ? this.checked.slice() : this.checked }
    },
    watch: {
        checked() {
            this.in_checked = this.checkboxs.length > 1 ? this.checked.slice() : this.checked;
        },
        in_checked() {
            this.$emit('change', this.$data.in_checked);
        }
    },
    template: `
        <div>
            <div v-for="(checkbox,index) of checkboxs" class="custom-control custom-checkbox custom-control-inline">
                <input v-bind="$attrs" v-model="in_checked" :value="checkbox.val" type="checkbox" :name="name" :id="name+'-'+index" class="custom-control-input">
                <label :for="name+'-'+index" class="custom-control-label">{{checkbox.des}}</label>
            </div>
        </div>
        `
});

/* Vue.component('input-file', {

}); */

Vue.component('bs4-dropdown', {
    template: `
    <div class="dropdown">
        <div :class="subClass" class="dropdown-toggle" data-toggle="dropdown" :data-display="display">
            <slot name="toggle"></slot>
        </div>
        <ul class="dropdown-menu">
            <template v-for="item in menu">
                <div class="dropdown-item h-100">
                    <slot name="item" :item="item"></slot>
                </div>
                <div v-if="item.divide||false" class="dropdown-divider"></div>
            </template>
        </ul>
    </div>
    `,
    props: {
        display: {
            type: String,
            default: 'static'
        },
        menu: Array,
        subClass: [Object, Array]
    }
});

Vue.component('bs4-listgroup', {
    template: `
    <dl class="list-group" :class="{'list-group-flush':flush}">
        <dd class="list-group-item" :class="{'list-group-item-action':action}" v-for="item in items">
            <slot :item="item"></slot>
        </dd>
    </dl> 
    `,
    props: {
        flush: {
            type: Boolean,
            default: true
        },
        action: {
            type: Boolean,
            default: false
        },
        items: Array
    }
});

Vue.component('app-modal', {
    template: `
    <div class="app-modal">
        <slot></slot>
    </div>
    `
});

/* Vue.component('app-form', {
    template: `
        <form>
            <slot></slot>
            <slot name="button">
                <div class="form-row justify-content-between align-items-center text-center mb-3">
                    <button type="reset" class="btn btn-secondary col-12 col-md-6 mb-3 mb-md-0">重置</button>
                    <button type="submit" @click.prevent class="btn btn-primary col-12 col-md-6 mb-3 mb-md-0">提交</button>
                </div>
            </slot>
        </form>
        `,
}); */

export default {}