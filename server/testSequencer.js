const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Run non-socket tests before socket tests to avoid timeout conflicts
    return tests.sort((testA, testB) => {
      // Always run socket integration tests last
      if (testA.path.includes('socket')) return 1;
      if (testB.path.includes('socket')) return -1;
      
      // Standard sorting for other tests
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;