import must from 'must';
import {
    sync
}
from './index';
import Promise from 'bluebird';

var docs;
var doctors;
var numbers;
var test;
var model = {
    find(q) {
        return {
            lean() {
                return {
                    exec() {
                        return new Promise(function(res, rej) {
                            res(doctors);
                        });
                    }
                };
            }
        }
    }
}

describe('sync', function() {


    beforeEach(function() {
        numbers = [];
        docs = undefined;
        test = undefined;
        doctors = [{
            name: 'Dr. 23',
            number: 23
        }, {
            name: 'Dr. 2',
            number: 2
        }, {
            name: 'Dr. 124',
            number: 124
        }, {
            name: 'Dr. 3',
            number: 3
        }, {
            name: 'Dr. 7',
            number: 7
        }, {
            name: 'Dr. 24',
            number: 24
        }, {
            name: 'Dr. 29',
            number: 29
        }];
    });

    it('should work with single value fields', function() {

        docs = [{
            id: 4,
            doctor: 23
        }, {
            id: 34,
            doctor: 3
        }, {
            id: 7,
            doctor: 124
        }, {
            id: 6,
            doctor: 23
        }, {
            id: 9,
            doctor: 2
        }];

        numbers = docs.map(doc => doc.doctor);

        return sync(model, 'doctor:number')(docs).
        then(function(result) {
            result.forEach((doc, i) => {
                must(doc.doctor.number).eql(numbers[i])
            });
        });

    });

    it('should work with multi value fields', function() {

        docs = [{
            id: 4,
            doctor: [23, 3]
        }, {
            id: 6,
            doctor: [23]
        }, {
            id: 34,
            doctor: [3, 3]
        }, {
            id: 7,
            doctor: [23, 7, 7]
        }];

        numbers = docs.map(doc => doc.doctor);

        return sync(model, 'doctor:number')(docs).
        then((result) => {

            result.forEach((doc, i) => {
                doc.doctor.forEach((doctor, ii) => {
                    must(doctor.number).eql(numbers[i][ii])
                });
            });

        });
    });

    it('should work when mixed', function() {

        docs = [{
                id: 4,
                doctor: [23, 3]
            }, {
                id: 6,
                doctor: 23
            }, {
                id: 6,
                doctor: 7
            },
            {
                id: 34,
                doctor: [3, 3]
            }, {
                id: 7,
                doctor: [23, 7, 7]
            }
        ];

        numbers = docs.map(doc => doc.doctor);

        return sync(model, 'doctor:number')(docs).
        then((result) => {

            result.forEach((doc, i) => {
                if (Array.isArray(doc.doctor)) {
                    doc.doctor.forEach((doctor, ii) => {
                        must(doctor.number).eql(numbers[i][ii])
                    });
                } else {
                    must(doc.doctor.number).eql(numbers[i]);
                }
            });

        });
    })

});
