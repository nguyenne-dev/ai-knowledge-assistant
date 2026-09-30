import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeLoader } from './knowledge.loader.js';

describe('KnowledgeLoader Test Suite', () => {
  it('should scan and load all markdown files from knowledge base', async () => {
    const { chunks, filesCount } = await knowledgeLoader.loadDocuments();

    assert.ok(filesCount >= 4, `Expected at least 4 markdown files, got ${filesCount}`);
    assert.ok(chunks.length > 0, `Expected chunks to be generated, got ${chunks.length}`);

    // Check chunk structure and metadata
    const sampleChunk = chunks[0];
    assert.ok(sampleChunk.content, 'Chunk content should not be empty');
    assert.ok(sampleChunk.source.endsWith('.md'), 'Source should be a markdown filename');
    assert.ok(sampleChunk.section, 'Section should be populated');
    assert.equal(typeof sampleChunk.chunkIndex, 'number');

    // Verify context header injection
    assert.ok(
      sampleChunk.content.includes('[Tài liệu:'),
      'Chunk content should include document context tag'
    );
    assert.ok(
      sampleChunk.content.includes('[Chuyên mục:'),
      'Chunk content should include section category tag'
    );
  });
});
