import {window,commands} from 'vscode';
import { Command } from './command';

import * as fs from 'fs';
import * as path from 'path';
import * as fut from './utils/file-utils';
import * as parse5 from 'parse5';
const babylon = require("babylon");

export class Initializer{
   test(params:string) {
    commands.getCommands(true);
    let fileList:Array<string> = [];
    let rootPath =fut.FileUtils.getProjectPath(undefined);
    this.listFiles(rootPath,fileList);
    console.info(fileList);
    fileList.forEach((filePath)=>{
      let extName = path.extname(filePath);
      if(extName === '.html'){
      let content = fs.readFileSync(filePath,'UTF-8');
      let document:parse5.Document =  parse5.parse(content,{scriptingEnabled:false, sourceCodeLocationInfo:true});
      
      console.info(document);
      }
      else if(extName === '.ts' || extName === '.js'){
        console.info(filePath);
        let content = fs.readFileSync(filePath,'UTF-8');
        try {
          let doc = babylon.parse(content,{allowImportExportEverywhere:true,allowReturnOutsideFunction:true});
        } catch (error) {
          console.log(error);
        }
       
       
      }
    });
    console.log('done');
  }
  listFiles(parentPath:string,fileList:Array<string>){
    let files = fs.readdirSync(parentPath);
    
    files.forEach((item)=>{
      item = path.join(parentPath,item);
      let stat = fs.statSync(item);
      if(stat.isFile()){
        fileList.push(item);
      }else if(stat.isDirectory()){
        this.listFiles(item,fileList);
      }
    });
   
  }
  init(){
    // setInterval(()=>{
    //   Command.MM.push('ttt');
    // },1000);
    this.test('');
  }
}