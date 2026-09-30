import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config/index.js';

async function inspectDatabase() {
  console.log('========================================================');
  console.log('🔍 QDRANT CLUSTER DATABASE INSPECTOR');
  console.log(`🌐 Cluster URL: ${config.qdrant.url}`);
  console.log(`📦 Collection:  ${config.qdrant.collection}`);
  console.log('========================================================\n');

  try {
    const client = new QdrantClient({
      url: config.qdrant.url,
      apiKey: config.qdrant.apiKey || undefined,
    });

    // 1. Get collection information
    const collectionInfo = await client.getCollection(config.qdrant.collection);
    console.log(`📊 Trạng thái Collection: ${collectionInfo.status}`);
    console.log(`🔢 Tổng số bản ghi (Points): ${collectionInfo.points_count ?? collectionInfo.indexed_vectors_count}`);
    console.log(`📐 Kích thước Vector: ${collectionInfo.config.params.vectors?.size ?? 3072} chiều\n`);

    // 2. Scroll and fetch stored records
    const scrollResult = await client.scroll(config.qdrant.collection, {
      limit: 20,
      with_payload: true,
      with_vector: false, // Don't print 3072 numbers to keep it readable
    });

    console.log('📋 DANH SÁCH CÁC ĐOẠN DỮ LIỆU ĐANG LƯU TRONG QDRANT:');
    console.log('--------------------------------------------------------');

    scrollResult.points.forEach((point, index) => {
      const p = point.payload as any;
      console.log(`\n📌 [Point #${index + 1}] ID: ${point.id}`);
      console.log(`   📂 File nguồn:  ${p.source}`);
      console.log(`   🔖 Chuyên mục:  ${p.section}`);
      console.log(`   📝 Nội dung trích xuất:`);
      const preview = String(p.content || '').split('\n').map((l: string) => `      ${l}`).join('\n');
      console.log(preview);
    });

    console.log('\n========================================================');
    console.log('✅ Đã kiểm tra xong toàn bộ cơ sở dữ liệu Qdrant!');
    console.log('========================================================');
  } catch (error: any) {
    console.error('❌ Lỗi khi đọc Qdrant:', error.message || error);
  }
}

inspectDatabase();
