import typescript from 'typescript';
import type { PluginConfig } from 'ttypescript/lib/PluginCreator';

interface ReplacePathsPluginConfig extends PluginConfig {
    replaceImportPaths?: {
        [pattern: string]: string;
    }
}

const transformer = (_: typescript.Program, config: ReplacePathsPluginConfig) => (transformationContext: typescript.TransformationContext) => (sourceFile: typescript.SourceFile) => {
    const replaceImportPaths = normalizeReplaceImportPaths(config);

    function visitNode(node: typescript.Node): typescript.VisitResult<typescript.Node> {
        if (typescript.isImportDeclaration(node)
            && typescript.isStringLiteral(node.moduleSpecifier)) {
            const oldPath = node.moduleSpecifier.text;
            for (const [regexp, replacement] of replaceImportPaths) {
                const newPath = oldPath.replace(regexp, replacement);
                if (oldPath !== newPath) {
                    const newModuleSpecifier = typescript.createStringLiteral(newPath) as typescript.StringLiteral & { singleQuote: boolean };
                    newModuleSpecifier.singleQuote = node.moduleSpecifier.getText(sourceFile)[0] === '\'';
                    const newNode = typescript.getMutableClone(node);
                    newNode.moduleSpecifier = newModuleSpecifier;
                    return newNode;
                }
            }
        }
        return typescript.visitEachChild(node, visitNode, transformationContext);
    }

    return typescript.visitNode(sourceFile, visitNode);
};

function normalizeReplaceImportPaths({ replaceImportPaths }: ReplacePathsPluginConfig) {
    const ret = new Map<RegExp, string>();
    if (typeof replaceImportPaths === 'object' && replaceImportPaths !== null) {
        for (const [pattern, replacement] of Object.entries(replaceImportPaths)) {
            ret.set(new RegExp(pattern), String(replacement));
        }
    }
    return ret;
}

export default transformer;
