var intro = new WaatEditor('#intro', {
  startingTags: {
    div: {
      attributes: {
        id: "interview-number"
      },
      placeholder: "#"
    },
    h1: {
      placeholder: "Start with a title..."
    },
    p: {
      placeholder: "Write the intro..."
    }
  }
});

intro.elements[0].addEventListener('keydown', function(e){
  if(e.which === 13){
    e.preventDefault();
    var sel = document.getSelection(),
        sibling = intro.helpers.getSelectionStart().nextElementSibling,
        range = document.createRange();

    if(sibling){
      range.selectNode(sibling);
      sel.removeAllRanges();
      sel.addRange(range);
      intro.previousSibling = sibling;
    }
    else {
      var editorElements = document.getElementsByClassName(intro.options.container.attributes.class),
          index = intro.helpers.indexOfEditor(this, editorElements);

      if(editorElements[index + 1]) {
        var nextEditor = editorElements[index +1];

        nextEditor.focus();

        window.scrollTo(0, nextEditor.getBoundingClientRect().top);
      }

    }
  }
});

intro.elements[0].addEventListener('keyup', function(e){
  if(intro.previousSibling){
    intro.helpers.removePlaceholder(intro.previousSibling);
  }
});

var interview = new WaatEditor('.editable', {
  startingTags: {
    'h2': {
      placeholder: 'Start with a question...'
    }
  },
  mainmenuButtons: {
    blockquote: {
      action: function(){
        var selection = interview.helpers.getSelectionStart(),
            parent = selection.parentNode,
            content = selection.innerHTML,
            blockquote = document.createElement('blockquote'),
            span = document.createElement('span');

            blockquote.innerHTML = content;
            blockquote.appendChild(span);
            parent.insertBefore(blockquote, selection);
            parent.removeChild(selection);
      }
    }
  }
});

interview.elements[0].addEventListener('focus', function(e){
  var self = this;
  setTimeout(function(){

    var selection, range, editorElement, firstElement;

    selection = document.getSelection();
    range = document.createRange();   
    editorElement = self;
    firstElement = editorElement.children[0];
  

    if(selection){
      // range.selectNode(firstElement);
      // selection.removeAllRanges();
      // selection.addRange(range);
      
      intro.helpers.removePlaceholder(firstElement);  
    }
  }, 10)
});

(function($){
  $(function(){
    $('#interview-number').text('17');
  });
})(jQuery);
