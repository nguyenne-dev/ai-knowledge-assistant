import fs from 'fs';
import path from 'path';
import { KnowledgeChunk } from '../repositories/vector.repository.js';

export class KnowledgeLoader {
  private knowledgeDir: string;

  constructor(customPath?: string) {
    if (customPath) {
      this.knowledgeDir = customPath;
    } else {
      // Check multiple candidate locations for knowledge directory
      const candidates = [
        path.resolve(process.cwd(), 'knowledge'),
        path.resolve(process.cwd(), '../knowledge'),
        path.resolve(process.cwd(), '../../knowledge'),
      ];

      const found = candidates.find((dir) => fs.existsSync(dir));
      this.knowledgeDir = found || path.resolve(process.cwd(), '../knowledge');
    }

    console.log(`📂 [KnowledgeLoader] Targeting directory: ${this.knowledgeDir}`);
  }

  /**
   * Scans and loads all markdown documents, splitting into semantic section chunks.
   */
  async loadDocuments(): Promise<{ chunks: KnowledgeChunk[]; filesCount: number }> {
    if (!fs.existsSync(this.knowledgeDir)) {
      throw new Error(`Knowledge directory not found at: ${this.knowledgeDir}`);
    }

    const files = fs
      .readdirSync(this.knowledgeDir)
      .filter((file) => file.endsWith('.md'));

    const chunks: KnowledgeChunk[] = [];

    for (const fileName of files) {
      const filePath = path.join(this.knowledgeDir, fileName);
      const content = fs.readFileSync(filePath, 'utf-8');

      const fileChunks = this.splitIntoChunks(content, fileName);
      chunks.push(...fileChunks);
    }

    console.log(`📄 [KnowledgeLoader] Loaded ${files.length} files, generated ${chunks.length} semantic chunks.`);
    return {
      chunks,
      filesCount: files.length,
    };
  }

  /**
   * Splits markdown text by H2 sections ("## "), preserving contextual headers.
   */
  private splitIntoChunks(fileContent: string, fileName: string): KnowledgeChunk[] {
    const lines = fileContent.split('\n');
    let documentTitle = fileName;
    const sections: { sectionName: string; lines: string[] }[] = [];

    let currentSection = 'Tổng quan';
    let currentLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        documentTitle = trimmed.replace('#', '').trim();
        continue;
      }

      if (trimmed.startsWith('## ')) {
        if (currentLines.length > 0) {
          sections.push({ sectionName: currentSection, lines: [...currentLines] });
          currentLines = [];
        }
        currentSection = trimmed.replace('##', '').trim();
        continue;
      }

      currentLines.push(line);
    }

    if (currentLines.length > 0) {
      sections.push({ sectionName: currentSection, lines: [...currentLines] });
    }

    // Convert sections into chunks with rich metadata
    const chunks: KnowledgeChunk[] = [];
    let chunkIndex = 0;

    for (const sec of sections) {
      const bodyText = sec.lines.join('\n').trim();
      if (!bodyText) continue;

      // Construct a chunk content that explicitly embeds document & section context
      const fullChunkContent = `[Tài liệu: ${documentTitle}] - [Chuyên mục: ${sec.sectionName}]\n${bodyText}`;

      chunks.push({
        content: fullChunkContent,
        source: fileName,
        section: sec.sectionName,
        chunkIndex: chunkIndex++,
      });
    }

    return chunks;
  }
}

export const knowledgeLoader = new KnowledgeLoader();
