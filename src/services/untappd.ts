// External Dependencies
import BluebirdRequest from 'request-promise'

// Secrets
const untappdClientID = process.env.UNTAPPD_CLIENT_ID
const untappdClientSecret = process.env.UNTAPPD_CLIENT_SECRET

export interface beerSearchRes {
	found: number
	offset: number
	limit: number
	term: string
	parsed_term: string
	beers: {
		count: number,
		items: beerSearchBeer[]
	}
}

export interface beerSearchBeer {
	checkin_count: number,
	have_had: true,
	your_count: number
	beer: {
		bid: number,
		beer_name: string,
		beer_slug: string,
		beer_label: string,
		beer_abv: number,
		beer_ibu: number,
		beer_description: string,
		created_at: Date,
		beer_style: string,
		auth_rating: number,
		wish_list: boolean,
		in_production: number
	},
	brewery: {
		brewery_id: number,
		brewery_name: string,
		brewery_slug: string,
		brewery_label: string,
		country_name: string,
		contact: {
			twitter: string,
			facebook: string,
			instagram: string,
			url: string
		},
		location: {
			brewery_city: string,
			brewery_state: string,
			lat: number,
			lng: number
		}
	}
}

const beerSearch = (beerName: string) => {
	const requestOptions = {
		method: 'GET',
		uri: 'https://api.untappd.com/v4/search/beer',
		qs: {
			q: beerName,
			client_id: untappdClientID,
			client_secret: untappdClientSecret,
		},
		json: true,
	}
	return BluebirdRequest(requestOptions)
}

export interface beerInfoRes {
	beer: {
		bid: number,
		beer_name: string,
		beer_label: string,
		beer_abv: number,
		beer_ibu: number,
		beer_description: string,
		beer_style: string,
		is_in_production: number,
		beer_slug: string,
		is_homebrew: number,
		created_at: Date,
		rating_count: number,
		rating_score: number,
		stats: {
			total_count: number,
			monthly_count: number,
			total_user_count: number,
			user_count: number
		},
		brewery: {
			brewery_id: number,
			brewery_name: string,
			brewery_slug: string,
			brewery_label: string,
			country_name: string,
			contact: {
				twitter: string,
				facebook: string,
				url: string
			},
			location: {
				brewery_city: string,
				brewery_state: string,
				lat: number,
				lng: number
			}
		},
		auth_rating: number,
		wish_list: boolean,
	}
}

const beerInfo = (bid: number) => {
	const requestOptions = {
		method: 'GET',
		uri: `https://api.untappd.com/v4/beer/info/${bid}`,
		qs: {
			client_id: untappdClientID,
			client_secret: untappdClientSecret,
		},
		json: true,
	}
	return BluebirdRequest(requestOptions)
}

export default {
	beerSearch,
	beerInfo,
}
