/**
 * @file Set the document theme to be light or dark mode
 */

function light() {
    document.body.classList.add("theme--light");
    document.body.classList.remove("theme--dark");
}

function dark() {
    document.body.classList.add("theme--dark");
    document.body.classList.remove("theme--light");
}

export default {
    light,
    dark
}
