import { FnInfo } from '../model/FnInfo';
import { ESFileInfo } from '../model/ESFileInfo';
import * as path from 'path';
const babylon = require("babylon");
export class ESFileAnalyzer{
  public static analyseESFile(content: string, filePath: string): ESFileInfo | null {
    try {
      let doc = babylon.parse(content, {
        allowImportExportEverywhere: true, allowReturnOutsideFunction: true, plugins: [
          // enable jsx and flow syntax
          "typescript", "estree", "jsx", "flow", "objectRestSpread"
        ]
      });

      if (!doc.program.body) {
        return null;
      }
      let isMagixPage: boolean = false;
      let magixTmpl: string = '';
      let methodList = new Array<FnInfo>();
      doc.program.body.forEach((declarationItem: any) => {
        if (declarationItem.type === 'ExportDefaultDeclaration' || declarationItem.type === 'ExpressionStatement') {
          let argumentArr;

          if (declarationItem.type === 'ExportDefaultDeclaration' &&
            declarationItem.declaration &&
            declarationItem.declaration.arguments) {
            //ts写法
            argumentArr = declarationItem.declaration.arguments;
          } else if (declarationItem.type === 'ExpressionStatement' &&
            declarationItem.expression &&
            declarationItem.expression.right &&
            declarationItem.expression.right.arguments
          ) {
            //js写法
            argumentArr = declarationItem.expression.right.arguments;
          }
          if (argumentArr) {
            argumentArr.forEach((argument: any) => {
              if (argument.type === 'ObjectExpression') {
                if (argument.properties) {
                  argument.properties.forEach((prop: any) => {
                    if (prop.type === 'Property') {

                      if (prop.method || (prop.value && prop.value.type === 'FunctionExpression')) {
                        let fnInfo: FnInfo = new FnInfo();
                        fnInfo.fnName = prop.key.name ? prop.key.name : prop.key.value;
                        fnInfo.startColumn = prop.loc.start.column;
                        fnInfo.endColumn = prop.loc.end.column;
                        fnInfo.startLine = prop.loc.start.line;
                        fnInfo.endLine = prop.loc.end.line;
                        methodList.push(fnInfo);
                      } else {
                        if (prop.key.name === 'tmpl') {
                          isMagixPage = true;
                          magixTmpl = prop.value.value;
                        }
                      }
                    }
                  });
                }
              }
            });
          }

        }

      });
      if (isMagixPage && magixTmpl !== '') {
        let info: ESFileInfo = new ESFileInfo();
        info.htmlPath = path.join(path.dirname(filePath), magixTmpl.substr(1));;
        info.path = filePath;
        info.functions = methodList;
        return info;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}