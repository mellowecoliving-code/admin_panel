import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-lg font-semibold text-gray-900">Something went wrong.</p>
          <p className="text-sm text-gray-500">
            Please refresh the page. If this keeps happening, check the server logs.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-[#003B95] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0B3B95]"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
