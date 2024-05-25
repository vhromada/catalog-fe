import { formatImdbCode } from '../../formatters';

export interface IWikiLink {

  wikiEn?: string;
  wikiCz?: string;

}

export interface IMediaLink {

  csfd?: string;
  imdbCode?: number;

}

export function getWikiEnUrl(wikiLink: IWikiLink): string | undefined {
  if (wikiLink.wikiEn) {
    return `https://en.wikipedia.org/wiki/${wikiLink.wikiEn}`;
  } else {
    return undefined;
  }
}

export function getWikiCzUrl(wikiLink: IWikiLink): string | undefined {
  if (wikiLink.wikiCz) {
    return `https://cz.wikipedia.org/wiki/${wikiLink.wikiCz}`;
  } else {
    return undefined;
  }
}

export function getCsfdUrl(mediaLink: IMediaLink): string | undefined {
  if (mediaLink.csfd) {
    return `https://www.csfd.cz/film/${mediaLink.csfd}`;
  } else {
    return undefined;
  }
}

export function getImdbUrl(mediaLink: IMediaLink): string | undefined {
  if (mediaLink.imdbCode) {
    return `https://www.imdb.com/title/tt${formatImdbCode(mediaLink.imdbCode)}`;
  } else {
    return undefined;
  }
}
