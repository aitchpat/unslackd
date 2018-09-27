/* eslint-disable */

// External Dependencies
import { expect } from 'chai';

// Internal Dependencies
import UntappdOperations from '../../src/operations/untappd';

describe('Untappd Operations', function () {
  this.timeout(10000);
  
  describe('processSearchResults', function () {
    it('should process the search results into attachments.', async function () {
      const beerName = 'Rubinator';
      const results = await UntappdOperations.processSearchResults(beerName);
      expect(results).to.exist;
      expect(results.attachments).to.exist;
      expect(results.attachments).to.have.length.above(0);
      expect(results.attachments[0]!.title).to.eq(beerName);
    });
  });

  describe('createBeerAttachment', function () {
      it('should create an attachment from beer info.', function () {
        const theBeer = {
          brewery: {
            brewery_name: 'test-brewery-name',
            brewery_slug: 'test-brewery-slug',
            brewery_id: 'test-brewery-id',
            brewery_label: 'test-brewery-label',
          },
          beer: {
            beer_name: 'test-beer-name',
            beer_slug: 'test-beer-slug',
            bid: 'test-bid',
            beer_description: 'test-beer-description',
            beer_style: 'test-beer-style',
            beer_label: 'test-beer-label',
          },
        };
        const theBeerRating = 4;
        const theBeerNumRatings = 100;

        const beerAttachment = UntappdOperations.createBeerAttachment(theBeer, theBeerRating, theBeerNumRatings);
        expect(beerAttachment).to.exist
        expect(beerAttachment.author_name).to.eq(theBeer.brewery.brewery_name);
        expect(beerAttachment.author_link).to.eq(`https://untappd.com/w/${theBeer.brewery.brewery_slug}/${theBeer.brewery.brewery_id}`);
        expect(beerAttachment.author_icon).to.eq(theBeer.brewery.brewery_label);
        expect(beerAttachment.title).to.eq(theBeer.beer.beer_name);
        expect(beerAttachment.title_link).to.eq(`https://untappd.com/b/${theBeer.beer.beer_slug}/${theBeer.beer.bid}`);
        expect(beerAttachment.text).to.eq(theBeer.beer.beer_description);
        expect(beerAttachment.fields[0].value).to.eq(`${theBeerRating}/5 from ${theBeerNumRatings} reviews`);
        expect(beerAttachment.fields[1].value).to.eq(theBeer.beer.beer_style);
        expect(beerAttachment.image_url).to.eq(theBeer.beer.beer_label);
      });
  });
});
