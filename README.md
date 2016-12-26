Drag & Drop
html:
      IF you want to make your elements draggable, just add slass draggable
class="draggable"
      If you want to constrain your drag zone, add class drag-constrain to the element
      which contain draggable elements
class="drag-constrain"
      If you want to have a place for drop the elements, add class
      droppable to the element
class="droppable"

JS:
    1 You have to add function hendlers to the mouse events,
      like in this exapmle:
        //connect the following modules
        var draggable = DnDModule.Draggable();
        var droppable = DnDModule.Droppable();
        //use the functions hendlers
        var onMouseDown = draggable.onMouseDown;
        var onMouseMove = draggable.onMouseMove;
        var onMouseUp = droppable.onMouseUp;
        //add them to mouse events
        document.onmousedown = onMouseDown;
        document.onmousemove = onMouseMove;
        document.onmouseup = onMouseUp;
    2 If you have class="drag-constrain", then make your dragging
      constrained (make it true):
      //default false;
draggable.makeConstrained(true); 
    3 If you want your elements to be reversable (back into
      first position), then make it true
      //default false;
draggable.makeReversable(true);
    4  If you want some elements to be not allowed in drop area :
      add those elements (string tag names, separated by comma)
droppable.notAllowedElements("span", "div");

ATTENTION:
If you have a constrain element, please, make sure that your 
droppable element is inside drag-constrain element

If you want to have drop area - it is necessary to set 
(to prevent unpredictable results)
draggable.makeReversable(true);

Good luck with Dran&Drop.
If you have any ideas how to make it better 
write on email natashamekh55@gmail.com :)



      