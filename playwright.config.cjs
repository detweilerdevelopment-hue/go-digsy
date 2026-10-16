module.exports = {
  testDir: '.',
  testMatch: 'owl.spec.cjs',
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  webServer: {
    command: 'python -m http.server 4173 --directory dist',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 15000,
    stdout: 'ignore',
    stderr: 'ignore'
  },
  use: { browserName: 'chromium', headless: true, channel: 'chrome' }
};
