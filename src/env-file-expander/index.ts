import {BuilderContext, createBuilder} from '@angular-devkit/architect';
import {Builder} from '@angular-devkit/architect/src/internal';
import {getSystemPath, JsonObject, normalize} from '@angular-devkit/core';
import dotenv from 'dotenv';
import * as fs from 'node:fs';
import path from 'node:path';

const placeholderRegex = /\{\{(.*?)\}\}/g;

interface FileMapping extends JsonObject {
    source: string,
    target: string
}

const getFilePath = (filePath: string, basePath: string): string => {
    if (path.isAbsolute(filePath)) {
        return getSystemPath(normalize(filePath));
    }
    return getSystemPath(normalize(`${basePath}/${filePath}`));
};

const expandVariables = async (
    context: BuilderContext, env: any, basePath: string, fileMapping: FileMapping) => {
    const sourceFilePath: string = getFilePath(fileMapping.source, basePath);
    const targetFilePath: string = getFilePath(fileMapping.target, basePath);

    try {
        const sourceFileContent = fs.readFileSync(sourceFilePath, 'utf-8') as string;

        const resultChunks = [];
        let lastIndex = 0;

        for (const match of sourceFileContent.matchAll(placeholderRegex)) {
            const [fullMatch, key] = match;
            const matchStart = match.index;

            // Add the text before the current match
            resultChunks.push(sourceFileContent.slice(lastIndex, matchStart));

            // Perform the async file check
            if (env.hasOwnProperty(key)) {
                const envValue = env[key] as string;
                if (envValue.startsWith('file:')) {
                    const fileContent = (fs.readFileSync(getFilePath(envValue.split('file:')[1], basePath),
                        'utf-8') as string)
                        .replace('\\', '\\\\')
                        .replace(/\n/g, ' ') // Replace newlines with a space
                        .replace(/"/g, '\\"') // Escape double quotes
                        .replace(/'/g, '\\\''); // Escape single quotes
                    resultChunks.push(fileContent);
                } else {
                    resultChunks.push(envValue); // Keep the original placeholder if not a file
                }
            } else {
                resultChunks.push(fullMatch); // Keep the original placeholder if no replacement
            }
            // Update the last index to be the end of the current match
            lastIndex = matchStart! + fullMatch.length;
        }
        // Add any remaining text after the last match
        resultChunks.push(sourceFileContent.slice(lastIndex));

        // Join all chunks to form the final result
        const targetFileContent = resultChunks.join('');
        /*const targetFileContent = sourceFileContent.replace(placeholderRegex, async (match, key) => {
         if (env.hasOwnProperty(key)) {

         }

         fs.access(filePath, fs.constants.F_OK, (err) => {
         if (err) {
         callback(false);
         } else {
         callback(true);
         }
         });

         return env.hasOwnProperty(key) ? env[key] : match;
         });*/
        fs.writeFile(targetFilePath, targetFileContent, 'utf8', (err) => {
            if (err) {
                throw err
            }
        });
    } catch (error: any) {
        context.logger.error('Error expanding values: ' + error, {sourceFilePath, targetFilePath, error});
    }
};

interface Options extends JsonObject {
    files: FileMapping[]
}

const builder: Builder<Options> = createBuilder(async (options: Options, context: BuilderContext) => {
    context.logger.info('Running EnvFileExpander');
    const basePath: string = getSystemPath(normalize(context.workspaceRoot));
    dotenv.config({
        path: normalize(`${basePath}/.env`),
        override: true
    });
    const env = process.env;
    if (!!options.files && options.files.length > 0) {
        for (let i = 0; i < options.files.length; i++) {
            await expandVariables(context, env, basePath, options.files[i]);
        }
    } else {
        context.logger.info('No files for processing...');
    }
    return {
        success: true
    }
});

export default builder;