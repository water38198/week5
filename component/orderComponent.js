import api from "../apiConfig.js";
// 引入VeeValidate
Object.keys(VeeValidateRules).forEach((rule) => {
    if (rule !== "default") {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize("zh_TW"),
    validateOnInput: true,
});
// 引入VeeValidate
export default {
    template: `<div class="row justify-content-center">
            <div class="col-4">
                <v-form v-slot="{ errors }" @submit="sentOrder" class="my-5 " ref="userForm">
                    <div class="mb-3">
                        <label for="name" class="h5">姓名:</label>
                        <v-field id="name" name="姓名" type="text" class="form-control"
                            :class="{ 'is-invalid': errors['姓名'] }" placeholder="請輸入 姓名" rules="required"
                            v-model="user.name"></v-field>
                        <error-message name="姓名" class="invalid-feedback"></error-message>
                    </div>
                    <div class="mb-3">
                        <label for="tel" class="h5">電話:</label>
                        <v-field id="tel" name="電話" type="text" class="form-control"
                            :class="{ 'is-invalid': errors['電話'] }" placeholder="請輸入 電話" :rules="isPhone"
                            v-model="user.tel"></v-field>
                        <error-message name="電話" class="invalid-feedback"></error-message>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="h5">電子郵件:</label>
                        <v-field id="email" name="電子郵件" type="email" class="form-control"
                            :class="{ 'is-invalid': errors['電子郵件'] }" placeholder="請輸入 電子郵件" rules="required||email"
                            v-model="user.email"></v-field>
                        <error-message name="電子郵件" class="invalid-feedback"></error-message>
                    </div>
                    <div class="mb-3">
                        <label for="address" class="h5">地址:</label>
                        <v-field id="address" name="地址" type="text" class="form-control"
                            :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入 地址" rules="required"
                            v-model="user.address"></v-field>
                        <error-message name="地址" class="invalid-feedback"></error-message>
                    </div>
                    <div class="mb-3">
                        <label for="message" class="h5">附註:</label>
                        <v-field id="message" name="附註" type="text" class="form-control"
                            :class="{ 'is-invalid': errors['附註'] }" placeholder="請輸入 附註" v-model="user.message"
                            as="textarea" cols="10" rows="10"></v-field>
                        <error-message name="地址" class="invalid-feedback"></error-message>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary w-100" :disabled="!cart.carts?.length">送出</button>
                    </div>
                </v-form>
            </div>
        </div>`,
    components: {
        VForm: VeeValidate.Form,
        VField: VeeValidate.Field,
        ErrorMessage: VeeValidate.ErrorMessage,
    },
    data() {
        return {
            user: {},
        };
    },
    methods: {
        sentOrder() {
            const data = { user: this.user };
            axios
                .post(`${api.url}/v2/api/${api.path}/order`, { data })
                .then((res) => {
                    alert(res.data.message);
                    this.getCarts();
                    this.$refs.userForm.resetForm();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        isPhone(value) {
            //電話驗證
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : "需要正確的電話號碼";
        },
    },
    props: ["cart", "getCarts"],
};
