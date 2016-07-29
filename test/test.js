beforeEach(function beforeEachSetup() {
  console.log("sinon before test-case");
    this.sandbox = global.sinon.sandbox.create();
    global.stub = this.sandbox.stub.bind(this.sandbox);
    global.spy = this.sandbox.spy.bind(this.sandbox);
});

afterEach(function afterEachSetup() {
  console.log("sinon clean-up after test-case");
    delete global.stub;
    delete global.spy;
    this.sandbox.restore();
});
