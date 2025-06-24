import React from "react";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong rendering the pricing table.</h2>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
