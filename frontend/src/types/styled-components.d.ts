declare module 'styled-components' {
  import * as React from 'react';
  import { HTMLMotionProps } from 'framer-motion';

  export interface DefaultTheme {}

  export interface ThemeProps<T> {
    theme: T;
  }

  export type ThemedStyledProps<P, T> = P & ThemeProps<T>;

  export interface StyledComponentPropsWithRef<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > extends React.ComponentPropsWithRef<C>, O {
    children?: React.ReactNode;
    [key: string]: any; // Permite cualquier prop adicional
  }

  export interface StyledComponent<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > extends React.ForwardRefExoticComponent<StyledComponentPropsWithRef<C, T, O, A>> {}

  interface BaseStyledInterface {
    <
      C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
      O extends object = {},
      A extends keyof any = never
    >(
      component: C
    ): StyledFunction<C, DefaultTheme, O, A>;
  }

  interface StyledFunction<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > {
    <U extends object = {}>(
      strings: TemplateStringsArray,
      ...interpolations: Array<any>
    ): StyledComponent<C, T, O & U, A>;

    <U extends object = {}>(
      template: (props: ThemedStyledProps<React.ComponentProps<C> & O & U, T>) => string
    ): StyledComponent<C, T, O & U, A>;
  }

  interface StyledTags {
    div: StyledFunction<'div', DefaultTheme>;
    h1: StyledFunction<'h1', DefaultTheme>;
    h2: StyledFunction<'h2', DefaultTheme>;
    h3: StyledFunction<'h3', DefaultTheme>;
    p: StyledFunction<'p', DefaultTheme>;
    button: StyledFunction<'button', DefaultTheme>;
    textarea: StyledFunction<'textarea', DefaultTheme>;
    input: StyledFunction<'input', DefaultTheme>;
    nav: StyledFunction<'nav', DefaultTheme>;
    section: StyledFunction<'section', DefaultTheme>;
    main: StyledFunction<'main', DefaultTheme>;
  }

  interface Styled extends BaseStyledInterface, StyledTags {}

  declare const styled: Styled;

  export { styled as default };
  export const ThemeProvider: React.ComponentType<{ theme: any; children: React.ReactNode }>;
  export const createGlobalStyle: (strings: TemplateStringsArray, ...interpolations: Array<any>) => React.ComponentType;
}
