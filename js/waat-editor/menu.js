WaatEditor.Menu = function(editor){
  this.init(editor);
}

WaatEditor.Menu.prototype = {
  init: function(editor){
    this.editor = editor;
    this.menu = this.createMenu();
  },
  createMenu: function(){
    var buttons,
        menu;

   buttons = this.generateButtons();
   menu = document.createElement('div');

   menu.classList.add('Waat-Editor-menu');
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
    buttons = editor.options.mainmenuButtons;

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
          document.execCommand('insertHTML', false, tag);
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
        selection = {
          rect: this.editor.currentSelection[0].getBoundingClientRect(),
          element: this.editor.helpers.getSelectionStart()
        },
        editor = this.editor.helpers.getEditorElement(selection.element).getBoundingClientRect(),
        style = this.menu.style,
        top = selection.rect.top,
        left,
        right,
        margin = 10;


    left = (selection.rect.left + (selection.rect.width/2)) - (menu.width/2);
    right = (selection.rect.right - (selection.rect.width/2)) + (menu.width/2);

    // Set upper menu position
    if(menu.height > top){
      top = top + selection.rect.height + margin;
    }
    else {
      top = top - (menu.height + margin);
    }

    // Set left and right boundries
    if(0 > left){
      left = 0;
    }
    else if(window.innerWidth < right) {
      left = window.innerWidth - menu.width;
    }

    style.visibility = 'visible';
    style.top = top + "px";
    style.left = left + "px";
  },
  deactivate: function(){
    var editor = this.editor,
        menu = this.menu;

    menu.style.visibility = 'hidden';
  }
}