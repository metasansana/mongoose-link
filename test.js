import must from 'must';
import link from './index';
import Promise from 'bluebird';

var docs;
var doctors;
var numbers;
var test;
var model = {
  find(q) {
   test(q);
   return {
     lean() {
       return {
        exec() {
          return new Promise(function(res,rej) {
            res(doctors);
          });
        }
      }
    }
  }
}
}

describe('link', function() {


  beforeEach(function (){
    numbers = [];
    docs = undefined;
    test = undefined;
    doctors = [
    {name:'Dr. A',number:23},
    {name:'Dr. B',number:2},
    {name:'Dr. C',number:124},
    {name:'Dr. D',number:3},
    {name:'Dr. E',number:24},
    {name:'Dr. E',number:29}];
  });

  it('should work with single value fields', function () {

    docs = [{id:4,doctor:23},{id:34,doctor:3},{id:7,doctor:124},{id:6,doctor:23},{id:9,doctor:2}];
    numbers = docs.map(doc=>doc.doctor);
    test = (q)=>must(q.$in).eql(docs.map(doc=>doc.doctor));

    return link(model, 'doctor:number')(docs).
    then(function (newDocs){
      must(docs===newDocs).be(true);
      docs.forEach((doc,i)=>{must(docs[i].doctor.number).eql(numbers[i])});
    });

  });

  it('should work with multi value fields', function() {

    docs = [
    {id:4,doctor:[23,3]},
    {id:34,doctor:[3,7,3]},
    {id:7,doctor:[23,4,9]},
    {id:6,doctor:[23]}];

    numbers = docs.map(doc=>doc.doctor);
    test = (q)=>must(q.$in).eql([].concat.apply([],docs.map(doc=>doc.doctor)));

    return link(model, 'doctor:number')(docs).
    then(function (newDocs){
      must(docs===newDocs).be(true);
      docs.forEach((doc,i)=> {
        must(doc.doctor).eql(numbers[i])
      });
    });


  });

});



