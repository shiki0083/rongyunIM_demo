import Vue from "vue";
import Router from "vue-router";
import Product from "@/components/chat";
import Development from "@/components/chatter";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Product",
      component: Product,
      meta: {
        title: "产品"
      }
    },
    {
      path: "/2",
      name: "Development",
      component: Development,
      meta: {
        title: "开发"
      }
    }
  ]
});
