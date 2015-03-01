WaatEditor.Events = function(editor){
  this.editor = editor;
}

WaatEditor.Events.prototype.elementClickEvent = function(e){
  var sel = this.editor.helpers.getSelectionStart(),
      tagName = sel ? sel.tagName.toLowerCase() : null;
};

WaatEditor.Events.prototype.elementFocusEvent = function(e){
  
};

WaatEditor.Events.prototype.elementBlurEvent = function(e){
  e.preventDefault();
  var editor = this.editor;

  setTimeout(function(){
    editor.menu.deactivate();
  }, 10);
};

WaatEditor.Events.prototype.elementKeydownEvent = function(e){
  var editor = this.editor,
      sel = editor.helpers.getSelectionStart(),
      normalizerClass = editor.options.normalizerClass.toString(),
      tagName = sel.tagName.toLowerCase(),
      brs = sel.getElementsByTagName('br'),
      nextSibling = editor.helpers.getSelectionStart().nextElementSibling,
      previousSibling = editor.helpers.getSelectionStart().previousSibling,
      range = document.createRange(),
      selection = document.getSelection();

  if(e.which === 13) {
    if(tagName !== 'p'){
      sel.classList.add(normalizerClass);
      editor.previousSibling = sel;
    }
  }
     
  if(e.which === 8 || e.which === 46) {
    if(sel.textContent.length <= 1){
      e.preventDefault();

      var range = document.createRange();

      sel.innerHTML = "&nbsp;";
      range.selectNode(sel);
    }
  }

  if(e.which === 9){
    if(nextSibling){
      e.preventDefault();
      range.selectNode(nextSibling);
      selection.removeAllRanges();
      selection.addRange(range);
      editor.previousSibling = previousSibling;
    }
  }

};

WaatEditor.Events.prototype.elementKeyupEvent = function(e){
  var editor = this.editor,
      sel = editor.helpers.getSelectionStart(),
      tagName = sel.tagName.toLowerCase(),
      normalizerClass = editor.options.normalizerClass.toString(),
      previousSibling = sel.previousElementSibling;

  if(e.which === 13){
    if(tagName !== 'p', previousSibling && (previousSibling.className.indexOf(normalizerClass) !== -1)){
      document.execCommand('formatBlock', false, 'p');
      previousSibling.classList.remove(normalizerClass);
    }
  }

  if(sel.textContent === ""){
    editor.sidemenu.on();
  }
  else {
    editor.sidemenu.deactivate();
  }
};

WaatEditor.Events.prototype.elementMouseupEvent = function(e){

  var sel = window.getSelection(),
      editor = this.editor;
  
  if(sel.anchorNode.nodeType === 3 && (sel.anchorNode.textContent.trim() !== "" && sel.toString().length > 0) && !sel.anchorNode.parentElement.classList.contains(editor.options.placeholderClass)){
    editor.currentSelection = editor.helpers.saveSelection();
    editor.menu.activate();  
  }
  else {
    editor.menu.deactivate();
  }
}