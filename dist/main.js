"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
class MyPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading MyPlugin');
            this.addCommand({
                id: 'extract-links',
                name: 'Extract Links to References',
                callback: () => this.extractLinks(),
            });
        });
    }
    extractLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeFile = this.app.workspace.getActiveFile();
            if (!activeFile)
                return;
            const fileContent = yield this.app.vault.read(activeFile);
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const headingRegex = /^(#+)\s+/gm;
            let match;
            const links = [];
            let highestHeadingLevel = 6; // Default to the lowest heading level
            // Find all links
            while ((match = linkRegex.exec(fileContent)) !== null) {
                links.push(match[0]);
            }
            // Find the highest heading level
            while ((match = headingRegex.exec(fileContent)) !== null) {
                const level = match[1].length;
                if (level < highestHeadingLevel) {
                    highestHeadingLevel = level;
                }
            }
            if (links.length === 0)
                return;
            const referenceHeading = '#'.repeat(highestHeadingLevel) + ' References';
            // const referenceSection = `\n${referenceHeading}\n` + links.join('\n') + '\n';
            let referenceSection = '';
            // iterate through the links and add them to the reference section
            for (const link of links) {
                referenceSection += `- ${link}\n`;
            }
            const newContent = fileContent + `\n${referenceHeading}\n` + referenceSection;
            yield this.app.vault.modify(activeFile, newContent);
        });
    }
    onunload() {
        console.log('Unloading MyPlugin');
    }
}
exports.default = MyPlugin;
