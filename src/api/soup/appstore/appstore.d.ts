type GenreId =
	| '6000'
	| '6001'
	| '6002'
	| '6003'
	| '6004'
	| '6005'
	| '6006'
	| '6007'
	| '6008'
	| '6009'
	| '6010'
	| '6011'
	| '6012'
	| '6013'
	| '6014'
	| '6015'
	| '6016'
	| '6017'
	| '6018'
	| '6020'
	| '6021'
	| '6022'
	| '6023'
	| '6024'
	| '6025'
	| '6026'
	| '6027'
	| '7001'
	| '7002'
	| '7003'
	| '7004'
	| '7005'
	| '7006'
	| '7007'
	| '7008'
	| '7009'
	| '7011'
	| '7012'
	| '7013'
	| '7014'
	| '7015'
	| '7016'
	| '7017'
	| '7018'
	| '7019';

export type ITunesApp = {
	trackId: number;
	trackName: string;
	bundleId: string;
	artworkUrl512?: string;
	artworkUrl100?: string;
	sellerUrl?: string;
	description?: string;
	genreIds?: GenreId[];
};

export type ITunesSearchResponse = {
	resultCount: number;
	results: ITunesApp[];
};
