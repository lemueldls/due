import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.min.js";

Vue({
  el: "#app",
  data: {
    greeting: "Welcome to your Vue.js app!",
    docsURL: "http://vuejs.org/guide/",
    discordURL: "https://chat.vuejs.org",
    forumURL: "http://forum.vuejs.org/",
  },
  methods: {
    humanizeURL: function (url: string) {
      return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    },
  },
});
