const {default: RefCounter} = require('../out/util/ref-counter');
const assert = require('assert');

describe('ref counter', () => {

    it('should add and remove refs',()=>{
        const refCounter = new RefCounter();
        const key = 'key';
        
        const firstAdd = refCounter.actOnFirst(key, ()=>1, ()=>2);
        const firstRef = refCounter.topicRefMap.get(key);
        const secondAdd = refCounter.actOnFirst(key, ()=>1, ()=>2);
        const secondRef = refCounter.topicRefMap.get(key);

        const firstRemove = refCounter.actOnLast(key, ()=>1, ()=>2);
        const thirdRef = refCounter.topicRefMap.get(key);
        const secondRemove = refCounter.actOnLast(key, ()=>1, ()=>2);
        const fourthRef = refCounter.topicRefMap.get(key);

        assert.equal(firstAdd, 1, 'actOnFirst 1');
        assert.equal(secondAdd, 2, 'actOnFirst 2');
        assert.equal(firstRef, 1, 'first ref');
        assert.equal(secondRef, 2, 'second ref');

        assert.equal(firstRemove, 2, 'actOnLast 1');
        assert.equal(secondRemove, 1, 'actOnLast 2');
        assert.equal(thirdRef, 1, 'third ref');
        assert.equal(fourthRef, 0, 'fourth ref');


    });
})
