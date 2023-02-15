import api from "../apiConfig.js";

export default {
    template: `

    <div class="modal  fade " id="productModal" tabindex="-1" aria-labelledby="prodcutModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content vl-parent">
                    <template v-if="modalLoading">
                <div>
                    <loading v-model:active="modalLoading" :is-full-page="false" />
                </div>
            </template>
        <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel">
                {{tempProduct.title}}
                <span class="badge rounded-pill bg-secondary">{{tempProduct.category}}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-6">
                    <img class="img-fluid" :src="tempProduct.imageUrl">
                </div>
                <div class="col-6 ">
                    <p class="fs-3">商品內容：</p>
                    <p>{{tempProduct.content}}</p>
                    <p class="fs-3">商品敘述：</p>
                    <p>{{tempProduct.description}}</p>
                    <p class="fs-3">價格：</p>
                    <div class="h5" v-if="tempProduct.origin_price === tempProduct.price">
                        {{tempProduct.price}}元
                    </div>
                    <div v-else>
                    <div class="h5">現在只要{{tempProduct.price}}元</div>
                        <del class="h6 text-secondary">原價{{tempProduct.origin_price}}元</del>
                    </div> 
                    <div class="input-group  mt-5">
                        <select class="form-select" v-model="qty">
                            <option v-for=" i in 10" :key="i" :value="i">
                                {{i}}
                            </option>
                        </select>
                        <button type="button" class="btn btn-danger" @click="addToCart(tempProduct.id,productNum)">加入購物車</button>
                    </div>                   
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
        </div>
    </div>
    </div>`,
    data() {
        return {
            tempProduct: {},
            modal: {},
            qty: 1,
            modalLoading: false,
        };
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
        this.$refs.modal.addEventListener("hidden.bs.modal", (event) => {
            this.openModal("");
        });
    },
    props: ["productId", "addToCart", "openModal", "closeLoading"],
    watch: {
        productId() {
            this.modalLoading = true;
            //沒有id時不要戳api
            if (this.productId) {
                axios
                    .get(
                        `${api.url}/v2/api/${api.path}/product/${this.productId}`
                    )
                    .then((res) => {
                        this.tempProduct = res.data.product;
                        this.modal.show();
                        this.modalLoading = false;
                    });
            }
        },
    },
    methods: {
        hide() {
            this.modal.hide();
        },
    },
};
