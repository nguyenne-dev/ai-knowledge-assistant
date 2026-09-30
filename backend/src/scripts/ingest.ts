import { ingestionService } from '../services/ingestion.service.js';

async function main() {
  console.log('========================================================');
  console.log('🤖 Tech-Fashion Knowledge Ingestion CLI');
  console.log('========================================================');

  const startTime = Date.now();
  const result = await ingestionService.runPipeline();
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (result.status === 'success') {
    console.log('========================================================');
    console.log('✅ Ingestion Pipeline COMPLETED SUCCESSFULLY!');
    console.log(`📁 Files processed:   ${result.filesProcessed}`);
    console.log(`🧩 Chunks indexed:     ${result.chunksIndexed}`);
    console.log(`📦 Qdrant Collection: ${result.collection}`);
    console.log(`⏱️ Duration:          ${duration}s`);
    console.log('========================================================');
    process.exit(0);
  } else {
    console.error('========================================================');
    console.error('❌ Ingestion Pipeline FAILED!');
    console.error(`Error: ${result.error}`);
    console.error('========================================================');
    process.exit(1);
  }
}

main();
