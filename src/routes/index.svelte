<script lang="ts">
    // Components
    import CodeEditor from "@bojit/svelte-components/widgets/CodeEditor/CodeEditor.svelte";
    import NavBar from "@bojit/svelte-components/layout/NavBar/NavBar.svelte";
    import type { NavItem } from "@bojit/svelte-components/layout/NavBar/NavBar.svelte";
    import Tabs from "@bojit/svelte-components/widgets/Tabs/Tabs.svelte";

    import Editor from "$lib/components/Editor.svelte";

    // Assets
    import logo from "$lib/assets/img/Logo.png";

    let codeBlock = "let x = {\n\t\n}";

    let items: NavItem[] = [
        {
            type: "button",
            color:  "success",
            icon: "play_arrow",
            // outlined: true,
        },
        {
            type: "button",
            color:  "alert",
            icon: "bar_chart",
            // outlined: true,
        },
        {
            type: "separator",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "note_add",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "file_open",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "file_copy",
            visibility: "desktop",
        },
        {
            type: "separator",
        },
        {
            type: "button",
            color: "transparent",
            icon: "tune",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "menu",
            visibility: "mobile",
        },
    ];

    let tabIndex = 0;
</script>


<svelte:head>
    <title>ploTTY</title>
</svelte:head>


<!-- Main Navigation -->
<NavBar title="ploTTY" logo={logo} logoLink="https://github.com/BOJIT/ploTTY" items={items} />

<!-- Panel Tabs -->
<Tabs
    tabs={[
        "Code Block",
    ]}
    components={[
        CodeEditor,
    ]}
    componentProps={[
        {
            lineNumbers: true,
            code: codeBlock
        },
    ]}
/>

<!-- Editor overlay -->
<Editor />
