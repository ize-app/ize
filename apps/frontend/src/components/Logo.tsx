import styled from '@emotion/styled';

// This is just a placeholder logo
export const Logo = styled.div<{ fontSize: number }>`
  color: var(--m-3-sys-light-primary, #6750A4);
  font-family: Roboto;
  font-style: italic;
  font-weight: 700;
  font-size: ${props => props.fontSize}px;
  line-height: ${props => props.fontSize}px;
`
