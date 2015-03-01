WaatEditor.helpers = function(editor){
  this.editor = editor;
}


WaatEditor.helpers.prototype = {
  init: function(){
    this.editor = editor;
  },
  getSelectionStart: function(){
    var node = document.getSelection().anchorNode,
      startNode = (node && node.nodeType === 3 ? node.parentElement : node);
    
    if(startNode){
      return startNode;    
    }

    return null;    
  },
  saveSelection: function() {
    var i,
      len,
      ranges,
      sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      ranges = [];
      for (i = 0, len = sel.rangeCount; i < len; i += 1) {
        ranges.push(sel.getRangeAt(i));
      }
      return ranges;
    }
    return null;
  },
  restoreSelection: function(savedSel) {
    var i,
      len,
      sel = window.getSelection();
    if (savedSel) {
      sel.removeAllRanges();
      for (i = 0, len = savedSel.length; i < len; i += 1) {
        sel.addRange(savedSel[i]);
      }
    }
  },
  merge: function(b, a) {
    var prop;
    if (b === undefined) {
      return a;
    }
    for (prop in a) {
      if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
        b[prop] = a[prop];
      }
    }
    return b;
  },
  setCaretPosition: function (elemId, caretPos) {
  var elem = document.getElementById(elemId);

  if(elem != null) {
    if(elem.createTextRange) {
      var range = elem.createTextRange();
      range.move('character', caretPos);
      range.select();
    }
    else {
      if(elem.selectionStart) {
        elem.focus();
        elem.setSelectionRange(caretPos, caretPos);
      }
      else
        elem.focus();
      }
    }
  },
  getEditorElement: function(node){
    var currentElement = node,
        contentEditbale = currentElement.getAttribute('contenteditable') ? true : false;

    if(!contentEditbale) {
      currentElement = this.getEditorElement(currentElement.parentElement);
    }

    return currentElement;
  },
  currentSelection: function(){
    return this.getSelectionStart;
    // return document.getSelection().focusNode.parentNode
  },
  cleanArray: function(actual){
    var newArray = new Array();
    for(var i = 0; i<actual.length; i++){
        if (actual[i]){
          newArray.push(actual[i]);
      }
    }
    return newArray;
  },
  checkSelector: function(selector){
    var selector = selector.trim(),
        element = {
          tag: 'div',
          attributes: {}
        },
        klass = selector.indexOf('.'),
        id = selector.indexOf('#');  
    
    // check to see if selector is a Class name
    if(klass > -1){
      element.attributes.class = selector.replace(".", '');
    }
    // check ot see if selector is an ID name
    else if(id > -1){
      element.attributes.id = selector.replace("#", '');
    }
    // else id is the string...
    else {
      element.attributes.id = selector;
    }

    return element;
  },
  serializeElement: function(element){
    var attributes = [],
        children = [],
        text = [];

    if(element.attributes.length > 0){
      for(var index = 0; index < element.attributes.length; index++){
        var attribute = element.attributes[index];
        attributes[index] = this.serializeAttribute(attribute);
      }
    }
    
    if(element.childNodes.length > 0){
      for(var index = 0; index < element.children.length; index++){
        var child = element.children[index];
        
        if(child.nodeType === 1){
          children[index] = this.serializeElement(child);
        }

        if(child.nodeType === 3){
          text.push(child.textContent);
        }
        
      }
    }

    return {
      tag: element.tagName.toLowerCase(),
      attributes: attributes,
      children: children,
      text: element.innerText
    };
  },
  serializeAttribute: function(attribute){
    var a = {};
    
    a[attribute.name] = attribute.value;

    return a;
  },
  createBrTag: function(){
    br = document.createElement('br');
    br.setAttribute('type', '_moz');

    return br;
  },
  indexOfEditor: function(editorElement, editorsArray){
    for(var index = 0; index < editorsArray.length; index++) {
      if(editorsArray[index] === editorElement){
        return index;
      }
    }

    // if not found...
    return -1;
  },
  removePlaceholder: function(element){
    var editor = this.editor,
        placeholderClass = editor.options.placeholderClass;
        placeholder = element.getElementsByClassName(placeholderClass)[0];

    if(placeholder){
      var br = editor.helpers.createBrTag();

      element.removeChild(placeholder);
      element.appendChild(br);
      document.execCommand('formatBlock', false, element.tagName.toLowerCase());

      sibling = element.previousElementSibling;

      if(sibling && sibling.className.indexOf(editor.options.normalizerClass) > -1){
        sibling.classList.remove(editor.options.normalizerClass);
      }
    }
    return element;
  },
  removePlaceholderTwo: function(element){
    var editor = this.editor;

    if(element.className.indexOf(editor.options.placeholderClass) > -1){
      var parentElement = element.parentElement
          br = editor.helpers.createBrTag();

      parentElement.removeChild(element);
      parentElement.appendChild(br);
      document.execCommand('formatBlock', false, parentElement.tagName.toLowerCase());

      //  
    }
    return element;
  },
};