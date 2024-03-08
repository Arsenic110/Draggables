function makeDraggable(draggables)
{
    try
    {
        Array.prototype.forEach.call(draggables, (d) =>
        {
            d.style.backgroundColor = "#171717";
            d.style.position = "fixed";
            d.style.zIndex = 999;

            d.style.margin = "1rem";
            d.style.border = "2px solid #373737";
            d.style.padding = "1rem";

            d.style.whiteSpace = "nowrap";
        });
    }
    catch
    {   //if 'd' is not a HTMLObject, that means the draggables object isnt a collection.
        console.log("Failed to apply style - ensure HTMLCollection is passed as parameter.");
        return;
    }

    //allow parsing HTMLCollections
    draggables = Array.from(draggables);

    //start index of 444 - purely arbitrarily high enough
    window.drag = {};
    window.drag.zTop = 444;

    //an offset of 15 is needed for some reason? On my screen, anyway.
    window.drag.offset = 15;
    
    draggables.forEach((dragDiv) =>
    {
        dragDiv.addEventListener("mousedown", (event) =>
        {
            let initX, initY, mousePressX, mousePressY, mouseOldX, mouseOldY, momentumX, momentumY;

            if (!event.target.classList.contains("drag"))
                return true;    //if any child of the div is clicked, preserve default click behavior

            //register initial div offsets
            initX = event.target.offsetLeft;
            initY = event.target.offsetTop;
            
            //move clicked div to top
            event.target.style.zIndex = ++window.drag.zTop;

            //get mouse position
            mousePressX = event.clientX;
            mousePressY = event.clientY;

            mouseOldX = event.clientX;
            mouseOldY = event.clientY;


            let repositionElement = (event) =>
            {   //an offset of 15 is needed for some reason?
                dragDiv.style.left = initX + event.clientX - window.drag.offset - mousePressX + 'px';
                dragDiv.style.top = initY + event.clientY - window.drag.offset - mousePressY + 'px';

                momentumX = event.clientX - mouseOldX;
                momentumY = event.clientY - mouseOldY;

                mouseOldX = event.clientX;
                mouseOldY = event.clientY;

                console.log(`mX: ${momentumX}, mY: ${momentumY}`);
            }

            let throwElement = (speed) =>
            {
                
            }

            //global so if the mouse moves outside of the div's X/Y in one frame, the effect is still preserved
            window.addEventListener("mousemove", repositionElement, false);
            window.addEventListener("mouseup", (event) => 
            {   //remove the mousemove event - we do not need it firing once the mouse is up
                window.removeEventListener("mousemove", repositionElement, false);
            }, { once: true }); //this needs to be fired specifically only once

            //because this click was valid, we want to deny default click behavior
            event.preventDefault();
        });
    });
}