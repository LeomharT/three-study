import { Pane } from "tweakpane";

class IPane extends Pane
{
    constructor()
    {
        super();

        this.title = 'Debug Params';
    }


    public clear()
    {
        for (const c of this.children)
        {
            this.remove(c);
        }
    }
}


export const pane = new IPane();
