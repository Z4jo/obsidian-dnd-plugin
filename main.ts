import { create } from 'domain';
import { App, Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!


export default class MyPlugin extends Plugin {


   async onload() {

		this.registerMarkdownCodeBlockProcessor("dnd",(source,el,ctx)=>{
			const rows = source.split("\n").filter((row)=>row.length>0)

			const container=el.createEl("div",{cls: "page"});

			rows.forEach((row)=>{
				if(row.charAt(0)=='#'){
					headersCreation(row,container);
				// }else if(row.contains('*')){
				// 	//TODO:impl bold and italic
				// }else if(row.charAt(0)=='<'){
				// 	//TODO:impl tables
				}else{
					paragraphCreation(row,container);
				}
			})
			
		})

	}

	onunload() {
	}

}

function headersCreation(row:string,containerEl: HTMLElement):void{
	
	let counter=0;
	const chars = [...row];
	chars.forEach((c,i)=>{
		if(c=='#'){
			counter=counter+1;
		}
	})


	const tmp="h"+ counter;
	
	//TODO:CSS
	if(tmp==="h1"){
		containerEl.createEl("h1",{text:row.slice(1)})
	}else if(tmp==="h2"){
		containerEl.createEl("h2",{text:row.slice(2)})
	}else if(tmp==="h3"){
		containerEl.createEl("h3",{text:row.slice(3)})
	}else{
		containerEl.createEl("h4",{text:row.slice(4)})
	}
}

function paragraphCreation(row:string,containerEl: HTMLElement):void{
	containerEl.createEl("p",{text:row});
}