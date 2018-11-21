(function () {

    
    CKEDITOR.plugins.add("embedCode", {
        init: function (editor) {
            editor.ui.addButton("EmbedCode", {
                label: "Embed Code",
                command: "embedCodeCmd",
                toolbar: "insert",
                icon: "http://www.download82.com/images/produse/iconuri/code-compare.gif",
            })
            editor.addCommand("embedCodeCmd", {
                exec: function (editor) {
                    window.onSelected = (id) => {
                        editor.insertHtml('<hr id="code-' + id + '" />');
                    }
                    window.open('/app#!/sourceCodes?popupSelect=true', "_blank", "toolbar=yes,scrollbars=yes,resizable=yes," + "width=" + screen.availWidth + ",height=" + screen.availHeight);
                }
            })
        }
    })
    
})();