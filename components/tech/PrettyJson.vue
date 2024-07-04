<template>
    <div class="mt-2">
      <pre class="pretty-json" v-html="highlightedJson"></pre>
    </div>
</template>

<script>
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/github.css'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', json)

export default {
name: 'PrettyJson',
props: {
    json: {
    type: null, // Accept any type of prop
    required: true
    },
    comment: {
    type: String,
    default: ''
    }
},
computed: {
    formattedOutput() {
    let jsonString = '';

    if (typeof this.json === 'object' && this.json !== null) {
        // Format object or array
        jsonString = JSON.stringify(this.json, null, 2);
    } else {
        // Remove quotes from strings, format other primitive types directly
        jsonString = this.formatPrimitive(this.json);
    }

    // Add comment if provided
    if (this.comment) {
        return `/* ${this.comment} */\n${jsonString}`;
    } else {
        return jsonString;
    }
    },
    highlightedJson() {
    return hljs.highlight(this.formattedOutput, { language: 'json' }).value;
    }
},
methods: {
    formatPrimitive(value) {
    if (typeof value === 'string') {
        return value; // Return string without quotes
    } else {
        return JSON.stringify(value, null, 2); // Format numbers, booleans, etc.
    }
    }
}
}
</script>

<style scoped>
.pretty-json {
background-color: #f5f5f5;
padding: 1em;
border-width: 1px;
border-radius: 10px;
border-color: darkgray;
font-family: monospace;
white-space: pre-wrap;
word-wrap: break-word;
}
</style>