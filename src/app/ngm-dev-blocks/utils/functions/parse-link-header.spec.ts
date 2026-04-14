/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update utils/functions`
*/

import { parseLinkHeader } from './parse-link-header';

describe('parseLinkHeader', () => {
  it('should parse the GitHub example correctly', () => {
    const linkHeader =
      '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
      '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev"; pet="cat", ' +
      '<https://api.github.com/user/9287/repos?page=5&per_page=100>; rel="last"';

    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        page: '3',
        per_page: '100',
        rel: 'next',
        url: 'https://api.github.com/user/9287/repos?page=3&per_page=100',
      },
      prev: {
        page: '1',
        per_page: '100',
        rel: 'prev',
        pet: 'cat',
        url: 'https://api.github.com/user/9287/repos?page=1&per_page=100',
      },
      last: {
        page: '5',
        per_page: '100',
        rel: 'last',
        url: 'https://api.github.com/user/9287/repos?page=5&per_page=100',
      },
    });
  });

  it('should handle simple single link', () => {
    const linkHeader = '<https://api.example.com/data?page=2>; rel="next"';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        page: '2',
        rel: 'next',
        url: 'https://api.example.com/data?page=2',
      },
    });
  });

  it('should handle parameters without quotes', () => {
    const linkHeader =
      '<https://api.example.com/data>; rel=next; type=application/json';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        rel: 'next',
        type: 'application/json',
        url: 'https://api.example.com/data',
      },
    });
  });

  it('should handle empty input', () => {
    expect(parseLinkHeader('')).toEqual({});
    expect(parseLinkHeader(null as any)).toEqual({});
    expect(parseLinkHeader(undefined as any)).toEqual({});
  });

  it('should handle malformed links gracefully', () => {
    const linkHeader =
      'invalid-link; rel="next", <https://valid.com>; rel="prev"';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      prev: {
        rel: 'prev',
        url: 'https://valid.com',
      },
    });
  });

  it('should handle links without rel parameter', () => {
    const linkHeader = '<https://example.com>; type="text/html"';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({});
  });

  it('should handle complex URL with multiple parameters', () => {
    const linkHeader =
      '<https://api.example.com/search?q=test&sort=name&order=asc&page=2>; rel="next"; title="Next Page"';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        q: 'test',
        sort: 'name',
        order: 'asc',
        page: '2',
        rel: 'next',
        title: 'Next Page',
        url: 'https://api.example.com/search?q=test&sort=name&order=asc&page=2',
      },
    });
  });

  it('should handle whitespace variations', () => {
    const linkHeader =
      '  <https://example.com>  ;  rel="next"  ,  <https://example2.com> ; rel="prev"  ';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        rel: 'next',
        url: 'https://example.com',
      },
      prev: {
        rel: 'prev',
        url: 'https://example2.com',
      },
    });
  });

  it('should override URL parameters with link parameters when both exist', () => {
    const linkHeader = '<https://example.com?page=1>; rel="next"; page="2"';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        page: '2', // Link parameter should override URL parameter
        rel: 'next',
        url: 'https://example.com?page=1',
      },
    });
  });

  it('should handle special characters in parameter values', () => {
    const linkHeader =
      '<https://example.com>; rel="next"; title="Page with spaces & symbols"';
    const result = parseLinkHeader(linkHeader);

    expect(result).toEqual({
      next: {
        rel: 'next',
        title: 'Page with spaces & symbols',
        url: 'https://example.com',
      },
    });
  });
});
