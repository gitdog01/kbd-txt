'use strict';
const { convert, parseToToken, normalizeToken } = require('./dist/index.js');
const utils = require('./dist/utils.js');

describe('parseToToken', () => {
  test('platform이 Mac일 경우, $mod가 meta로 변환된다.', () => {
    jest.spyOn(utils, 'isIOS').mockImplementation(() => true);
    expect(parseToToken('$mod')).toEqual(['Meta']);
  });
  test('platform이 Window일 경우, $mod가 Control로 변환된다.', () => {
    jest.spyOn(utils, 'isIOS').mockImplementation(() => false);
    expect(parseToToken('$mod')).toEqual(['Control']);
  });
  test('Meta를 나타내는 키워드들이 Meta로 변환된다.', () => {
    expect(parseToToken('command+cmd+⌘')).toEqual(['Meta', 'Meta', 'Meta']);
    expect(parseToToken('Command+Cmd+⌘')).toEqual(['Meta', 'Meta', 'Meta']);
    expect(parseToToken('COMMAND+CMD+⌘')).toEqual(['Meta', 'Meta', 'Meta']);
  });
  test('Alt를 나타내는 키워드들이 Alt로 변환된다.', () => {
    expect(parseToToken('alt+option+⌥')).toEqual(['Alt', 'Alt', 'Alt']);
    expect(parseToToken('Alt+Option+⌥')).toEqual(['Alt', 'Alt', 'Alt']);
    expect(parseToToken('ALT+OPTION+⌥')).toEqual(['Alt', 'Alt', 'Alt']);
  });
  test('Control을 나타내는 키워드들이 Control로 변환된다.', () => {
    expect(parseToToken('control+ctrl+^')).toEqual([
      'Control',
      'Control',
      'Control',
    ]);
    expect(parseToToken('Control+Ctrl+^')).toEqual([
      'Control',
      'Control',
      'Control',
    ]);
    expect(parseToToken('CONTROL+CTRL+^')).toEqual([
      'Control',
      'Control',
      'Control',
    ]);
  });
  test('meta, alt, control 외의 키워드들은 소문자로 변환된다.', () => {
    expect(parseToToken('A+B+c+d+!+@+#+1+2+3')).toEqual([
      'a',
      'b',
      'c',
      'd',
      '!',
      '@',
      '#',
      '1',
      '2',
      '3',
    ]);
  });
});

describe('normalizeToken', () => {
  test('기본 옵션일 경우, +로 합쳐지고 첫 글자를 upper로 변환한다.', () => {
    jest.spyOn(utils, 'isIOS').mockImplementation(() => true);
    expect(normalizeToken(['Control', 'k'])).toEqual('Control+K');

    jest.spyOn(utils, 'isIOS').mockImplementation(() => false);
    expect(normalizeToken(['Control', 'k'])).toEqual('Ctrl+K');
  });
  test('separator가 -일 경우, -로 합쳐지고 첫 글자를 upper로 변환한다.', () => {
    jest.spyOn(utils, 'isIOS').mockImplementation(() => false);
    expect(normalizeToken(['Control', 'k'], { separator: '-' })).toEqual(
      'Ctrl-K',
    );
  });
  test('useSymbol이 true일 경우, mac은 심볼로 표시하고 window는 기본과 동일하게 표시한다.', () => {
    jest.spyOn(utils, 'isIOS').mockImplementation(() => true);
    expect(normalizeToken(['Control', 'k'], { useSymbol: true })).toEqual(
      '^+K',
    );

    jest.spyOn(utils, 'isIOS').mockImplementation(() => false);
    expect(normalizeToken(['Control', 'k'], { useSymbol: true })).toEqual(
      'Ctrl+K',
    );
  });
});
// describe('convert - platform이 Mac일 경우', () => {
//   test('Mac shortcut 표기법에 맞게 표시된다.', () => {
//     jest.spyOn(utils, 'isIOS').mockImplementation(() => true);
//     expect(convert('$mod')).toBe('Command');
//     expect(convert('Shift+K')).toBe('Shift+K');
//     expect(convert('$mod+Shift+K')).toBe('Command+Shift+K');
//   });
//   test('splitSeparator가 존재할 경우, 해당 문자열 기준으로 잘라낸다.', () => {
//     jest.spyOn(utils, 'isIOS').mockImplementation(() => true);
//     const options = {
//       splitSeparator: '-',
//     };
//     expect(convert('Shift-K', options)).toBe('Shift+K');
//     expect(convert('$mod-Shift-K', options)).toBe('Command+Shift+K');
//   });
//   test('joinSeparator가 존재할 경우, 해당 문자열을 사용해서 병합된다.', () => {
//     jest.spyOn(utils, 'isIOS').mockImplementation(() => true);
//     const options = {
//       joinSeparator: '-',
//     };
//     expect(convert('Shift+K', options)).toBe('Shift-K');
//     expect(convert('$mod+Shift+K', options)).toBe('Command-Shift-K');
//   });
// });

// describe('convert - platform이 Window/Server일 경우', () => {
//   test('window shortcut 표기법에 맞게 표시된다.', () => {
//     jest.spyOn(utils, 'isIOS').mockImplementation(() => false);
//     expect(convert('$mod')).toBe('Ctrl');
//     expect(convert('Shift+K')).toBe('Shift+K');
//     expect(convert('$mod+Shift+K')).toBe('Ctrl+Shift+K');
//   });
// });