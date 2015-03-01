function WaatEditor(elements, options){ 
  elements = typeof elements !== 'undefined' ? elements : null;

  options = typeof(options) !== 'undefined' && typeof(options) === 'object' ? options : {};

  return this.init(elements, options);
}

WaatEditor.prototype = {
  init: function(elements, options){
    this.helpers = new WaatEditor.helpers(this);
    this.setupOptions(options);
    this.setupElements(elements);
    this.initializeEditable();   
    this.events = new WaatEditor.Events(this);
    this.menu = new WaatEditor.Menu(this);
    this.sidemenu = new WaatEditor.Sidemenu(this);
  },
  defaults: {
    normalizerClass: 'WaatEditor-normalizer',
    placeholderText: 'Start Typing Here.',
    placeholderClass: 'WaatEditor-placeholder',
    startingTagClass: 'WaatEditor-starting-tag',
    container: {
      tag: 'section',
      attributes: {
        class: 'WaatEditor'
      }
    },
    startingTags: {
      'h1': {
        placeholder: 'Start with a title...'
      }
    },
    mainmenuButtons: {
      'p': {
        tag: 'p'
      },
      'h1': {
        tag: 'h1'
      },
      'quote': {
        tag: 'blockquote'
      },
      'aside': {
        tag: 'aside'
      }
    },
    sidemenuButtons: {
      'p': {
        tag: 'p'
      }
    }
  },
  setupElements: function(elements){
    var self = this;

    if(!elements || typeof(elements) === 'undefined'){
      elements = [self.createEditable()];
    }

    if(typeof(elements) === 'string'){
      var selectors = elements,
          arrOfEls = document.querySelectorAll(selectors);

      if(arrOfEls.length > 0){
        elements = arrOfEls;
      }

      else {
        selectors = selectors.split(',');
        elements = [];
        for(var index in selectors){
          var selector = self.helpers.checkSelector(selectors[index]);
          elements[index] = self.createEditable(selector);
        }
      }
    }

    if(elements.constructor === Array){
      for(var index in elements){
        if(typeof(elements[index]) === 'object' && !elements[index].nodeType){
          elements[index] = self.createEditable(elements[index]);
        }

        else if(typeof(elements[index]) === 'string') {
          var selector = self.helpers.checkSelector(elements[index]);
          elements[index] = self.createEditable(selector);
        }
      }
    }

    if(typeof(elements) === 'object'){
      if(!elements.length) {
        elements = [self.createEditable(elements)];  
      }
      else if(elements.length === 0){
        elements = [self.createEditable(self.options.container)];
      }
    }

    if(elements.nodeType === 1) {
      elements = [elements];
    }

    self.elements = elements;
  },
  createEditable: function(element){
    element = typeof(element) !== 'undefined' ? element : null;

    var editable,
        options = this.options,
        tag,
        attributes;

    if(element){
      tag = element.tag;
      attributes = element.attributes;
    }
    else {
      tag = options.container.tag;
      attributes = options.container.attributes;
    }

    editable = document.createElement(tag);

    for(var index in attributes){
      if(index === 'class'){
        editable.classList.add(attributes[index]);
      }
      else{
        editable.setAttribute(index, attributes[index]);  
      }
    }

    document.body.appendChild(editable);

    return editable;
  },
  setupOptions: function(options){
    this.options = this.helpers.merge(options, this.defaults);
    return this;
  },
  initializeEditable: function(){
    var self = this,
        length = self.elements.length,
        currentElement;

    for(index = 0; index < length; index++){
      var currentElement = this.elements[index];

      currentElement.setAttribute('contenteditable', 'true');
      currentElement.setAttribute('data-placeholder', self.defaults.placeholderText);
      currentElement.classList.add(self.options.container.attributes.class);

      self.initializeContent(currentElement);
      self.initializeEventListeners(currentElement);
    }
  },
  initializeContent: function(element){
    var firstNode,
        startingTags;
    
    firstNode = element.childNodes[0];
    startingTags = this.options.startingTags;

    for(var tag in startingTags){
      var placeholder,
          newTag;

      startingTags[tag].tag = tag;

      if(startingTags[tag] === '') {
        startingTags[tag].placeholder = this.helpers.createBrTag();
      }
      else {
        startingTags[tag].placeholder = this.createPlaceholder(tag, startingTags[tag].placeholder);
      }
      
      tag = this.createTag(startingTags[tag]);
      element.insertBefore(tag, firstNode);
    };
    
    if(firstNode){
      element.removeChild(firstNode);  
    }    
  },
  createPlaceholder: function(tag, placeholderText){
    var text = document.createTextNode(placeholderText);

    placeholder = document.createElement('span');
    placeholder.appendChild(text);
    placeholder.className = this.options.placeholderClass;
    placeholder.setAttribute('data-placeholder', placeholderText);
    placeholder.addEventListener('click', function(e){
      this.parentNode.removeChild(this);
    });

    return placeholder;
  },
  createTag: function(tag){
    var self = this,
        newTag;

    if(placeholder === undefined){
      placeholder = "";
    }

    newTag = document.createElement(tag.tag),
    newTag.appendChild(tag.placeholder);

    for(var key in tag.attributes){
      newTag.setAttribute(key, tag.attributes[key]);
    }

    newTag.classList.add(self.options.startingTagClass);

    newTag.addEventListener('click', function(e){
      var placeholders = this.getElementsByClassName(self.options.placeholderClass),
          brs = this.getElementsByTagName('br');

      if(placeholders && brs.length === 0){
        var br = self.helpers.createBrTag();

        this.appendChild(br);
      }
      while(placeholders[0]){

        this.removeChild(placeholders[0]);
      }
    });

    return newTag;
  },
  initializeEventListeners: function(element){
    var self = this;

    element.addEventListener('click', function(e){
      self.events.elementClickEvent(e);
    });
    element.addEventListener('focus', function(e){
      self.events.elementFocusEvent(e);
    });
    element.addEventListener('blur', function(e){
      self.events.elementBlurEvent(e);
    });
    element.addEvent
    element.addEventListener('keydown', function(e){
      self.events.elementKeydownEvent(e);
    });
    element.addEventListener('keyup', function(e){
      self.events.elementKeyupEvent(e);
    });
    element.addEventListener('mouseup', function(e){
      self.events.elementMouseupEvent(e);
    });
  }
};