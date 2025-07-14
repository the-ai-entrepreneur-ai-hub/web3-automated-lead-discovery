const puppeteer = require('puppeteer');
const { runAllScrapers } = require('./src/services/scrapers');
const { enrichLead } = require('./src/services/enrichment');
const { analyzeLead } = require('./src/services/ai');
const { createLead } = require('./src/services/airtable');

const run = async () => {
  console.log('🚀 Starting the lead generation pipeline...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log('📊 Running all scrapers...');
    const allProjects = await runAllScrapers();
    console.log(`📈 Found ${allProjects.length} total projects from all sources.`);

    // Filter valid projects
    const validProjects = allProjects.filter(project => 
      project.Website && project.Website !== 'N/A'
    );
    console.log(`✅ ${validProjects.length} projects have valid websites and will be processed.`);

    let processedCount = 0;
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const project of validProjects) {
      try {
        processedCount++;
        console.log(`\n[${processedCount}/${validProjects.length}] Processing: ${project['Project Name']} (${project.Source})`);
        
        // Enrichment step
        console.log('  🔍 Enriching with LinkedIn and email data...');
        const enrichedLead = await enrichLead(project, browser);
        console.log(`  ✅ Enrichment complete - LinkedIn: ${enrichedLead.LinkedIn ? '✓' : '✗'}, Email: ${enrichedLead.Email ? '✓' : '✗'}`);
        
        // AI Analysis step
        console.log('  🤖 Analyzing with AI...');
        const analyzedLead = await analyzeLead(enrichedLead);
        
        // Check if AI analysis was successful
        if (analyzedLead['Lead Summary'] && !analyzedLead['Lead Summary'].startsWith('Error')) {
          console.log('  ✅ AI analysis complete');
          
          // Create in Airtable
          console.log('  💾 Saving to Airtable...');
          await createLead(analyzedLead);
          console.log(`  ✅ Successfully saved: ${project['Project Name']}`);
          successCount++;
        } else {
          console.log(`  ⚠️  Skipping ${project['Project Name']} - AI analysis failed`);
          skipCount++;
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to process ${project['Project Name']}:`, error.message);
        errorCount++;
      }
    }

    // Final summary
    console.log('\n📊 Pipeline Summary:');
    console.log(`  Total projects found: ${allProjects.length}`);
    console.log(`  Valid projects: ${validProjects.length}`);
    console.log(`  Successfully processed: ${successCount}`);
    console.log(`  Skipped (AI failed): ${skipCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log(`  Success rate: ${((successCount / validProjects.length) * 100).toFixed(1)}%`);
    
  } finally {
    await browser.close();
    console.log('\n🏁 Lead generation pipeline completed.');
    process.exit(0);
  }
};

run().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});