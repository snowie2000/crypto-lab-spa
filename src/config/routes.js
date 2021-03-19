import Vue from "vue"
import Router from "vue-router"
import base64 from "@/components/CBase64"
import json from "@/components/CJson"
import hmac from "@/components/CHMac"
import md5 from "@/components/CMD5"
import regex from "@/components/CRegex"

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/base64"
        },{
            path: "/base64",
            name: "base64",
            component: base64
        },{
            path: "/md5",
            name: "md5",
            component: md5
        },{
            path: "/hmac",
            name: "hmac",
            component: hmac
        },{
            path: "/json",
            name: "json",
            component: json
        }, {
            path: "/regex",
            name: "regex",
            component: regex
        }
    ]
})

export default router