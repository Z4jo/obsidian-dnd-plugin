
import {  Plugin } from "obsidian";
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";
import {MarkdownChild} from './markdownChild'

export default class ExamplePlugin extends Plugin {


   async onload() {
		
		this.registerMarkdownCodeBlockProcessor("dnd",(source,el,ctx)=>{
			const rows = source.split("\n").filter((row)=>row.length>0)
			ctx.addChild(new MarkdownChild(el,rows))
			
		})

	}

	onunload() {
	}

}


//TODO: long strings needs fix