import { create } from "domain";
import { MarkdownRenderChild } from "obsidian";


export class MarkdownChild extends MarkdownRenderChild {
    
  
    rows: string[];
    el: HTMLElement;
    
    constructor(el: HTMLElement, text: string[]) {
      super(el);
  
      this.rows = text;
      this.el=el;
    }
  
    onload() {
        const pages=this.el.createEl("div",{cls: "pages"});
        const page=pages.createEl("div",{cls: "page"});
        const column=page.createEl("div",{cls: "columnWrapper"});
        var currentPage=page;
        var currentColumn=column;

        for (let i = 0; i < this.rows.length; i++) {
            var row=this.rows[i];
            if(row.charAt(0)=='#'){
                headersCreation(row,currentColumn);
            }else if(row.contains("<ul>")){
                var listArr=[];
                var rowCount=0;

                for (let j = i; j < this.rows.length; j++) {
                    const row = this.rows[j];
                    if(row.contains("</ul>")){
                        listArr.push(row);
                        break;
                    }
                    listArr.push(row);
                    rowCount=rowCount+1;
                }
                i=i+rowCount
                listCreation(listArr,currentColumn);

            }else if(row.contains("<table>")){
                var tableArr=[];
                var rowCount=0;
            	for (let j = i; j < this.rows.length; j++) {
                    if(this.rows[j].contains("</table>")){
                        tableArr.push(this.rows[j]);

                        break;
                    }
                    tableArr.push(this.rows[j]);
                    rowCount=rowCount+1;
                }
                i=i+rowCount
                tableCreation(tableArr,currentColumn);

            }else if(row.contains("//page")) {
                currentPage=pages.createEl("div",{cls:"page"})
            }else if(row.contains("//column")) {
                currentColumn=currentPage.createEl("div",{cls:"columnWrapper"})
            }else if(row.contains("<img")){
                const attributArr=getAttributes(row);
                const src=attributArr[0];
                const style=attributArr[1];
                currentColumn.createEl("img",{attr:{"style":style,"src":src}
            })
            console.log(row.indexOf("src="))
            }else{
                paragraphCreation(row,currentColumn);
            }
            
        }
  
    }
}


function listCreation(rows:string[],containerEl:HTMLElement):void{
    var ulContainer=containerEl.createEl("ul");

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if(row.charAt(0)=='-'){
            if(row.contains("*")){
                var liContainer=ulContainer.createEl("li");
                textConversion(row.substring(1),liContainer);
            }else{

                ulContainer.createEl("li",{text:row.substring(1)});
            }
        }
        
    }


}

function getAttributes(row:string):string[]{
    var ret:string[]=[];

    const regex = /".+?"/gm;

    const matches=row.match(regex);
    matches?.forEach(match =>{
        const finalText=match.substring(1,match.length-1);
        ret.push(finalText);
    })
    return ret;
}

function tableCreation(rows:string[],containerEl:HTMLElement):void{
    var currentContainer=containerEl;
    var currentTableContainer=containerEl;
    var currentRow=containerEl;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if(row.contains("<table>")){
         currentTableContainer = currentContainer.createEl("table",{cls:"table"})
        }

        if(row.contains("<tbody>")){
            currentContainer=currentTableContainer.createEl("tbody",{cls:"tbody"})
        }if(row.contains("<thead>")) {
            currentContainer=currentTableContainer.createEl("thead",{cls:"thead"})
        }

         if(row.contains("<th")&&!row.contains("<thead>")){
            var clas=["th"]
            if(row.contains("class=left")){
                clas.push("left");
            }
            else if(row.contains("class=right")){
                clas.push("right");
            }
            else if(row.contains("class=center")){
                clas.push("center");
            }
            var source="";
            var counter=0;
                for (let j = i; j < rows.length; j++) {
                    if(rows[j].contains("</th>")){
                        source=source+rows[j];
                        break;
                    }
                    source=source+rows[j];
                    counter=counter+1;
                }
            const regex = />.+</g;
            const found = source.match(regex);
            const finalText=found?.at(0);   
            currentRow.createEl("th",{text:finalText!==undefined?finalText.substring(1,finalText.length-1):" ",cls:clas});        
        }
         if(row.contains("<td")){
            var clas=["td"]
            if(row.contains("class=left")){
                clas.push("left");
            }
            else if(row.contains("class=right")){
                clas.push("right");
            }
            else if(row.contains("class=center")){
                clas.push("center");
            }
            var source="";
            var counter=0;
                for (let j = i; j < rows.length; j++) {
                    if(rows[j].contains("</td>")){
                        source=source+rows[j];
                        break;
                    }
                    source=source+rows[j];
                    counter=counter+1;
                }
            const regex = />.+</;
            const found = source.match(regex);   
            const finalText=found?.at(0);
            currentRow.createEl("td",{text:finalText!==undefined?finalText.substring(1,finalText.length-1):" ",cls:clas})
                  
        } 
        if(row.contains("<tr>")) {
            currentRow= currentContainer.createEl("tr",{cls:"tr"})
        }
        

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
	
	//TODO:Add more headers
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
    if(row.contains('*')){
        textConversion(row,containerEl);
    }else{
        containerEl.createEl("p",{text:row});
    }
}

function textConversion(row:string,containerEl: HTMLElement):void{        
    if(row.contains("***")){
        const firstIndex=row.indexOf("***");
        const lastIndex=row.lastIndexOf("***");
        if(firstIndex!=lastIndex){
            const rowArr= row.split("***");
            for (let i = 0; i < rowArr.length; i++) {
                if(i%2==1){
                  const boldContainer=containerEl.createEl("b");
                  boldContainer.createEl("i",{text:rowArr[i]});      
                }else{
                    containerEl.createEl("var",{text:rowArr[i]})
                }
            }
        }else{
            containerEl.createEl("p",{text:row});
        }
    }else if(row.contains("**")){
        const firstIndex=row.indexOf("**");
        const lastIndex=row.lastIndexOf("**");
        if(firstIndex!=lastIndex){
            const rowArr= row.split("**");
            for (let i = 0; i < rowArr.length; i++) {
                if(i%2==1){
                  containerEl.createEl("b",{text:rowArr[i]});      
                }else{
                    containerEl.createEl("var",{text:rowArr[i]})
                }
            }
        }else{
            containerEl.createEl("p",{text:row});
        }
        
    }else if(row.contains("*")){
        const firstIndex=row.indexOf("*");
        const lastIndex=row.lastIndexOf("*");
        if(firstIndex!=lastIndex){
            const rowArr= row.split("*");
            for (let i = 0; i < rowArr.length; i++) {
                if(i%2==1){                 
                  containerEl.createEl("i",{text:rowArr[i]});      
                }else{
                 containerEl.createEl("var",{text:rowArr[i]})
                }
            }
        }else{
            containerEl.createEl("p",{text:row});
        }

    }else{
     console.log("ETERNAL ERROR; SHUTDOWN ALL SYSTEMS")  
    }
            
            
        
}

