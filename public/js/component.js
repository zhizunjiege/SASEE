(function ($) {
    const util = window.util;

    Vue.component('app-alert', {
        data: () => ({
            msg: '网络错误，请稍后重试！',
            buttonShow: true,
            success: false
        }),
        template: `
        <div class="modal p-3 alert-modal">
              <div class="alert text-center" :class="success?'alert-primary':'alert-warning'"><span>{{msg}}</span><button v-show="buttonShow" type="button" class="ml-3 close"
                data-dismiss="modal"><span>&times;</span></button>
               </div>
         </div>  
        `,
        methods: {
            alert(msg) {
                let $el = $(this.$el);
                this.msg = msg;
                this.buttonShow = true;
                this.success = false;
                $el.modal('show');
            },
            done(msg = '操作成功！') {
                let $el = $(this.$el);
                this.msg = msg;
                this.buttonShow = true;
                this.success = true;
                $el.modal('show');
                util.counter({
                    count: 2,
                    done() {
                        $el.modal('hide');
                    }
                });
            },
            fail(xhr) {
                let location = xhr.getResponseHeader('Location'),
                    $el = $(this.$el);
                if (location) {
                    this.buttonShow = false;
                    util.counter({
                        count: 2,
                        done() {
                            window.location.href = location;
                        }
                    });
                } else {
                    this.buttonShow = true;
                }
                this.msg = xhr.responseText;
                this.success = false;
                $el.modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        },
    });

    Vue.component('input-account', {
        inheritAttrs: false,
        props: ['value'],
        template: `
        <div class="form-group form-row">
            <label class="col-3 col-form-label">账号：</label>
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" type="text" name="account" class="form-control col-9" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required>
        </div>
        `
    });

    Vue.component('input-password', {
        inheritAttrs: false,
        props: ['value'],
        template: `
        <div class="form-group form-row">
            <label class="col-3 col-form-label">密码：</label>
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" type="password" name="password" class="form-control col-9" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required>
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

    Vue.component('app-form', {
        props: {
            action: {
                type: String,
                required: true
            },
            method: {
                default: 'POST'
            },
            fields: {
                type: Object,
                required: true
            },
            validate: Object,
            done: {
                type: Function,
                default(data) {
                    this.$emit('form:done', data);
                }
            },
            fail: {
                type: Function,
                default(xhr) {
                    console.log('aa');
                    this.$emit('form:fail', xhr);
                }
            }
        },
        template: `
        <form :action="action" :method="method" @submit.prevent="submit">
            <slot name="body" :fields="fields"></slot>
            <slot name="button" :fields="fields">
                <div class="form-row justify-content-between align-items-center text-center mb-3">
                    <button type="reset" class="btn btn-secondary col-12 col-md-6 mb-3 mb-md-0">重置</button>
                    <button type="submit" class="btn btn-primary col-12 col-md-6 mb-3 mb-md-0">提交</button>
                </div>
            </slot>
        </form>
        `,
        methods: {
            submit() {
                let results = {}, validate = this.validate;
                if (validate) {
                    results = Object.assign({}, this.fields);
                    for (const [field, val] of Object.entries(this.fields)) {
                        if (validate[field]) {
                            let result = validate[field](val);
                            if (result.pass) {
                                results[field] = result.val;
                            } else {
                                this.$emit('form:alert', result.msg);
                                return;
                            }
                        }
                    }
                } else {
                    results = this.fields;
                }
                $.json(this.action, results).done(this.done.bind(this)).fail(this.fail.bind(this));
            }
        }
    });

    Vue.component('app-container', {
        template: `
        <div>
            <slot></slot>
            <app-alert ref="alert"></app-alert>
        </div>        
        `,
        methods: {
            alert(msg) {
                this.$refs.alert.alert(msg);
            },
            done(msg) {
                this.$refs.alert.done(msg);
            },
            fail(xhr) {
                console.log('BB');
                console.log(xhr);
                this.$refs.alert.fail(xhr);
            }
        },
        mounted() {
            this.$on('form:fail', function (xhr) {
                console.log(xhr);
            })
        }
    });

})(window.jQuery);