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
        if (this.children.length === 0) return;

        for (const c of this.children)
        {
            this.remove(c);
        }
    }
}


export const pane = new IPane();
