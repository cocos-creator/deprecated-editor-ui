editor-ui
=========

Editor UI Components

Todo:

We can minify css,js and html. make them together in one polymer template:

for example:

```html
<polymer-element name="unit-input" on-focus-in="focusIn" on-focus-out="focusOut">
<template>
<link rel="stylesheet" href="unit-input.css">
<div class="box">
    <h1>Hello World</h1>
</div>
<script type="text/javascript" src="unit-input.js"></script>
</template>
</polymer-element>
```

will become:

```html
<polymer-element name="unit-input" on-focus-in="focusIn" on-focus-out="focusOut">
<template>
<style>minify css code</style>
<div class="box">
    <h1>Hello World</h1>
</div>
<script>minify js code</script>
</template>
</polymer-element>
```
