/* eslint-disable */
// External Dependencies
import { expect } from 'chai';

// Internal Dependencies
import UntappdService from '../../src/services/untappd';

describe('Untappd Service', function () {
  this.timeout(10000);

  describe('beerSearch', function () {
    it('should get a set of matching search results', async function () {
      const beerName = 'Rubinator';
        const results = await UntappdService.beerSearch(beerName);
        expect(results).to.exist;
        expect(results.meta.code).to.eq(200);
        expect(results.response.beers.items).to.have.length.above(0)
        expect(results.response.beers.items[0].beer.beer_name).to.eq(beerName)
      });
  });

  describe('beerInfo', function () {
    it('should get the info for a beer', async function () {
      const beerID = '190118';
      const beerName = 'Rubinator';
      const results = await UntappdService.beerInfo(beerID);
      expect(results).to.exist;
      expect(results.meta.code).to.eq(200);
      expect(results.response.beer.bid).to.eq(Number(beerID));
      expect(results.response.beer.beer_name).to.eq(beerName);
    });
  });
});