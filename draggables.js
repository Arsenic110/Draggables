function makeDraggable(draggables)
{
    try
    {
        Array.prototype.forEach.call(draggables, (d) =>
        {
            d.style.position = "fixed";
            d.style.zIndex = 999;
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

    window.drag.momentum = { speed:1, spaceFriction: 0.8, wallFriction: 0.7 };
    
    draggables.forEach((dragDiv) =>
    {
        dragDiv.addEventListener("mousedown", (event) =>
        {
            let initX, initY, mousePressX, mousePressY, mouseOldX, mouseOldY, momentumX = 0, momentumY = 0;

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

                console.log();
            }

            let throwElement = (speed) =>
            {
                let box = dragDiv.getBoundingClientRect();
                let bounds = { x: 0, y: 0, width: document.body.scrollWidth, height: window.innerHeight }

                //check for collision
                if(box.x < 0 & momentumX < 0)
                {
                    momentumX *= -window.drag.momentum.wallFriction;
                    momentumY *= window.drag.momentum.wallFriction;
                }
                if(box.y < 0 & momentumY < 0)
                {
                    momentumY *= -window.drag.momentum.wallFriction;
                    momentumX *= window.drag.momentum.wallFriction;
                }
                if(box.x + box.width > bounds.x + bounds.width - 5 && momentumX > 0)
                {
                    momentumX *= -window.drag.momentum.wallFriction;
                    momentumY *= window.drag.momentum.wallFriction;
                }
                if(box.y + box.height > bounds.y + bounds.height && momentumY > 0)
                {
                    momentumY *= -window.drag.momentum.wallFriction;
                    momentumX *= window.drag.momentum.wallFriction;
                }

                //make the window flow in the direction it was thrown in
                dragDiv.style.left = Number(dragDiv.style.left.split("px")[0]) + momentumX * speed + "px";
                dragDiv.style.top = Number(dragDiv.style.top.split("px")[0]) + momentumY * speed + "px";

                //rinse and repeat, until we reach some lower bound too small to matter
                if(speed > 0.01)
                    setTimeout(() => {throwElement(speed * window.drag.momentum.spaceFriction)}, 10);
            }

            //global so if the mouse moves outside of the div's X/Y in one frame, the effect is still preserved
            window.addEventListener("mousemove", repositionElement, false);
            window.addEventListener("mouseup", (event) => 
            {   //remove the mousemove event - we do not need it firing once the mouse is up
                window.removeEventListener("mousemove", repositionElement, false);
                throwElement(window.drag.momentum.speed);
            }, { once: true }); //this needs to be fired specifically only once

            //because this click was valid, we want to deny default click behavior
            event.preventDefault();
        });
    });
}