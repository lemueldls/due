import { createApp, h, ref, reactive } from "https://cdn.skypack.dev/vue@next";

const App = createApp({
  setup() {
    const readersNumber = ref(0);
    const book = reactive({ title: "Vue 3 Guide" });

    // @ts-ignore
    return () => h("div", [readersNumber.value, book.title]);
  },
});

export default App;
