/**
 * Auditor Dashboard API Demo
 * Demonstrates how to use the Auditor Dashboard API
 */

const API_BASE_URL = 'http://localhost:3001';

async function demonstrateAuditorDashboardAPI() {
  console.log('\n🔍 MeeChain Auditor Dashboard API Demo\n');
  console.log('='.repeat(50));

  try {
    // 1. Check API health
    console.log('\n1️⃣ Checking API health...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ API Status:', healthData.status);
    console.log('📅 Timestamp:', healthData.timestamp);

    // 2. Get all refund logs
    console.log('\n2️⃣ Fetching all refund logs...');
    const logsResponse = await fetch(`${API_BASE_URL}/api/logs`);
    const logsData = await logsResponse.json();
    console.log(`✅ Found ${logsData.data.length} refund logs`);
    console.log('\nSample log:');
    console.log(JSON.stringify(logsData.data[0], null, 2));

    // 3. Search for a specific address
    console.log('\n3️⃣ Searching for logs by address...');
    const searchQuery = '0x883A';
    const searchResponse = await fetch(`${API_BASE_URL}/api/logs/search/${searchQuery}`);
    const searchData = await searchResponse.json();
    console.log(`✅ Found ${searchData.data.length} logs matching "${searchQuery}"`);

    // 4. Get a specific log by ID
    console.log('\n4️⃣ Getting specific log by ID...');
    const refundId = 'ref_abc123';
    const logResponse = await fetch(`${API_BASE_URL}/api/logs/${refundId}`);
    const logData = await logResponse.json();
    console.log(`✅ Retrieved log: ${logData.data.refundId}`);
    console.log(`   Status: ${logData.data.status}`);
    console.log(`   Amount: ${logData.data.amount} BNB`);

    // 5. Filter logs by date range
    console.log('\n5️⃣ Filtering logs by date range...');
    const startDate = '2025-10-18T00:00:00.000Z';
    const endDate = '2025-10-19T23:59:59.000Z';
    const filterResponse = await fetch(
      `${API_BASE_URL}/api/logs/filter/date?startDate=${startDate}&endDate=${endDate}`
    );
    const filterData = await filterResponse.json();
    console.log(`✅ Found ${filterData.data.length} logs in date range`);

    // 6. Flag a suspicious log
    console.log('\n6️⃣ Flagging a suspicious log...');
    const flagPayload = {
      refundId: 'ref_abc123',
      reason: 'Suspicious transaction pattern - multiple refunds from same address',
      flaggedBy: '0x1234567890abcdef1234567890abcdef12345678',
    };
    const flagResponse = await fetch(`${API_BASE_URL}/api/logs/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flagPayload),
    });
    const flagData = await flagResponse.json();
    console.log('✅ Log flagged successfully!');
    console.log(`   Flag ID: ${flagData.data.id}`);
    console.log(`   Flagged at: ${flagData.data.flaggedAt}`);

    // 7. Get all flags
    console.log('\n7️⃣ Retrieving all flags...');
    const flagsResponse = await fetch(`${API_BASE_URL}/api/flags`);
    const flagsData = await flagsResponse.json();
    console.log(`✅ Found ${flagsData.data.length} total flags`);

    // 8. Get flags for a specific refund
    console.log('\n8️⃣ Getting flags for specific refund...');
    const refundFlagsResponse = await fetch(`${API_BASE_URL}/api/flags/${refundId}`);
    const refundFlagsData = await refundFlagsResponse.json();
    console.log(`✅ Found ${refundFlagsData.data.length} flags for ${refundId}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Demo completed successfully!');
    console.log('\n📖 Key Features Demonstrated:');
    console.log('   • API health check');
    console.log('   • Retrieve all refund logs');
    console.log('   • Search logs by address/hash');
    console.log('   • Get specific log details');
    console.log('   • Filter logs by date range');
    console.log('   • Flag suspicious transactions');
    console.log('   • Retrieve flags');
    console.log('\n🎯 Next Steps:');
    console.log('   • Visit http://localhost:5173/auditor-dashboard to see the UI');
    console.log('   • Configure Discord webhook in .env for notifications');
    console.log('   • Export logs to CSV from the dashboard');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Make sure the API server is running:');
    console.error('   npm run server\n');
  }
}

// Run the demo
demonstrateAuditorDashboardAPI();
