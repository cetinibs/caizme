declare module 'react-google-recaptcha' {
  import * as React from 'react';
  
  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    grecaptcha?: any;
    theme?: 'dark' | 'light';
    size?: 'compact' | 'normal' | 'invisible';
    tabindex?: number;
    onExpired?: () => void;
    onErrored?: () => void;
    onLoad?: () => void;
    hl?: string;
    ref?: React.RefObject<any>;
  }
  
  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): Promise<string>;
    executeAsync(): Promise<string>;
    getValue(): string | null;
  }
}
