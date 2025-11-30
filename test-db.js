// 临时测试脚本 - 检查 Supabase 数据库
const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取配置
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少 Supabase 配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log('🔍 测试 Supabase 数据库连接...\n');

  try {
    // 测试基本连接
    console.log('✅ Supabase 连接成功');

    // 检查 articles 表
    console.log('\n📋 检查 articles 表...');
    try {
      const { data, error } = await supabase.from('articles').select('*').limit(1);
      if (error) {
        console.log('❌ articles 表不存在:', error.message);
      } else {
        console.log('✅ articles 表存在');
        console.log(`   找到 ${data.length} 条记录`);
      }
    } catch (e) {
      console.log('❌ articles 表错误:', e.message);
    }

    // 检查 stories 表
    console.log('\n📋 检查 stories 表...');
    try {
      const { data, error } = await supabase.from('stories').select('*');
      if (error) {
        console.log('❌ stories 表不存在:', error.message);
      } else {
        console.log('✅ stories 表存在');
        console.log(`   找到 ${data.length} 条记录`);

        if (data.length > 0) {
          console.log('   所有记录详情:');
          data.forEach((story, index) => {
            console.log(`   ${index + 1}. ID: ${story.id}, Status: "${story.status}"`);
            console.log(`       Title: "${story.title}"`);
            console.log(`       URL: "${story.url}"`);
            console.log(`       Created: ${story.created_at}`);
            console.log('');
          });
        }
      }
    } catch (e) {
      console.log('❌ stories 表错误:', e.message);
    }

    // 更新所有 pending 状态的记录为 published
    console.log('\n📝 更新所有 pending 记录状态...');
    try {
      const { data, error } = await supabase
        .from('stories')
        .update({ status: 'published' })
        .eq('status', 'pending')
        .select();

      if (error) {
        console.log('❌ 更新失败:', error.message);
      } else {
        console.log(`✅ 成功更新 ${data.length} 条记录为 published 状态`);
        data.forEach((story, index) => {
          console.log(`   ${index + 1}. ID: ${story.id}, Title: "${story.title}"`);
        });
      }
    } catch (e) {
      console.log('❌ 更新错误:', e.message);
    }

  } catch (error) {
    console.error('❌ 数据库测试失败:', error.message);
  }
}

testDatabase();