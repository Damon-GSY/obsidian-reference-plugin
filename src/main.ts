import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
    async onload() {
        console.log('Loading MyPlugin');

        this.addCommand({
            id: 'extract-links',
            name: 'Extract Links to References',
            callback: () => this.extractLinks(),
        });
    }

    async extractLinks() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return;

        const fileContent = await this.app.vault.read(activeFile);
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

        if (links.length === 0) return;

        const referenceHeading = '#'.repeat(highestHeadingLevel) + ' References';
        // const referenceSection = `\n${referenceHeading}\n` + links.join('\n') + '\n';

        let referenceSection = '';
        // iterate through the links and add them to the reference section
        for (const link of links) {
            referenceSection += `- ${link}\n`;
        }


        const newContent = fileContent + `\n${referenceHeading}\n` + referenceSection;

        await this.app.vault.modify(activeFile, newContent);
    }

    onunload() {
        console.log('Unloading MyPlugin');
    }
}

