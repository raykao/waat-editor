WaatEditor.Sidemenu = function(editor){
  this.init(editor);
}

WaatEditor.Sidemenu.prototype = {
  init: function(editor){
    this.editor = editor;
    this.menu = this.createMenu();
  },
  createMenu: function(){
    var buttons,
        menu;

   buttons = this.generateButtons();
   menu = document.createElement('div');

   menu.classList.add('Waat-Editor-sidemenu');
   menu.appendChild(buttons);  
   
   document.body.appendChild(menu);
   
   return menu;
  },
  generateButtons: function() {
    var editor = this.editor,
        ul,
        buttons,
        li;

    ul = document.createElement('ul');
    buttons = editor.options.sidemenuButtons;

    for(var buttonName in buttons){
      var button;

      button = buttons[buttonName];

      if(!button.label){
        button.label = buttonName;
      }

      if(!button["class"]){
        button["class"] = [];
      }

      if(typeof(button["class"]) === "string"){
        button["class"] = button["class"].split(", ");
      }

      button["class"] = editor.helpers.cleanArray(button["class"]);

      li = this.createButton(button);

      ul.appendChild(li);
    }

    return ul;
  },
  createButton: function(button){
    var self = this,
        editor = self.editor,
        tag,
        text,
        li;

    tag = button.tag;
    text = document.createTextNode(button.label);
    li = document.createElement('li');
    
    li.appendChild(text);
    
    for(var attribute in button){
      li.setAttribute('data-waat-' + attribute, button[attribute]);
    }

    li.addEventListener('click', function(e){
      var selection = editor.currentSelection[0].commonAncestorContainer.parentElement;
      editor.helpers.restoreSelection(editor.currentSelection);

      if(typeof(button.action) === "function"){
        button.action();
      }
      else {
        if(selection.tagName === tag){
          document.execCommand('formatBlock', false, 'p');
          selection = editor.helpers.currentSelection();
          for(var index in button["class"]){
            selection.classList.remove(button["class"][index]);
          }
        }
        else{
          document.execCommand('formatBlock', false, tag);
          selection = editor.helpers.currentSelection();
          for(var index in button["class"]){
            selection.classList.add(button["class"][index]);
          }
        } 
      }

      self.deactivate();
    });

    return li;
  },
  activate: function(){
    var menu = this.menu.getBoundingClientRect(),
        selection = document.getSelection().anchorNode.getBoundingClientRect(),
        selectionElement = document.getSelection().anchorNode.parentElement,
        style = this.menu.style,
        top = selection.top - (Math.abs(selection.height - menu.height)/2),
        left,
        right,
        margin = 10;

    left = selection.left - menu.width - margin;

    style.visibility = 'visible';
    style.top = top + "px";
    style.left = left + "px";
  },
  deactivate: function(){
    var editor = this.editor,
        menu = this.menu;

    menu.style.visibility = 'hidden';
  },
  on: function(){
    this.activate();
  },
  off: function(){
    this.deactivate();
  },
}