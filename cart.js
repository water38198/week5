import productModal from "./component/productModal.js";
import api from "./apiConfig.js";

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

const app = Vue.createApp({
    data() {
        return {
            productList: [],
            productId: "",
            cart: {},
            loadingItem: "",
            user: {},
            isLoading: {
                productList: false,
                cart: false,
            },
        };
    },
    methods: {
        getProducts() {
            axios
                .get(`${api.url}/v2/api/${api.path}/products/all`)
                .then((res) => {
                    this.productList = res.data.products;
                    this.isLoading.productList = false;
                });
        },
        openModal(id) {
            this.productId = id;
        },
        addToCart(product_id, qty = 1) {
            this.isLoading.cart = true;
            const data = {
                product_id,
                qty,
            };
            this.loadingItem = product_id;
            axios
                .post(`${api.url}/v2/api/${api.path}/cart`, { data })
                .then((res) => {
                    this.$refs.productModal.hide();
                    this.getCarts();
                    this.loadingItem = "";
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getCarts() {
            axios
                .get(`${api.url}/v2/api/${api.path}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                    this.isLoading.cart = false;
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        updateItemNum(item) {
            const data = {
                product_id: item.product.id,
                qty: item.qty,
            };
            this.loadingItem = item.id;
            this.isLoading.cart = true;

            axios
                .put(`${api.url}/v2/api/${api.path}/cart/${item.id}`, {
                    data,
                })
                .then((res) => {
                    this.getCarts();
                    this.loadingItem = "";
                })
                .catch((err) => {
                    console.log(err.response.data.message);
                });
        },
        deleteCartItem(id) {
            this.loadingItem = id;
            this.isLoading.cart = true;
            axios
                .delete(`${api.url}/v2/api/${api.path}/cart/${id}`)
                .then((res) => {
                    this.getCarts();
                    this.loadingItem = "";
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        deleteCartAll() {
            this.isLoading.cart = true;
            axios
                .delete(`${api.url}/v2/api/${api.path}/carts`)
                .then((res) => {
                    this.getCarts();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        sentOrder() {
            const data = { user: this.user };
            this.isLoading = true;
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
    mounted() {
        this.getProducts();
        this.getCarts();
        this.isLoading.productList = true;
        this.isLoading.cart = true;
    },
    components: {
        productModal,
    },
});
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.component("loading", VueLoading.Component);
app.mount("#app");
