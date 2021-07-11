/* Originally based on https://github.com/hemlok/emotion-box */

import styled from '@emotion/styled';

const justifyMap = {
  start: 'flex-start',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  center: 'center',
  'space-evenly': 'space-evenly',
};

const alignMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
};

type Justify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

type Align = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

export interface Props {
  wrap?: boolean;
  grow?: boolean;
  inline?: boolean;
  justify?: Justify;
  align?: Align;
}

const Box = styled('div')<Props>`
  display: flex;
  justify-content: ${(props) => (props.justify ? justifyMap[props.justify] : justifyMap['center'])};
  align-items: ${(props) => (props.align ? alignMap[props.align] : alignMap['center'])};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'no-wrap')};
  flex-grow: ${(props) => (props.grow ? 1 : 0)};
  width: ${(props) => (props.inline ? 'auto' : '100%')};
  position: relative;
`;

export const Row = styled(Box)`
  flex-direction: row;
`;

export const Column = styled(Box)`
  flex-direction: column;
`;

export default Box;
