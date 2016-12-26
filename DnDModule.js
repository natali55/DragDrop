"use strict";
var DnDModule = (function(){
  //private variables and methods go here
  var exports;
      //is constrained by external block
  var isConstrained = false,
      //ability to came back to the firs position
      ableToReverse = false,
      dropZone = null,
      notAllowedArr =null,
      constrainElement = null,
      
      elementToAppend = document.body;
  //object with drag&drop data and methods
  var dragObject = {};
  var createDraggedElement = function(e) {
          //to remember an old position 
          //to be able back to it
      var draggedElement = dragObject.element;
      var old = {
        parent: draggedElement.parentNode,
        nextSibling: draggedElement.nextSibling,
        position: draggedElement.position || '',
        left: draggedElement.left || '',
        top: draggedElement.top || '',
        zIndex: draggedElement.zIndex || '',
        display: draggedElement.display || ''
      };
  
      // rollback function for canceling dragging
      draggedElement.rollback = function() {
        console.log(draggedElement.parentNode+"J!");
        old.parent.insertBefore(draggedElement, old.nextSibling);
        draggedElement.style.position = old.position;
        draggedElement.style.left = old.left;
        draggedElement.style.top = old.top;
        draggedElement.style.zIndex = old.zIndex;
        draggedElement.style.display = old.display
      };
  
      return draggedElement;
      
  };
  var getCoords = function(elem) {
      var box = elem.getBoundingClientRect();
  
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
  };
  var startDrag = function (e) {
      var draggedElement = dragObject.draggedElement;
  
      //check if it is constrained
      if (isConstrained) {
        //find constrain element with class "drag-constrain"
        var parent = e.target.parentNode;
        for(parent; parent.nodeName !='BODY'; parent = parent.parentNode ) {
          //console.log(parent);
          if (hasClass(parent, "drag-constrain")){
            //elementToAppend = parent;
            constrainElement = parent;
            parent.style.position = 'relative';
            break;
          }
        }
        
      }
       console.log(elementToAppend);
       elementToAppend.appendChild(draggedElement);
      draggedElement.style.zIndex = 9999;
      draggedElement.style.position = 'absolute';
  };
  
  var endDrag = function (e) {
      var dropElement = findDroppable(e);
      console.log(dropElement);
      if (!dropElement) {
        if(ableToReverse) {
          onDragCancel(dragObject);
        }
      } 
       else {
         dropZone = dropElement;
         onDragEnd(dragObject, dropElement);
       }
  };
  var findDroppable = function(event) {
      //hide draggedElement to be able to see element under it
      var elem
      dragObject.draggedElement.hidden = true;
      dragObject.draggedElement.style.zIndex = -5;
  
      //receive the element under the cursor
      elem = document.elementFromPoint(event.clientX, event.clientY);
      //show draggedElement again
      dragObject.draggedElement.hidden = false;
      dragObject.draggedElement.style.zIndex = 9999;
  
      if (elem == null) {
        //it is possible when cursor is outsite the window
        return null;
    }
    if (hasClass(elem,"droppable")) {
      return elem;
    }
    return false;
  };
  var onDragCancel = function(dragObject) {
      dragObject.draggedElement.rollback();
  };
  var onDragEnd = function (dragObject, dropElement){
    console.log(isElenemtInArr(dragObject.draggedElement.nodeName,notAllowedArr));
    if(isParent(dropZone,constrainElement) || !isConstrained){
      if (!(notAllowedArr && isElenemtInArr(dragObject.draggedElement.nodeName,notAllowedArr)) ){
      console.log("DRAGEND");
      dropElement.appendChild(dragObject.draggedElement);
      dragObject.draggedElement.style.position = "";
      dragObject.draggedElement.style.zIndex = "0";
      } else {
        onDragCancel(dragObject);
      }

    } else {
      dragObject.draggedElement.rollback();
    }

  };
  var hasClass = function (el, className) {
      if (el.classList)
        return el.classList.contains(className)
      else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  };

  var addClass = function (el, className) {
      if (el.classList)
        el.classList.add(className)
      else if (!hasClass(el, className)) el.className += " " + className
  };

  var removeClass = function (el, className) {
      if (el.classList)
        el.classList.remove(className)
      else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className=el.className.replace(reg, ' ')
      }
  };
  var isParent = function (child, parent){
                if (child.parentNode && parent) {
                var elParent = child.parentNode;
                for(elParent; elParent.nodeName !='BODY'; elParent = elParent.parentNode ) {
                if(elParent==parent) {
                  return true;
                }  
              }
      }
      return false;
  };
  var isElenemtInArr = function(el, arr) {
    if(arr) {
           var str = arr.join(" ");
    el = el.toString().toLowerCase();
    console.log(el);
    return str.indexOf(el)!=-1? true: false;
       } else {
       return false}
    
  };
  
  //here go public methods
  exports = {
    
    Draggable: function() {
      return {
        onMouseDown: function(e) {
              if (e.which != 1) return;
              
              //check if clicked element is draggable
              var element = e.target.closest('.draggable');
              if (!element) return;

              dragObject.element = element;

              // remember the position of clicked element 
              dragObject.downX = e.pageX;
              dragObject.downY = e.pageY;
              console.log(dragObject.element);
              return false;
        },
        
        onMouseMove: function(e) {
              //element hasn't been clamped
              if (!dragObject.element) return;
              //cancel native method
              dragObject.element.ondragstart = function() {
                return false;
              };
              
              //draggedElement - element, that will be dragged. It is 
              //better to create some clone of an element. But I will use
              //the same element (dragObject.element)
              
              //check if drag hasn't started
              if (!dragObject.draggedElement) {
                var moveX = e.pageX - dragObject.downX;
                var moveY = e.pageY - dragObject.downY;
                
                //create the copy of an element
                dragObject.draggedElement = createDraggedElement(e);
                if (!dragObject.draggedElement) {
                  dragObject = {};
                  return;
                }
        
                //the copy of an element created successfully
                //create properties shiftX/shiftY - the shifts of
                //cursor relative to the corner of the element
                var coords = getCoords(dragObject.draggedElement);
                dragObject.shiftX = dragObject.downX - coords.left;
                dragObject.shiftY = dragObject.downY - coords.top;
                // show start dragging
                startDrag(e);
            }
              //move the element with the cursor
             dragObject.draggedElement.style.left = e.pageX - dragObject.shiftX + 'px';
             dragObject.draggedElement.style.top = e.pageY - dragObject.shiftY + 'px';
            if (constrainElement) {
              var conLeft = constrainElement.offsetLeft;
              var conTop = constrainElement.offsetTop;
              var conWidth = constrainElement.offsetWidth;
              var conHeight = constrainElement.offsetHeight;
              var dragWidth = dragObject.draggedElement.offsetWidth;
              var dragHeight = dragObject.draggedElement.offsetHeight;
              if(e.pageX+dragWidth-dragObject.shiftX > (conLeft+conWidth)) {
                dragObject.draggedElement.style.left = conLeft + conWidth - dragWidth + 'px';
              }
              if((e.pageX-dragWidth+dragObject.shiftX) < conLeft){
                dragObject.draggedElement.style.left = conLeft + 'px';
              }
              if((e.pageY-dragHeight+dragObject.shiftY) < conTop){
                dragObject.draggedElement.style.top = conTop + 'px';
              }
              
              if(e.pageY+dragHeight-dragObject.shiftY > (conTop+conHeight)) {
                dragObject.draggedElement.style.top = conTop + conHeight -  dragHeight + 'px';
              }
              //console.log(e.pageX+dragWidth-dragObject.shiftX);
            };
             return false;
              
          },
          
        makeConstrained: function(param){
          if(param) {
            isConstrained = true;
          }
        },
        makeReversable: function(param) {
            if(param) {
            ableToReverse = true;
          }
        }
        
        
      };
    },
    
    Droppable: function(){
      var exports;
      exports = {
        onMouseUp: function(e){
              //if dragging
              if (dragObject.draggedElement) {
                endDrag(e);
              }
              
              //clean the dragObject with information about Drag&Drop
              dragObject = {};
        },
        notAllowedElements: function() {
          // notAllowedArr = [];
          // for(var i=0, i<arguments.length, i++){
          //   notAllowedArr[i]=arguments[i];
          // };
          notAllowedArr = [];
          var j;
          for (j=0; j <arguments.length; j++ ) {
            notAllowedArr[j]=arguments[j];
          }
          console.log(notAllowedArr);
          
        }
        
      };
      return exports;
    }
    
  };
  return exports;
}());
