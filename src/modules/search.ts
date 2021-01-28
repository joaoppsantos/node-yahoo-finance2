import yahooFinanceFetch = require('../lib/yahooFinanceFetch');
import validate from '../lib/validate';

const QUERY_URL = 'https://query2.finance.yahoo.com/v1/finance/search';
const QUERY_SCHEMA_KEY = "#/definitions/YahooFinanceSearchResult";

export interface YahooFinanceSearchQuote {
  exchange: string;        // "NYQ"
  shortname: string;       // "Alibaba Group Holding Limited"
  quoteType: string;       // "EQUITY"     TODO "EQUITY" | ???
  symbol: string;          // "BABA"
  index: string;           // "quotes"
  score: number;           // 1111958.0
  typeDisp: string;        // "Equity"
  longname: string;        // "Alibaba Group Holding Limited"
  isYahooFinance: boolean; // true
}

export interface YahooFinanceSearchNews {
  uuid: string;                 // "9aff624a-e84c-35f3-9c23-db39852006dc"
  title: string;                // "Analyst Report: Alibaba Group Holding Limited"
  publisher: string;            // "Morningstar Research"
  link: string;                 // "https://finance.yahoo.com/m/9aff624a-e84c-35f3-9c23-db39852006dc/analyst-report%3A-alibaba-group.html"
  providerPublishTime: number;  // 1611286342
  type: string;                 // "STORY"    TODO "STORY" | ???
}

export interface YahooFinanceSearchResult {
  explains: [];
  count: number;
  /**
   * @minItems 0
   * @maxItems 100
   */
  quotes: [YahooFinanceSearchQuote];
  /**
   * @minItems 0
   * @maxItems 100
   */
  news: [YahooFinanceSearchNews];
  /**
   * @minItems 0
   * @maxItems 100
   */
  nav: [];
  /**
   * @minItems 0
   * @maxItems 100
   */
  lists: [],
  /**
   * @minItems 0
   * @maxItems 100
   */
  researchReports: [],
  totalTime: number;
  timeTakenForQuotes: number;               // 26
  timeTakenForNews: number;                 // 419
  timeTakenForAlgowatchlist: number;        // 700
  timeTakenForPredefinedScreener: number;   // 400
  timeTakenForCrunchbase: number;           // 400
  timeTakenForNav: number;                  // 400
  timeTakenForResearchReports: number;      // 0
}

const queryOptionsDefaults = {
  lang: 'en-US',
  region: 'US',
  quotesCount: 1,
  newsCount: 0,
  enableFuzzyQuery: false,
  quotesQueryId: 'tss_match_phrase_query',
  multiQuoteQueryId: 'multi_quote_single_token_query',
  newsQueryId: 'news_cie_vespa',
  enableCb: 'true',
  enableNavLinks: 'true',
  enableEnhancedTrivialQuery: 'true'
};

async function yahooFinanceSearch(
  query: string,
  queryOptionsOverrides={},
  fetchOptions?: object
): Promise<YahooFinanceSearchResult> {
  const queryOptions = {
    q: query,
    ...queryOptionsDefaults,
    ...queryOptionsOverrides
  };

  const result = await yahooFinanceFetch(QUERY_URL, queryOptions, fetchOptions);
  validate(result, QUERY_SCHEMA_KEY);

  return result;
}

export default yahooFinanceSearch;
