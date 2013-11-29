/*jshint expr: true*/ 

describe('Timeline', function () {
  it('should create a timeline object', function () {
    Timeline.startup({
      project_id: 1
    });
  });
});

describe('Planning Element', function(){
  before(function(){
    this.peEmpty = Factory.build("PlanningElement");

    this.peWithDates = Factory.build("PlanningElement", {
      "start_date": "2012-11-11",
      "due_date": "2012-11-10"
    });
  });

  describe('is', function () {
    it('should return true for pes', function () {
      expect(Timeline.PlanningElement.is(this.peWithDates)).to.be.true;
    });

    it('should return false for non-pes', function () {
      expect(Timeline.PlanningElement.is({})).to.be.false;
    });
  });

  describe('children', function () {
    before(function () {
      this.peWithNameA = Factory.build("PlanningElement", {
        name: "A"
      });

      this.peWithNameB = Factory.build("PlanningElement", {
        name: "B"
      });

      this.peWithNameC = Factory.build("PlanningElement", {
        name: "C"
      });

      this.peWithChildren = Factory.build("PlanningElement", {
        planning_elements: [this.peWithDates, this.peEmpty, this.peWithNameC, this.peWithNameA, this.peWithNameB]
      });
    });

    describe('getChildren', function () {
      it('should return sorted children', function () {
        var children = this.peWithChildren.getChildren();
        expect(children).to.deep.equal([this.peEmpty, this.peWithNameA, this.peWithNameB, this.peWithNameC, this.peWithDates]);
      });

      it('should sort children by date');
      it('should sort children by name if date is equal');

      it('should return empty list', function () {
        expect(this.peWithDates.getChildren()).to.be.empty;
      });
    });

    describe('hasChildren', function () {
      it('should return false for hasChildren if children list undefined');
      it('should return false for hasChildren if children list empty');
      it('should return true for hasChildren if children exist');
    });
  });

  describe('hide', function () {
    it('should always return false', function () {
      expect(this.peEmpty.hide()).to.be.false;
    });
  });

  describe('getProject', function () {
    it('should be null by default', function () {
      expect(this.peEmpty.getProject()).to.be.null;
    });
    it('should be the set project otherwise', function () {
      var pe = Factory.build("PlanningElement", {
        project: "TestProjekt"
      });
      expect(pe.getProject()).to.equal("TestProjekt");
    });
  });

  describe('filtered out', function () {
    it('should only be filtered if project is filtered');
    it('should cache the result even if filter changes');
  });

  describe('responsible', function () {
    it('should get the responsible');
    it('should allow get of responsible name');
    it('should return undefined if responsible or responsible name are not set');
  });

  describe('assignee', function () {
    it('should allow get of assignee name');
    it('should return undefined if assignee or assignee name are not set');
  });

  describe('historical', function () {
    it('empty should have no historical', function () {
      expect(this.peEmpty.has_historical()).to.be.false;
      expect(this.peEmpty.historical()).to.deep.equal({});
    });

    it('empty should have no alternate dates', function () {
      expect(this.peWithDates.hasAlternateDates()).to.be.falsy;
    });

    it('historical should have correct alternate dates', function () {
      peWithHistorical = Factory.build("PlanningElement", {
        historical_element: this.peWithDates
      });

      expect(peWithHistorical.hasAlternateDates()).to.be.true;
      expect(peWithHistorical.alternate_start().getTime()).to.equal(1352588400*1000);
      expect(peWithHistorical.alternate_end().getTime()).to.equal(1352502000*1000);
    });
  });

  describe('getAttribute', function () {
    it('should return object value of object.parameter');
    it('should return function value of object.parameter');
  });

  describe('start() and end()', function(){
    it('should return date object', function(){
      expect(this.peWithDates.start()).to.be.an.instanceof(Date);
      expect(this.peWithDates.end()).to.be.an.instanceof(Date);
      expect(this.peWithDates.hasStartDate()).to.be.true;
      expect(this.peWithDates.hasEndDate()).to.be.true;
      expect(this.peWithDates.hasBothDates()).to.be.true;
      expect(this.peWithDates.hasOneDate()).to.be.true;
    });

    it('should return correct date', function () {
      expect(this.peWithDates.start().getTime()).to.equal(1352588400*1000);
      expect(this.peWithDates.end().getTime()).to.equal(1352502000*1000);
    });

    it('should return undefined for no date' , function () {
      expect(this.peEmpty.start()).to.not.exist;
      expect(this.peEmpty.end()).to.not.exist;

      expect(this.peEmpty.hasStartDate()).to.be.false;
      expect(this.peEmpty.hasEndDate()).to.be.false;
      expect(this.peEmpty.hasBothDates()).to.be.false;
      expect(this.peEmpty.hasOneDate()).to.be.false;
    });

    it('should return end date for start() if no end date is set and is milestone');
    it('should return start date for end() if no start date is set and is milestone');
  });
});