const log = (text) => {
    setTimeout(console.log.bind(console, `%c⌛ ${text}`, "color:green;font-size:15px;"));
};

const runScript = () => {


    const changeBundle = (bundle) => {

        bundle = bundle.replace(/80:40/, "80:50");
        log("Script injection was successful")

        return bundle;
    };

    const loadScript = async (target, script) => {

        const response = await fetch(script.src);
        let code = await response.text();
        code = changeBundle(code);

        const blob = new Blob([code], { type: "text/plain" })
        const element = document.createElement("script");
        element.src = URL.createObjectURL(blob);

        target.appendChild(element);
        URL.revokeObjectURL(element.src);
    }

    const observer = new MutationObserver(function(mutations) {

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT" && node.src.match(/bundle.js/)) {
                    observer.disconnect();
                    loadScript(mutation.target, node);
                }
            }
        }
    })
    observer.observe(document, {childList: true, subtree: true});
}

runScript();
