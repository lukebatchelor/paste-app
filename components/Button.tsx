import styled from '@emotion/styled';

type ButtonProps = {
  fullWidth?: boolean;
  padding?: string;
  background?: string;
};
export const Button = styled('button')<ButtonProps>`
  font-size: 18px;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  padding: ${(props) => props.padding || '16px'};
  background: ${(props) => props.background || '#00debf'};
`;
