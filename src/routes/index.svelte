<script lang="ts">
    import Tabs from "@bojit/svelte-components/widgets/Tabs/Tabs.svelte";
    import CodeEditor from "@bojit/svelte-components/widgets/CodeEditor/CodeEditor.svelte";

    let codeBlock = "let x = {\n\t\n}";
</script>

<svelte:head>
    <title>ploTTY</title>
</svelte:head>

<Tabs
    tabs={[
        "Code Block",
    ]}
    components={[
        CodeEditor,
    ]}
    componentProps={[
        {},
        {},
        {
            lineNumbers: true,
            code: codeBlock
        },
    ]}
/>
